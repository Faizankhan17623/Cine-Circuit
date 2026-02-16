const pdfTemplate = (data) => {
    const categories = data.categoryDetails ?? data.ticketCategorey ?? [];
    const totalAmount = categories.reduce((sum, cat) => sum + (cat.price * cat.ticketCount), 0);
    const totalTickets = categories.reduce((sum, cat) => sum + cat.ticketCount, 0);

    let purchaseDates = data.purchaseDate;
    if (purchaseDates) {
        purchaseDates = purchaseDates.split(" ");
        let Timing = purchaseDates[2].split(":");
        let hour = parseInt(Timing[0]);
        let minute = parseInt(Timing[1]);
        let period = "AM";
        if (hour === 0) {
            hour = 12;
        } else if (hour === 12) {
            period = "PM";
        } else if (hour > 12) {
            hour = hour - 12;
            period = "PM";
        }
        purchaseDates = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
    }

    let timeChnage = data.time;
    if (timeChnage) {
        timeChnage = timeChnage.split(":");
        let hour = parseInt(timeChnage[0]);
        let minute = parseInt(timeChnage[1]);
        let period = "AM";
        if (hour === 0) {
            hour = 12;
        } else if (hour === 12) {
            period = "PM";
        } else if (hour > 12) {
            hour = hour - 12;
            period = "PM";
        }
        timeChnage = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
    }

    const reference = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Movie Ticket - Cine Circuit</title>
            <style>
                /* Reset */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #0f0f0f;
                    color: #ffffff;
                    padding: 24px;
                    -webkit-font-smoothing: antialiased;
                }

                .ticket-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                    background: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(229, 9, 20, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    position: relative;
                }

                /* ---- Header ---- */
                .ticket-header {
                    background: linear-gradient(135deg, #e50914 0%, #b20710 60%, #8b0000 100%);
                    padding: 28px 36px;
                    text-align: center;
                    position: relative;
                }

                .ticket-header::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #e50914, #ff6b6b, #e50914);
                }

                .brand-name {
                    font-size: 26px;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                }

                .brand-sub {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.75);
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    margin-top: 4px;
                }

                .ticket-badge {
                    display: inline-block;
                    margin-top: 14px;
                    padding: 5px 18px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #ffffff;
                    backdrop-filter: blur(4px);
                }

                /* ---- Movie Section ---- */
                .movie-section {
                    padding: 28px 36px 20px 36px;
                    text-align: center;
                    border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
                }

                .movie-icon {
                    font-size: 40px;
                    margin-bottom: 12px;
                }

                .movie-name {
                    font-size: 24px;
                    font-weight: 800;
                    color: #ffffff;
                    margin-bottom: 6px;
                    line-height: 1.3;
                }

                .theatre-name {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.55);
                    margin-bottom: 4px;
                }

                .theatre-location {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.35);
                }

                /* ---- Show Details Grid ---- */
                .show-details {
                    padding: 24px 36px;
                    border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
                }

                .details-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0;
                }

                .detail-card {
                    flex: 1 1 50%;
                    padding: 14px 0;
                }

                .detail-card:nth-child(odd) {
                    padding-right: 16px;
                }

                .detail-card:nth-child(even) {
                    padding-left: 16px;
                    border-left: 1px solid rgba(255, 255, 255, 0.06);
                }

                .detail-icon {
                    font-size: 16px;
                    margin-bottom: 4px;
                }

                .detail-label {
                    font-size: 10px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.35);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 6px;
                }

                .detail-value {
                    font-size: 16px;
                    font-weight: 700;
                    color: #ffffff;
                }

                /* ---- Tear Line ---- */
                .tear-line {
                    position: relative;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                .tear-line::before {
                    content: '';
                    position: absolute;
                    left: -14px;
                    width: 28px;
                    height: 28px;
                    background: #0f0f0f;
                    border-radius: 50%;
                }

                .tear-line::after {
                    content: '';
                    position: absolute;
                    right: -14px;
                    width: 28px;
                    height: 28px;
                    background: #0f0f0f;
                    border-radius: 50%;
                }

                .tear-dots {
                    flex: 1;
                    border-top: 2px dashed rgba(255, 255, 255, 0.1);
                    margin: 0 20px;
                }

                /* ---- Ticket Category Table ---- */
                .category-section {
                    padding: 20px 36px 24px 36px;
                }

                .section-title {
                    font-size: 11px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.35);
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    margin-bottom: 16px;
                }

                .category-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .category-table thead th {
                    font-size: 10px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    padding: 10px 12px;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .category-table thead th:last-child {
                    text-align: right;
                }

                .category-table tbody td {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                    padding: 12px 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                }

                .category-table tbody td:first-child {
                    font-weight: 600;
                    color: #ffffff;
                }

                .category-table tbody td:last-child {
                    text-align: right;
                    font-weight: 700;
                    color: #ffffff;
                }

                /* ---- Total Section ---- */
                .total-section {
                    margin: 0 36px;
                    background: linear-gradient(135deg, rgba(229, 9, 20, 0.12) 0%, rgba(229, 9, 20, 0.05) 100%);
                    border: 1px solid rgba(229, 9, 20, 0.2);
                    border-radius: 12px;
                    padding: 20px 24px;
                    margin-bottom: 24px;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                }

                .total-row.main {
                    padding: 10px 0 0 0;
                    margin-top: 8px;
                    border-top: 1px solid rgba(229, 9, 20, 0.2);
                }

                .total-label {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.5);
                }

                .total-value {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.75);
                    font-weight: 600;
                }

                .total-row.main .total-label {
                    font-size: 16px;
                    font-weight: 700;
                    color: #ffffff;
                }

                .total-row.main .total-value {
                    font-size: 22px;
                    font-weight: 800;
                    color: #e50914;
                }

                /* ---- Payment Status ---- */
                .payment-section {
                    padding: 0 36px 28px 36px;
                }

                .payment-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 10px;
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .payment-info {
                    display: flex;
                    flex-direction: column;
                }

                .payment-label {
                    font-size: 10px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.35);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 4px;
                }

                .payment-value {
                    font-size: 14px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.8);
                }

                .status-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    background: rgba(46, 204, 113, 0.12);
                    color: #2ecc71;
                    border: 1px solid rgba(46, 204, 113, 0.25);
                }

                /* ---- Reference ---- */
                .reference-section {
                    padding: 0 36px 28px 36px;
                    text-align: center;
                }

                .ref-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 16px 20px;
                }

                .ref-label {
                    font-size: 10px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    margin-bottom: 6px;
                }

                .ref-code {
                    font-size: 22px;
                    font-weight: 800;
                    color: rgba(255, 255, 255, 0.7);
                    letter-spacing: 6px;
                    font-family: 'Courier New', monospace;
                }

                /* ---- Divider ---- */
                .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
                    margin: 0 36px;
                }

                /* ---- Footer ---- */
                .footer {
                    padding: 24px 36px;
                    text-align: center;
                }

                .footer-note {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.45);
                    margin-bottom: 8px;
                    line-height: 1.6;
                }

                .footer-support {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.25);
                    margin-bottom: 4px;
                    line-height: 1.5;
                }

                .footer-link {
                    color: #e50914;
                    text-decoration: none;
                    font-weight: 600;
                }

                .footer-legal {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.15);
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.04);
                    line-height: 1.5;
                }

                /* ---- Responsive ---- */
                @media only screen and (max-width: 600px) {
                    body {
                        padding: 12px;
                    }
                    .ticket-header {
                        padding: 22px 24px;
                    }
                    .brand-name {
                        font-size: 22px;
                    }
                    .movie-section {
                        padding: 22px 24px 18px 24px;
                    }
                    .movie-name {
                        font-size: 20px;
                    }
                    .show-details {
                        padding: 20px 24px;
                    }
                    .category-section {
                        padding: 18px 24px 20px 24px;
                    }
                    .total-section {
                        margin: 0 24px 20px 24px;
                    }
                    .payment-section {
                        padding: 0 24px 22px 24px;
                    }
                    .reference-section {
                        padding: 0 24px 22px 24px;
                    }
                    .divider {
                        margin: 0 24px;
                    }
                    .footer {
                        padding: 20px 24px;
                    }
                    .tear-line::before {
                        left: -14px;
                    }
                    .tear-line::after {
                        right: -14px;
                    }
                }

                @media only screen and (max-width: 420px) {
                    body {
                        padding: 8px;
                    }
                    .ticket-header {
                        padding: 18px 16px;
                    }
                    .brand-name {
                        font-size: 19px;
                        letter-spacing: 2px;
                    }
                    .movie-section {
                        padding: 18px 16px 14px 16px;
                    }
                    .movie-name {
                        font-size: 18px;
                    }
                    .movie-icon {
                        font-size: 32px;
                    }
                    .show-details {
                        padding: 16px 16px;
                    }
                    .detail-card {
                        flex: 1 1 100%;
                        padding: 10px 0 !important;
                        border-left: none !important;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                    }
                    .detail-card:last-child {
                        border-bottom: none;
                    }
                    .detail-value {
                        font-size: 15px;
                    }
                    .category-section {
                        padding: 14px 16px 16px 16px;
                    }
                    .category-table tbody td {
                        font-size: 13px;
                        padding: 10px 8px;
                    }
                    .category-table thead th {
                        padding: 8px 8px;
                        font-size: 9px;
                    }
                    .total-section {
                        margin: 0 16px 16px 16px;
                        padding: 16px 16px;
                    }
                    .total-row.main .total-value {
                        font-size: 20px;
                    }
                    .payment-section {
                        padding: 0 16px 18px 16px;
                    }
                    .payment-box {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .reference-section {
                        padding: 0 16px 18px 16px;
                    }
                    .ref-code {
                        font-size: 18px;
                        letter-spacing: 4px;
                    }
                    .divider {
                        margin: 0 16px;
                    }
                    .footer {
                        padding: 16px 16px;
                    }
                }

                /* ---- Print Styles ---- */
                @media print {
                    body {
                        background: #ffffff;
                        color: #000000;
                        padding: 0;
                    }
                    .ticket-wrapper {
                        box-shadow: none;
                        border: 2px solid #e50914;
                        background: #ffffff;
                    }
                    .movie-name, .detail-value, .ref-code {
                        color: #000000;
                    }
                    .detail-label, .section-title, .total-label {
                        color: #666666;
                    }
                    .category-table tbody td {
                        color: #333333;
                    }
                    .total-row.main .total-value {
                        color: #e50914;
                    }
                }
            </style>
        </head>
        <body>
            <div class="ticket-wrapper">

                <!-- Header -->
                <div class="ticket-header">
                    <div class="brand-name">Cine Circuit</div>
                    <div class="brand-sub">Movie Ticket</div>
                    <div class="ticket-badge">E-Ticket Confirmed</div>
                </div>

                <!-- Movie Info -->
                <div class="movie-section">
                    <div class="movie-icon">&#127916;</div>
                    <div class="movie-name">${data.movieName || 'Movie'}</div>
                    <div class="theatre-name">&#127970; ${data.theatreName || 'Theatre'}</div>
                    <div class="theatre-location">&#128205; ${data.theatreLocation || 'Location'}</div>
                </div>

                <!-- Show Details -->
                <div class="show-details">
                    <div class="details-grid">
                        <div class="detail-card">
                            <div class="detail-icon">&#128197;</div>
                            <div class="detail-label">Show Date</div>
                            <div class="detail-value">${data.Showdate || 'N/A'}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-icon">&#128336;</div>
                            <div class="detail-label">Show Time</div>
                            <div class="detail-value">${timeChnage || 'N/A'}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-icon">&#127903;</div>
                            <div class="detail-label">Total Tickets</div>
                            <div class="detail-value">${totalTickets}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-icon">&#128176;</div>
                            <div class="detail-label">Purchased At</div>
                            <div class="detail-value">${purchaseDates || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                <!-- Tear Line -->
                <div class="tear-line">
                    <div class="tear-dots"></div>
                </div>

                <!-- Ticket Categories -->
                <div class="category-section">
                    <div class="section-title">Ticket Breakdown</div>
                    <table class="category-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${categories.map(cat => `
                                <tr>
                                    <td>${cat.categoryName}</td>
                                    <td>${cat.ticketCount}</td>
                                    <td>&#8377;${cat.price}</td>
                                    <td>&#8377;${cat.price * cat.ticketCount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Total -->
                <div class="total-section">
                    <div class="total-row">
                        <span class="total-label">Tickets</span>
                        <span class="total-value">${totalTickets}</span>
                    </div>
                    <div class="total-row">
                        <span class="total-label">Subtotal</span>
                        <span class="total-value">&#8377;${totalAmount}</span>
                    </div>
                    <div class="total-row main">
                        <span class="total-label">Total Paid</span>
                        <span class="total-value">&#8377;${totalAmount}</span>
                    </div>
                </div>

                <!-- Payment Status -->
                <div class="payment-section">
                    <div class="payment-box">
                        <div class="payment-info">
                            <span class="payment-label">Payment Method</span>
                            <span class="payment-value">${data.paymentMethod || 'Online'}</span>
                        </div>
                        <span class="status-badge">${data.Payment_Status || 'Paid'}</span>
                    </div>
                </div>

                <!-- Booking Reference -->
                <div class="reference-section">
                    <div class="ref-box">
                        <div class="ref-label">Booking Reference</div>
                        <div class="ref-code">#${reference}</div>
                    </div>
                </div>

                <!-- Divider -->
                <div class="divider"></div>

                <!-- Footer -->
                <div class="footer">
                    <p class="footer-note">
                        Thank you for choosing <strong>Cine Circuit</strong>! Enjoy your movie.
                    </p>
                    <p class="footer-support">
                        Need help? Contact us at <a href="mailto:faizankhan901152@gmail.com" class="footer-link">Support</a>
                    </p>
                    <p class="footer-legal">
                        This is a computer-generated ticket and does not require a signature.<br>
                        &copy; ${new Date().getFullYear()} Cine Circuit. All rights reserved.
                    </p>
                </div>

            </div>
        </body>
        </html>`;
};

module.exports = pdfTemplate;
