const pdfTemplate = (data) => {
  console.log(data);
    const categories = data.categoryDetails ?? data.ticketCategorey ?? [];
    // console.log("Thisa are the categories", categories);
    const totalAmount = categories.reduce((sum, cat) => sum + (cat.price * cat.ticketCount), 0);
    // console.log("THis is the total amount", Number(totalAmount));


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
    console.log("This is the purchase date", purchaseDates);
    const reference = Math.floor(Math.random() * 1000000)

    return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Movie Ticket Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                }
                .invoice-title {
                    font-size: 24px;
                    color: #1a73e8;
                    margin: 0;
                }
                .ticket-info {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    display: flex;
                    justify-content: space-between;
                }
                .category-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .category-table th, .category-table td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                .category-table th {
                    background-color: #1a73e8;
                    color: white;
                }
                .category-table tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .total-section {
                    margin-top: 20px;
                    text-align: right;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1 class="invoice-title">Movie Ticket Invoice</h1>
                <p>Booking Reference: ${reference}</p>
            </div>

            <div class="ticket-info">
              <div class="ticket-info1">
                <p><strong>Show Date:</strong> ${data.Showdate}</p>
                <p><strong>Show Time:</strong> ${timeChnage}</p>
                <p><strong>Purchase Date:</strong> ${purchaseDates}</p>
              </div>
              <div class="ticket-info2">
                <p><strong>Show name:</strong> ${data.movieName}</p>
                <p><strong>Theatre name:</strong> ${data.theatreName}</p>
                <p><strong>Theatre location:</strong> ${data.theatreLocation}</p>
              </div>
            </div>

            <table class="category-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Tickets</th>
                        <th>Price per Ticket</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(cat =>`
                        <tr>
                            <td>${cat.categoryName}</td>
                            <td>${cat.ticketCount}</td>
                            <td>₹${cat.price}</td>
                            <td>₹${cat.price * cat.ticketCount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total-section">
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                <p><strong>Payment Status:</strong> ${data.Payment_Status}</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod || 'Online'}</p>
            </div>

            <div class="footer">
                <p>Thank you for choosing our cinema! 🎬</p>
                <p>For any queries, please contact support at:<a href="mailto:faizankhan901152@gmail.com">Support</a></p>
                <p>This is a computer-generated invoice and does not require a signature.</p>
            </div>
        </body>
        </html>`;
};

module.exports = pdfTemplate;