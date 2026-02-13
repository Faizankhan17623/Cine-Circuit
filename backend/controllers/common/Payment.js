const CreateShow = require('../../models/CreateShow')
const Payment = require('../../models/payment')
const instance = require('../../config/razorpay')
const USER = require('../../models/user');
const Theatrestickets = require('../../models/TheatresTicket');
const Theatre = require('../../models/Theatres');
const date = require('date-and-time');
const crypto = require('crypto');
const session = require('express-session');
const mongoose = require('mongoose')
const mailSender = require('../../utils/mailsender')
const generatePDF = require('../../templates/userTemplates/sendPdf')
const TicketTemplate = require('../../templates/userTemplates/TicketTemplate')
const PdfTemplate = require('../../templates/userTemplates/pdfTemplate')
const ticket = require('../../models/ticket')

// Student Features api kar ke ek page hain github main usko dekh lena agay payment ke isme kuch issue aaye to 


// This is the function that is present in the route of payment on line no 6
exports.MakePayment = async(req,res) => {
    try {
        const ShowId = req.body.ShowId
        const Theatreid = req.body.Theatreid
        const Ticketid = req.body.Ticketid
        const userId = req.body.userId
        const{Categories,totalTickets,time} = req.body

        if(!userId){
            return res.status(400).json({
                message:"You are not logged in please log in",
                success:false
            })
        }

        // Input validation checks
        if(Categories.length !== totalTickets.length){
            return res.status(400).json({
                message:"The categories and the total tickets needed do not match check your inputs",
                success:false
            })
        }

        // Verify user, show, theatre and tickets exist
        const [UserFinders, Showearching, Theatrearching, TheatreTicketsrearching] = await Promise.all([
            USER.findOne({_id:userId}),
            CreateShow.findOne({_id:ShowId}),
            Theatre.findOne({_id:Theatreid}),
            Theatrestickets.findOne({_id:Ticketid,showId:ShowId})
        ]);

        if(!UserFinders || !Showearching || !Theatrearching || !TheatreTicketsrearching){
            return res.status(404).json({
                message:"Required data not found",
                success:false
            })
        }

        const Theatreticketsdata  = await Theatrestickets.findOne({_id:Ticketid,showId:ShowId})
        if(!Theatreticketsdata){
            return res.status(404).json({
                message:"The tickets are not found",
                success:false
            })}

        // console.log("Theatreticketsdata",Theatreticketsdata)
        // Validate time and status
        const isTimeAvailable = TheatreTicketsrearching.timings.includes(time);
        // console.log("checking the time",isTimeAvailable)
        if (!isTimeAvailable) {
            return res.status(400).json({
                message: "Selected time is not available.",
                success: false
            });
        }

        if(Showearching.movieStatus === "Expired" || TheatreTicketsrearching.Status === "Expired"){
            return res.status(400).json({
                message:"Show or tickets are expired",
                success:false
            })
        }
        
        // Validate ticket categories and availability
        const results = await Promise.all(
                Categories.map(async (categoryId, index) => {
                    const category = TheatreTicketsrearching.ticketsCategory.find(
                        ticket => ticket._id.toString() === categoryId
                    );
                    
                    if (!category) {
                        throw new Error("Invalid category or ticket not found.");
                    }
            
                    const requestedTickets = parseInt(totalTickets[index]);
                    const availableTickets = category.ticketsPurchaseafterRemaining;
            
                    // Enhanced validation with detailed error message
                    if(availableTickets < requestedTickets) {
                        throw new Error(
                            `Not enough tickets available for ${category.category}. ` +
                            `Requested: ${requestedTickets}, Available: ${availableTickets}`
                        );
                    }
            
                    // Additional validation for non-negative values
                    if(requestedTickets <= 0) {
                        throw new Error(`Invalid ticket quantity for ${category.category}. Must be greater than 0`);
                    }
                    
                    return category;
                })
            
        );
        
// ned to add two to three more check like the you cannot purchase the same ticket twice for the same time but you can buy it from the same theatre for the anotherr time 

        const SameTimeFinding = await Payment.findOne({
            userid: userId,
            theatreid: Theatreid,
            showid: ShowId,
            time: time,
        })
        // console.log("SameTimeFinding",SameTimeFinding)
        if(SameTimeFinding){
            return res.status(400).json({
                message:"You have already purchased tickets for this time go and purchase for antoher time",
                success:false
            })
        }

        // Check for duplicate categories and max tickets
        if (new Set(Categories).size !== Categories.length) {
            return res.status(400).json({
                message: "Duplicate categories selected",
                success: false
            });
        }

        for(let tickets of totalTickets){
            if(parseInt(tickets) > 5){
                return res.status(400).json({
                    message:"Cannot purchase more than 10 tickets per category",
                    success:false
                })
            }
        }

        // Calculate total amount
        let totalAmount = results.reduce((sum, category, index) => {
            return sum + (category.price * parseInt(totalTickets[index] || 0));
        }, 0);

        // Create Razorpay order
        const Options = {
            amount: Math.round(totalAmount*100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        }

        const order = await instance.orders.create(Options);
        if (!order) {
            throw new Error("Unable to create Razorpay order");
        }

        // Create payment record
        const now = new Date();
        const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss');
        const ps = date.format(now, pattern);

        const PaymentStatus = await Payment.create({
            userid: userId,
            Showdate:Theatreticketsdata.Date,
            theatreid: Theatreid,
            purchaseDate: ps,
            razorpay_order_id: order.id,
            totalTicketpurchased: totalTickets.reduce((a, b) => parseInt(a) + parseInt(b), 0),
            amount: totalAmount,
            showid: ShowId,
            Payment_Status: 'created',
            time:time,
            ticketCategorey: results.map((category, index) => ({
                categoryid: category._id,
                categoryName: category.category,
                price: category.price,
                ticketsPurchased: totalTickets[index]
            }))
        });
        // const yes = "222222"    o not delete this keeep it for the testing purpose

        const twominutes =   50 * 1000; // 2 minutes in milliseconds

        // console.log(UserFinders)
        
        setTimeout(async () => {
            const mailes = await mailSender(UserFinders.email,"Payment Success",TicketTemplate(PaymentStatus));
            console.log("Email sent successfully:");
        },twominutes)

        return res.status(200).json({
            message: "Order created successfully",
            success: true,
            order: order,
            data: PaymentStatus
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
}
// ghty jxxh msvw vkad
// This is the function that is present in the route of payment on line no 7
exports.Verifypayment = async(req,res) => {
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, paymentId} = req.body;
        // console.log("loggin the order id",razorpay_order_id)
        if(!userId || !razorpay_order_id || !razorpay_signature || !razorpay_payment_id || !paymentId){
            return res.status(400).json({
                message: "All payment details are required",
                success: false
            });
        }

        const [UserFinders, PaymentVerifier] = await Promise.all([
            USER.findOne({_id: userId}),
            Payment.findOne({_id: paymentId})
        ]);

        if(!UserFinders || !PaymentVerifier) {
            return res.status(404).json({
                message: "User or payment not found",
                success: false
            });
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const ExpectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRETS)
            .update(body.toString())
            .digest('hex');

        if(ExpectedSignature === razorpay_signature) {
            const session = await mongoose.startSession();
            try {
                session.startTransaction();
                const paymentDetails = await instance.payments.fetch(razorpay_payment_id);
                // console.log("Payment details:", paymentDetails);

                const now = new Date();
                const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss');
                const ps = date.format(now, pattern);

                // Update payment status
                const updatedPayment = await Payment.findOneAndUpdate(
                    { razorpay_order_id },
                    { 
                        Payment_Status: "success",
                        razorpay_payment_id,
                        razorpay_signature,
                        purchaseDate: ps,
                        paymentDate: ps,
                        paymentMethod: paymentDetails.method,
                    },
                    { new: true, session }
                );

                // Update tickets
                const createTicket = await Theatrestickets.findOne({
                    showId: PaymentVerifier.showid,
                    theatreId: PaymentVerifier.theatreid
                }).session(session);

                if (!createTicket) {
                    throw new Error("Ticket document not found");
                }

                // Update ticket quantities atomically
                for (const category of PaymentVerifier.ticketCategorey) {
                    const categoryIndex = createTicket.ticketsCategory.findIndex(
                        cat => cat.category === category.categoryName
                    );
                
                    if (categoryIndex === -1) {
                        throw new Error(`Category ${category.categoryName} not found`);
                    }
                
                    const currentCategory = createTicket.ticketsCategory[categoryIndex];
                    const requestedTickets = parseInt(category.ticketsPurchased);
                    const availableTickets = currentCategory.ticketsPurchaseafterRemaining;
                
                    // Enhanced validation with detailed error message
                    if (availableTickets < requestedTickets) {
                        throw new Error(
                            `Cannot complete purchase for ${category.categoryName}. ` +
                            `Requested: ${requestedTickets} tickets, ` +
                            `Available: ${availableTickets} tickets. ` +
                            `Please try again with a smaller quantity.`
                        );
                    }
                
                    currentCategory.ticketsPurchaseafterRemaining -= requestedTickets;
                
                    // Additional validation after update
                    if (currentCategory.ticketsPurchaseafterRemaining < 0) {
                        throw new Error(
                            `System error: Negative ticket count for ${category.categoryName}. ` +
                            `Please contact support.`
                        );
                    }
                }

                createTicket.ticketsPurchased.push(paymentId);
                await createTicket.save({ session });
                // console.log(updatedPayment)
                // console.log(createTicket)
                // Update user's payment record

                await USER.findByIdAndUpdate(userId,{$push:{PaymentId:paymentId}})
                const paymentIds = await Payment.findOne({_id: paymentId})
                if(!paymentIds){
                    return res.status(400).json({
                        message:"The payment is not present",
                        success:false
                    })
                }
                await CreateShow.findByIdAndUpdate(paymentIds.showid,{
                    $push:{
                        ticketspurchased:userId
                    }
                },{new:true})
                // let otp = 231321321
                // const mailes = await mailSender(
                //     UserFinders.email,
                //     "Payment Success",
                //     TicketTemplate(otp)
                // );
                // console.log("Email sent successfully:", mailes);

                await session.commitTransaction();

                return res.status(200).json({
                    message: "Payment verified successfully",
                    success: true
                });

            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }
        } else {
            // Payment verification failed - update status to failure
            const now = new Date();
            const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss');
            const ps = date.format(now, pattern);

            await Payment.findOneAndUpdate(
                { razorpay_order_id },
                {
                    Payment_Status: "failure",
                    razorpay_payment_id: razorpay_payment_id || null,
                    razorpay_signature: razorpay_signature || null,
                    purchaseDate: ps,
                    paymentDate: ps,
                    failureReason: "Signature verification failed"
                }
            );

            return res.status(400).json({
                message: 'Payment verification failed',
                success: false,
                status: "failure"
            });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        
        // Update payment status to failure in case of any error
        const now = new Date();
        const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss');
        const ps = date.format(now, pattern);

        try {
            await Payment.findOneAndUpdate(
                { razorpay_order_id: req.body.razorpay_order_id },
                {
                    Payment_Status: "failure",
                    failureReason: error.message || "Payment verification failed",
                    paymentDate: ps
                }
            );
        } catch (dbError) {
            console.error("Failed to update payment status:", dbError);
        }

        return res.status(500).json({
            message: error.message || "Payment verification failed",
            success: false,
            status: "failure"
        });
    }
}



exports.MakePdf = async(req,res)=>{
    try{
        const { ticketId } = req.params;

        // Find ticket in database
        const ticketData = await Payment.findOne({_id:ticketId})
        if(!ticketData){
            return res.status(400).json({
                message:"The Ticket data is not present",
                success:false
            })
        }

        const MovieFind = await CreateShow.findOne({_id:ticketData.showid})
        if(!MovieFind){
            return res.status(400).json({
                message:"The movie is not present",
                success:false
            })
        }


        const TheatreFind = await Theatre.findOne({_id:ticketData.theatreid})

        if(!TheatreFind){
            return res.status(400).json({
                message:"The Theatre is not present",
                success:false
            })
        }
    console.log("This is the ticket data",ticketData)
  // build exactly what the PDF template expects
  const templateData = {
    movieName:    MovieFind.title,
    theatreName:  TheatreFind.Theatrename,
    theatreLocation: TheatreFind.locationname,
    Showdate:     ticketData.Showdate,
    time:         ticketData.time,
    purchaseDate: ticketData.purchaseDate,
    Payment_Status: ticketData.Payment_Status,
    paymentMethod:  ticketData.paymentMethod,
    totalTicketpurchased: ticketData.totalTicketpurchased,
    amount:          ticketData.amount,
    categoryDetails: ticketData.ticketCategorey.map(cat => ({
      categoryName:  cat.categoryName,
      ticketCount:   cat.ticketsPurchased,
      price:         cat.price
    }))
  };

  console.log("templateData",templateData)

  const html = PdfTemplate(templateData);

  const pdfBuffer = await generatePDF(html);

  res
    .status(200)
    .set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="ticket-${ticketId}.pdf"`
    })
    .send(pdfBuffer);
    }catch(error){
        console.error('PDF generation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating PDF',
            error: error.message 
        });
    }
}