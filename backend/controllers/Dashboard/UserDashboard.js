const USER = require('../../models/user')
const Payment = require('../../models/payment')
const CreateShow = require('../../models/CreateShow')
const Theatre = require('../../models/Theatres');
const genre = require('../../models/genre')
const Theatrestickets = require('../../models/TheatresTicket')

exports.TicketPurchased = async(req,res)=>{
    try {
        const userId = req.USER.id;

        if(!userId){
            return res.status(400).json({message:"User ID not found"});
        }

        const user = await USER.findOne({_id:userId}).populate('Casttaken')

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const paymentId = await Promise.all(
            user.PaymentId.map(async (payment) => {
                    const datas = await Payment.findOne({ _id: payment });
                    
                    if(!datas){
                        return res.status(404).json({message:"Payment not found"});
                    }
    
                    return datas
                })
        )

            if(!paymentId){
                return res.status(404).json({message:"Payment not found"});
            }
            

            const validTickets = paymentId.filter(ticket => ticket !== null);

        if(validTickets.length === 0){
            return res.status(404).json({
                success: false,
                message:"No ticket details found"
            });
        }

            return res.status(200).json({
                message:"Payments found",
                success:true,
                count: validTickets.length,
                data: validTickets
            });

    } catch (error) {
        console.log(error);
        console.log("Error in UserDashboard controller",error.message);
        res.status(500).json({message:"Internal Server Error"});        
    }
}

exports.TicketPurchasedFullDetails = async(req,res)=>{
    try {
        const userId = req.USER.id;

        if(!userId){
            return res.status(400).json({
                success: false,
                message:"User ID not found"
            });
        }

        const user = await USER.findOne({_id:userId}).populate('Casttaken');

        if(!user){
            return res.status(404).json({
                success: false,
                message:"User not found"
            });
        }

        // Use Promise.all to handle async operations
        const ticketDetails = await Promise.all(
            user.PaymentId.map(async (payment) => {
                try {
                    const datas = await Payment.findOne({ _id: payment });
                    if(!datas) return null;

                    const [showDetails, TheatreDetails] = await Promise.all([
                        CreateShow.findOne({_id: datas.showid}),
                        Theatre.findOne({_id: datas.theatreid})
                    ]);

                    if(!showDetails || !TheatreDetails) return null;

                    // Transform ticket categories for better readability
                    const transformedTickets = datas.ticketCategorey.map(ticket => ({
                        category: ticket.categoryName,
                        quantity: ticket.ticketsPurchased,
                        price: ticket.price,
                        totalAmount: parseInt(ticket.price) * parseInt(ticket.ticketsPurchased)
                    }));

                    return {
                        paymentDetails: {
                            ...datas.toObject(),
                            ticketCategorey: transformedTickets
                        },
                        showDetails: showDetails.toObject(),
                        theatreDetails: TheatreDetails.toObject()
                    };
                } catch (error) {
                    console.log("Error processing payment:", payment, error);
                    return null;
                }
            })
        );

        // Filter out null values
        const validTickets = ticketDetails.filter(ticket => ticket !== null);

        if(validTickets.length === 0){
            return res.status(404).json({
                success: false,
                message:"No ticket details found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket details found successfully",
            count: validTickets.length,
            data: validTickets
        });

    } catch (error) {
        console.log("Error in UserDashboard controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });        
    }
}


exports.BannerMovies = async(req,res)=>{
    try{

        const AllMovies = await  CreateShow.find({ uploaded: true, VerifiedByTheAdmin: true })
if (!AllMovies || AllMovies.length === 0) {
            return res.status(404).json({
                message: "Movies not found",
                success: false
            })
        }


             const MostLiked = [...AllMovies].sort((a, b) => {
            return (b.BannerLiked || 0) - (a.BannerLiked || 0)
        })[0] // Take the first one (highest)

        // 2. Recently Created Movie (most recent createdAt)
        const RecentlyCreated = [...AllMovies].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })[0] // Take the first one (most recent)

              const ComingSoon = AllMovies.filter((movie) => {
            return movie.movieStatus === "Upcoming" || movie.movieStatus === "Coming Soon"
        }).sort((a, b) => {
            return new Date(a.releasedate) - new Date(b.releasedate)
        }) // Sort by release date (earliest first)


        // Kep this we will work on this later onwrda
        // const MostRates = [...AllMovies].sort((a, b) => {
        //     return (b.BannerLiked || 0) - (a.BannerLiked || 0)
        // })[0] // Take the first one (highest)

          const TopThreeTrending = [...AllMovies].sort((a, b) => {
            return (b.ticketspurchased || 0) - (a.ticketspurchased || 0)
        }).slice(0,3) // Take the first one (highest)


         return res.status(200).json({
            message: "Banner movies fetched successfully",
            success: true,
            data: {
                mostLiked: MostLiked,
                recentlyCreated: RecentlyCreated,
                comingSoon: ComingSoon,
                topTrending: TopThreeTrending // ✅ Array of 3 movies
            }
        })


    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("Theere is an error in the banner movies code")
    }
}


exports.FIndusingMOvieTags = async(req,res)=>{
    try{
            const {movies} = req.body
            if (!movies || typeof movies !== "string") {
        return res.status(400).json({
            message: "Input is required",
            success: false,
        });
        }

        const Finder = await genre.findOne({genreName:movies})
          if (!Finder) {
      return res.status(404).json({
        message: "Invalid tag",
        success: false,
      });
    }

        const MovieFinding = await CreateShow.find({
      genre: Finder._id,
    });

    if (!MovieFinding || MovieFinding.length === 0) {
      return res.status(404).json({
        message: "No Movies found",
        success: false,
      });
    }

       return res.status(200).json({
      message: "Movies fetched successfully",
      success: true,
      data: MovieFinding,
    });
    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("Theere is an error in the Find movie code")
    }
}



exports.FindWholeMoviesData = async (req,res)=>{
    try{

        const {location,movie,theatre,date} = req.body


       if (!location || !movie || !theatre||!date) {
            return res.status(400).json({
                success: false,
                message: "All input fields are required"
            });
        }

      const finding = await Theatre.findOne({
            locationName: location,
            Theatrename: theatre
        });

          if (!finding) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found in this location"
            });
        }

       const MovieFinding = await CreateShow.findOne({
            title: movie,
             AllotedToTheNumberOfTheatres: finding._id
        });

         if (!MovieFinding) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }


         const mainData = await Theatrestickets.findOne({
            theatreId: finding._id,
            Date: date
        });

        if (!mainData) {
            return res.status(404).json({
                success: false,
                message: "No shows available for this date"
            });
        }

// const data = {
//     ...finding.toObject(),
//     ...MovieFinding.toObject(),
//     ...mainData.toObject()
// };
        return res.status(200).json({
            message:"date send ",
            success:true,
            data: [{
   theatre: finding,
   movie: MovieFinding,
   tickets: mainData
}]

        })


    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("There is an error in the find whole movie date code ")
    }
}