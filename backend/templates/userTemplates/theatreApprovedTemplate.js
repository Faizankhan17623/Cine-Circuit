const theatreApprovedTemplate = (theatreName, ownerName) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Theatre Approved - Cine Circuit</title>
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
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(46, 204, 113, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
            padding: 32px 40px;
            text-align: center;
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
            padding: 36px 40px 0 40px;
        }

        .success-icon {
            display: inline-block;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.06) 100%);
            border-radius: 50%;
            line-height: 80px;
            border: 2px solid rgba(46, 204, 113, 0.35);
            margin-bottom: 20px;
        }

        .success-icon span {
            font-size: 38px;
        }

        .success-title {
            font-size: 26px;
            font-weight: 800;
            color: #2ecc71;
            margin: 0 0 8px 0;
        }

        .success-subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin: 0;
            line-height: 1.5;
        }

        /* Content */
        .content {
            padding: 24px 40px 24px 40px;
        }

        .greeting {
            font-size: 15px;
            color: rgba(255, 255, 255, 0.75);
            text-align: left;
            margin: 0;
            line-height: 1.7;
        }

        /* Theatre Info Card */
        .theatre-section {
            padding: 0 40px 20px 40px;
        }

        .theatre-card {
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(46, 204, 113, 0.03) 100%);
            border: 1px solid rgba(46, 204, 113, 0.2);
            border-radius: 14px;
            padding: 24px;
            text-align: center;
        }

        .theatre-badge {
            display: inline-block;
            padding: 8px 24px;
            background: rgba(46, 204, 113, 0.15);
            border: 1px solid rgba(46, 204, 113, 0.3);
            border-radius: 24px;
            font-size: 14px;
            font-weight: 700;
            color: #2ecc71;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .theatre-name {
            font-size: 20px;
            font-weight: 700;
            color: #ffffff;
            margin: 16px 0 0 0;
        }

        .theatre-text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.55);
            margin: 8px 0 0 0;
            line-height: 1.6;
        }

        /* Features Section */
        .features-section {
            padding: 0 40px 8px 40px;
        }

        .features-card {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            overflow: hidden;
        }

        .features-header {
            background: rgba(46, 204, 113, 0.08);
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            text-align: center;
        }

        .features-header-text {
            font-size: 11px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin: 0;
        }

        .features-body {
            padding: 8px 24px;
        }

        .feature-item {
            display: table;
            width: 100%;
            padding: 14px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .feature-item:last-child {
            border-bottom: none;
        }

        .feature-number {
            display: table-cell;
            width: 34px;
            vertical-align: top;
            padding-top: 2px;
        }

        .feature-badge {
            display: inline-block;
            width: 26px;
            height: 26px;
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.1) 100%);
            border-radius: 50%;
            text-align: center;
            line-height: 26px;
            font-size: 12px;
            font-weight: 700;
            color: #2ecc71;
            border: 1px solid rgba(46, 204, 113, 0.3);
        }

        .feature-text {
            display: table-cell;
            vertical-align: middle;
            padding-left: 12px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.6;
        }

        /* CTA Button */
        .cta-section {
            padding: 20px 40px 28px 40px;
            text-align: center;
        }

        .cta-btn {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            box-shadow: 0 8px 24px rgba(46, 204, 113, 0.3);
        }

        /* Info */
        .info-section {
            padding: 0 40px 32px 40px;
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
                padding: 28px 24px 0 24px !important;
            }
            .success-title {
                font-size: 22px !important;
            }
            .content {
                padding: 20px 24px 20px 24px !important;
            }
            .theatre-section {
                padding: 0 24px 16px 24px !important;
            }
            .features-section {
                padding: 0 24px 8px 24px !important;
            }
            .cta-section {
                padding: 16px 24px 22px 24px !important;
            }
            .info-section {
                padding: 0 24px 24px 24px !important;
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
                padding: 24px 16px 0 16px !important;
            }
            .success-title {
                font-size: 20px !important;
            }
            .success-icon {
                width: 64px !important;
                height: 64px !important;
                line-height: 64px !important;
            }
            .success-icon span {
                font-size: 30px !important;
            }
            .content {
                padding: 16px 16px 16px 16px !important;
            }
            .theatre-section {
                padding: 0 16px 14px 16px !important;
            }
            .features-section {
                padding: 0 16px 8px 16px !important;
            }
            .features-body {
                padding: 4px 16px !important;
            }
            .cta-section {
                padding: 14px 16px 18px 16px !important;
            }
            .cta-btn {
                padding: 12px 30px !important;
                font-size: 13px !important;
            }
            .info-section {
                padding: 0 16px 20px 16px !important;
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
                                <span>&#127909;</span>
                            </div>
                            <h1 class="success-title">Congratulations!</h1>
                            <p class="success-subtitle">Your theatre has been approved</p>
                        </div>

                        <!-- Content -->
                        <div class="content">
                            <p class="greeting">
                                Hi${ownerName ? ' <strong style="color: #ffffff;">' + ownerName + '</strong>' : ''},<br><br>
                                Great news! Your theatre <strong style="color: #e50914;">${theatreName || 'Theatre'}</strong>
                                has been reviewed and <strong style="color: #2ecc71;">approved</strong> by our admin team.
                                Your theatre is now verified and ready to host movie screenings on Cine Circuit.
                            </p>
                        </div>

                        <!-- Theatre Info Badge -->
                        <div class="theatre-section">
                            <div class="theatre-card">
                                <span class="theatre-badge">&#10003; &nbsp; Verified Theatre</span>
                                <p class="theatre-name">${theatreName || 'Your Theatre'}</p>
                                <p class="theatre-text">Your theatre is now active and can receive show allotments from organizers.</p>
                            </div>
                        </div>

                        <!-- Features -->
                        <div class="features-section">
                            <div class="features-card">
                                <div class="features-header">
                                    <p class="features-header-text">What You Can Do Now</p>
                                </div>
                                <div class="features-body">
                                    <div class="feature-item">
                                        <div class="feature-number"><span class="feature-badge">1</span></div>
                                        <div class="feature-text">Receive <strong style="color: rgba(255,255,255,0.8);">show allotments</strong> from verified organizers</div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-number"><span class="feature-badge">2</span></div>
                                        <div class="feature-text">Manage <strong style="color: rgba(255,255,255,0.8);">seat availability</strong> and ticket bookings</div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-number"><span class="feature-badge">3</span></div>
                                        <div class="feature-text">Track <strong style="color: rgba(255,255,255,0.8);">revenue</strong> and performance analytics</div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-number"><span class="feature-badge">4</span></div>
                                        <div class="feature-text">Update <strong style="color: rgba(255,255,255,0.8);">show timings</strong> and screen availability</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CTA -->
                        <div class="cta-section">
                            <a href="http://localhost:5173/dashboard" class="cta-btn">
                                &#127916; &nbsp; Go to Dashboard
                            </a>
                        </div>

                        <!-- Info -->
                        <div class="info-section">
                            <div class="info-box">
                                <p>
                                    &#128161; <strong style="color: rgba(255,255,255,0.65);">Tip:</strong>
                                    Make sure your theatre details are up to date. Regular updates help attract
                                    more organizers and improve your booking visibility.
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
module.exports = theatreApprovedTemplate;
