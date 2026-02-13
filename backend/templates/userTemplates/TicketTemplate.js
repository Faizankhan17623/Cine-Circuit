const ticketTemplate = (data) => {
    // console.log(data);
    let timeChnage = data.time;
    if(timeChnage) {
        timeChnage = timeChnage.split(":");
        let hour = parseInt(timeChnage[0]);
        let minute = parseInt(timeChnage[1]);
        if (hour > 12) {
            hour = hour - 12;
            timeChnage = `${hour}:${minute} PM`;
        } else {
            timeChnage = `${hour}:${minute} AM`;
        }
    }

    let purchaseDates = data.purchaseDate;
    if(purchaseDates) {
        purchaseDates = purchaseDates.split(" ");
        let Timing = purchaseDates[2].split(":");
        let hour = parseInt(Timing[0]);
        let minute = parseInt(Timing[1]);
        if (hour > 12) {
            hour = hour - 12;
            purchaseDates = `${hour}:${minute} PM`;
        } else {
            purchaseDates = `${hour}:${minute} AM`;
        }
    }

    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Movie Tickets</title>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            
            .container1 {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 5px;
            }
            
            .container2 {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 5px;
	            position: relative;
            }
            
            .container3 {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 5px;
            }
            
            .one, .two, .three, .four, .five, .six {
                padding: 10px;
            }
            
            .showTime {
                font-weight: bold;
            }
            
			.one p{
				font-weight: bold;
			}
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
			
            .container2 i{
	            position: absolute;
	            bottom: 24px;
	            left: -4px;
	            font-size: 20px;
	            rotate: -45deg;
	            color: red;
            }
        </style>
    </head>
    <body>
    
        <div class="container">
        <pThank you for Buying the tickets from us - your perfect movie escape awaits! 🎬></p>
            <div class="container1">
                <div>
                    <p>Total Ticket's Purchased :${data.totalTicketpurchased}</p>
                    <p>Ticket Purchase Time :${purchaseDates}</p>
                </div>
                <div>
                    <p> Total Amount :₹ ${data.amount}</p>
                </div>
                <div>
                    <p> Show Date :${data.Showdate}</p>
                    <p> Show Time :${timeChnage}</p>
                </div>
            </div>
            <div class="container2">
                <div>
                    <p> Payment Status :Success</p>
                </div>
                <div>
                    <p> Mode of Payment :${data.paymentMethod}</p>
                </div>
            </div>
            <a href="http://localhost:4000/api/v1/Payment/download/${data._id}" 
               style="display: inline-block;
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: white;
                      text-decoration: none;
                      border-radius: 5px;
                      margin: 20px 0;">
                Download Tickets
            </a>
            <p>📎 We've attached a PDF version of your tickets to this email. 
                Please download and save it for your records.</p>
            <p class="support">If this was not done by you, please contact the support 
                <a href="mailto:faizankhan901152@gmail.com">Support</a>. We are here to help!</span>
        </div>
    </body>
    </html>`;
};

module.exports = ticketTemplate;


{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.1/jspdf.umd.min.js"></script>
<script src="./Checks.js"></script> */}





// // <link rel="stylesheet" href="./Style.css">
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css" integrity="sha512-kJlvECunwXftkPwyvHbclArO8wszgBGisiLeuDFwNM8ws+wKIw0sv1os3ClWZOcrEB2eRXULYUsm8OVRGJKwGA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    // <div class="message">Payment Succesfull mail</div>
    // <div class="one">
    //     <p>Show Date  ${otp.Showdate}</p>
    //     <p>Show time  ${otp.time}</p>
    // </div>
    // <div class="two"></div>
    // <div class="three"></div>
{/* */}


  // <i class="fa-solid fa-arrow-down"></i>
                // <div class="movieDetails">
                //     <p>Categorey Name: ${data.categoryName}</p>
                //     <p>Price: ${data.price}</p>
                //     <p>Total Ticket Purchased: ${data.ticketsPurchased}</p>
                // </div>