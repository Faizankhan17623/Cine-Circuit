const ticketTemplate = (data) => {
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

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Booking Confirmed - Cine Circuit</title>
        <style>
            /* Reset */
            body, table, td, a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            table, td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            img {
                -ms-interpolation-mode: bicubic;
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }

            body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: #0f0f0f;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                -webkit-font-smoothing: antialiased;
            }

            .email-wrapper {
                width: 100%;
                background-color: #0f0f0f;
                padding: 40px 0;
            }

            .email-container {
                max-width: 520px;
                margin: 0 auto;
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(229, 9, 20, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.06);
            }

            /* Header */
            .header {
                background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
                padding: 32px 40px;
                text-align: center;
                position: relative;
            }

            .header::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #e50914, #ff6b6b, #e50914);
            }

            .brand-name {
                font-size: 28px;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: 2px;
                margin: 0;
                text-transform: uppercase;
            }

            .brand-tagline {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                letter-spacing: 4px;
                text-transform: uppercase;
                margin-top: 6px;
            }

            /* Success Banner */
            .success-section {
                text-align: center;
                padding: 32px 40px 8px 40px;
            }

            .success-icon {
                display: inline-block;
                width: 72px;
                height: 72px;
                background: linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(46, 204, 113, 0.05) 100%);
                border-radius: 50%;
                line-height: 72px;
                border: 2px solid rgba(46, 204, 113, 0.3);
                margin-bottom: 16px;
            }

            .success-icon span {
                font-size: 32px;
            }

            .success-title {
                font-size: 24px;
                font-weight: 800;
                color: #2ecc71;
                margin: 0 0 6px 0;
            }

            .success-subtitle {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.5);
                margin: 0;
                line-height: 1.5;
            }

            /* Content */
            .content {
                padding: 20px 40px 24px 40px;
                text-align: center;
            }

            .greeting {
                font-size: 15px;
                color: rgba(255, 255, 255, 0.7);
                text-align: left;
                margin: 0;
                line-height: 1.7;
            }

            /* Booking Summary Card */
            .summary-section {
                padding: 0 40px 20px 40px;
            }

            .summary-card {
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 14px;
                overflow: hidden;
            }

            .summary-header {
                background: rgba(229, 9, 20, 0.1);
                padding: 14px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                text-align: center;
            }

            .summary-header-text {
                font-size: 11px;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 3px;
                margin: 0;
            }

            .summary-body {
                padding: 6px 20px;
            }

            .summary-row {
                display: table;
                width: 100%;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            }

            .summary-row:last-child {
                border-bottom: none;
            }

            .summary-icon {
                display: table-cell;
                width: 28px;
                vertical-align: middle;
                font-size: 16px;
            }

            .summary-label {
                display: table-cell;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.4);
                vertical-align: middle;
            }

            .summary-value {
                display: table-cell;
                font-size: 14px;
                color: #ffffff;
                font-weight: 600;
                text-align: right;
                vertical-align: middle;
            }

            /* Amount Highlight */
            .amount-section {
                padding: 0 40px 20px 40px;
            }

            .amount-card {
                background: linear-gradient(135deg, rgba(229, 9, 20, 0.12) 0%, rgba(229, 9, 20, 0.05) 100%);
                border: 1px solid rgba(229, 9, 20, 0.2);
                border-radius: 12px;
                padding: 20px 24px;
                display: table;
                width: 100%;
            }

            .amount-left {
                display: table-cell;
                vertical-align: middle;
            }

            .amount-label {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0 0 4px 0;
            }

            .amount-value {
                font-size: 28px;
                font-weight: 800;
                color: #e50914;
                margin: 0;
            }

            .amount-right {
                display: table-cell;
                vertical-align: middle;
                text-align: right;
            }

            .payment-badge {
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

            .payment-method {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.35);
                margin: 8px 0 0 0;
                text-align: right;
            }

            /* Download Button */
            .download-section {
                padding: 4px 40px 24px 40px;
                text-align: center;
            }

            .download-btn {
                display: inline-block;
                padding: 14px 36px;
                background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                box-shadow: 0 8px 24px rgba(229, 9, 20, 0.3);
                transition: all 0.2s;
            }

            .download-hint {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.3);
                margin: 14px 0 0 0;
                line-height: 1.6;
            }

            /* Info Box */
            .info-section {
                padding: 0 40px 28px 40px;
            }

            .info-box {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 10px;
                padding: 16px 20px;
                border-left: 3px solid rgba(46, 204, 113, 0.4);
            }

            .info-box p {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.45);
                margin: 0;
                line-height: 1.6;
                text-align: left;
            }

            /* Warning */
            .warning-section {
                padding: 0 40px 28px 40px;
            }

            .warning-box {
                background: linear-gradient(135deg, rgba(231, 76, 60, 0.08) 0%, rgba(231, 76, 60, 0.03) 100%);
                border-radius: 10px;
                padding: 16px 20px;
                border-left: 3px solid rgba(231, 76, 60, 0.5);
            }

            .warning-box p {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.5);
                margin: 0;
                line-height: 1.6;
                text-align: left;
            }

            .warning-box a {
                color: #e50914;
                text-decoration: none;
                font-weight: 600;
            }

            /* Divider */
            .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
                margin: 0 40px;
            }

            /* Footer */
            .footer {
                padding: 24px 40px;
                text-align: center;
            }

            .footer-brand {
                font-size: 14px;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.3);
                letter-spacing: 1px;
                margin: 0 0 8px 0;
            }

            .footer-text {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.2);
                margin: 0 0 4px 0;
                line-height: 1.5;
            }

            .footer-link {
                color: #e50914;
                text-decoration: none;
                font-weight: 600;
            }

            /* Responsive */
            @media only screen and (max-width: 600px) {
                .email-wrapper {
                    padding: 16px 0 !important;
                }
                .email-container {
                    margin: 0 12px !important;
                    border-radius: 12px !important;
                }
                .header {
                    padding: 24px 24px !important;
                }
                .brand-name {
                    font-size: 22px !important;
                }
                .success-section {
                    padding: 24px 24px 8px 24px !important;
                }
                .success-title {
                    font-size: 20px !important;
                }
                .content {
                    padding: 16px 24px 20px 24px !important;
                }
                .summary-section {
                    padding: 0 24px 16px 24px !important;
                }
                .amount-section {
                    padding: 0 24px 16px 24px !important;
                }
                .amount-value {
                    font-size: 24px !important;
                }
                .download-section {
                    padding: 4px 24px 20px 24px !important;
                }
                .info-section {
                    padding: 0 24px 22px 24px !important;
                }
                .warning-section {
                    padding: 0 24px 22px 24px !important;
                }
                .divider {
                    margin: 0 24px !important;
                }
                .footer {
                    padding: 20px 24px !important;
                }
            }

            @media only screen and (max-width: 400px) {
                .email-container {
                    margin: 0 8px !important;
                }
                .header {
                    padding: 20px 16px !important;
                }
                .brand-name {
                    font-size: 20px !important;
                }
                .success-section {
                    padding: 20px 16px 8px 16px !important;
                }
                .success-title {
                    font-size: 18px !important;
                }
                .success-icon {
                    width: 60px !important;
                    height: 60px !important;
                    line-height: 60px !important;
                }
                .success-icon span {
                    font-size: 26px !important;
                }
                .content {
                    padding: 12px 16px 16px 16px !important;
                }
                .summary-section {
                    padding: 0 16px 14px 16px !important;
                }
                .summary-body {
                    padding: 4px 14px !important;
                }
                .summary-value {
                    font-size: 13px !important;
                }
                .amount-section {
                    padding: 0 16px 14px 16px !important;
                }
                .amount-card {
                    display: block !important;
                    text-align: center;
                }
                .amount-left {
                    display: block !important;
                    margin-bottom: 12px;
                }
                .amount-right {
                    display: block !important;
                    text-align: center !important;
                }
                .payment-method {
                    text-align: center !important;
                }
                .amount-value {
                    font-size: 22px !important;
                }
                .download-section {
                    padding: 4px 16px 16px 16px !important;
                }
                .download-btn {
                    padding: 12px 28px !important;
                    font-size: 13px !important;
                }
                .info-section {
                    padding: 0 16px 18px 16px !important;
                }
                .warning-section {
                    padding: 0 16px 18px 16px !important;
                }
                .divider {
                    margin: 0 16px !important;
                }
                .footer {
                    padding: 16px 16px !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f;">
                <tr>
                    <td align="center">
                        <div class="email-container">

                            <!-- Header -->
                            <div class="header">
                                <p class="brand-name">Cine Circuit</p>
                                <p class="brand-tagline">Your Gateway to Cinema</p>
                            </div>

                            <!-- Success -->
                            <div class="success-section">
                                <div class="success-icon">
                                    <span>&#10003;</span>
                                </div>
                                <h1 class="success-title">Booking Confirmed!</h1>
                                <p class="success-subtitle">Your tickets have been booked successfully</p>
                            </div>

                            <!-- Greeting -->
                            <div class="content">
                                <p class="greeting">
                                    Thank you for booking with <strong style="color: #e50914;">Cine Circuit</strong>!
                                    Your perfect movie escape awaits. Here's your booking summary.
                                </p>
                            </div>

                            <!-- Booking Summary -->
                            <div class="summary-section">
                                <div class="summary-card">
                                    <div class="summary-header">
                                        <p class="summary-header-text">Booking Details</p>
                                    </div>
                                    <div class="summary-body">
                                        <div class="summary-row">
                                            <span class="summary-icon">&#127916;</span>
                                            <span class="summary-label">Show Date</span>
                                            <span class="summary-value">${data.Showdate || 'N/A'}</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-icon">&#128336;</span>
                                            <span class="summary-label">Show Time</span>
                                            <span class="summary-value">${timeChnage || 'N/A'}</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-icon">&#127903;</span>
                                            <span class="summary-label">Tickets Purchased</span>
                                            <span class="summary-value">${data.totalTicketpurchased || 0}</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-icon">&#128176;</span>
                                            <span class="summary-label">Purchased At</span>
                                            <span class="summary-value">${purchaseDates || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Amount -->
                            <div class="amount-section">
                                <div class="amount-card">
                                    <div class="amount-left">
                                        <p class="amount-label">Total Amount Paid</p>
                                        <p class="amount-value">&#8377;${data.amount || 0}</p>
                                    </div>
                                    <div class="amount-right">
                                        <span class="payment-badge">Paid</span>
                                        <p class="payment-method">via ${data.paymentMethod || 'Online'}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Download Button -->
                            <div class="download-section">
                                <a href="http://localhost:4000/api/v1/Payment/download/${data._id}" class="download-btn">
                                    &#11015; &nbsp; Download Tickets
                                </a>
                                <p class="download-hint">
                                    A PDF copy of your tickets is also attached to this email.
                                    Please save it for entry at the theatre.
                                </p>
                            </div>

                            <!-- Info -->
                            <div class="info-section">
                                <div class="info-box">
                                    <p>
                                        &#127910; <strong style="color: rgba(255,255,255,0.65);">Reminder:</strong>
                                        Please arrive at least 15 minutes before the show time. Carry a valid ID proof
                                        along with your ticket (digital or printed) for entry.
                                    </p>
                                </div>
                            </div>

                            <!-- Warning -->
                            <div class="warning-section">
                                <div class="warning-box">
                                    <p>
                                        &#9888;&#65039; <strong style="color: rgba(255,255,255,0.65);">Not your booking?</strong>
                                        If you did not make this purchase, please
                                        <a href="mailto:faizankhan901152@gmail.com">contact our support team</a>
                                        immediately.
                                    </p>
                                </div>
                            </div>

                            <!-- Divider -->
                            <div class="divider"></div>

                            <!-- Footer -->
                            <div class="footer">
                                <p class="footer-brand">Cine Circuit</p>
                                <p class="footer-text">
                                    Need help? Contact us at
                                    <a href="mailto:faizankhan901152@gmail.com" class="footer-link">Support</a>
                                </p>
                                <p class="footer-text" style="margin-top: 12px;">
                                    &copy; ${new Date().getFullYear()} Cine Circuit. All rights reserved.
                                </p>
                            </div>

                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>`;
};

module.exports = ticketTemplate;
