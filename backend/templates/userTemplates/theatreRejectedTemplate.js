const theatreRejectedTemplate = (theatreName, ownerName, rejectionReason) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Theatre Verification Update - Cine Circuit</title>
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
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(231, 76, 60, 0.08);
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

        /* Icon */
        .icon-section {
            text-align: center;
            padding: 36px 0 0 0;
        }

        .icon-circle {
            display: inline-block;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.15) 0%, rgba(231, 76, 60, 0.05) 100%);
            border-radius: 50%;
            line-height: 80px;
            border: 2px solid rgba(231, 76, 60, 0.3);
        }

        .icon-circle span {
            font-size: 38px;
        }

        /* Content */
        .content {
            padding: 24px 40px 24px 40px;
            text-align: center;
        }

        .title {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 8px 0;
        }

        .subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin: 0 0 24px 0;
            line-height: 1.5;
        }

        .greeting {
            font-size: 15px;
            color: rgba(255, 255, 255, 0.75);
            text-align: left;
            margin: 0;
            line-height: 1.7;
        }

        /* Status Card */
        .status-section {
            padding: 0 40px 20px 40px;
        }

        .status-card {
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.03) 100%);
            border: 1px solid rgba(231, 76, 60, 0.2);
            border-radius: 14px;
            padding: 24px;
            text-align: center;
        }

        .status-badge-rejected {
            display: inline-block;
            padding: 8px 24px;
            background: rgba(231, 76, 60, 0.15);
            border: 1px solid rgba(231, 76, 60, 0.3);
            border-radius: 24px;
            font-size: 14px;
            font-weight: 700;
            color: #e74c3c;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .status-text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin: 16px 0 0 0;
            line-height: 1.6;
        }

        /* Reason Card */
        .reason-section {
            padding: 0 40px 20px 40px;
        }

        .reason-card {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            overflow: hidden;
        }

        .reason-header {
            background: rgba(241, 196, 15, 0.1);
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            text-align: center;
        }

        .reason-header-text {
            font-size: 11px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin: 0;
        }

        .reason-body {
            padding: 16px 20px;
        }

        .reason-text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
            line-height: 1.6;
            text-align: left;
        }

        /* Steps Section */
        .steps-section {
            padding: 0 40px 8px 40px;
        }

        .steps-card {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            overflow: hidden;
        }

        .steps-header {
            background: rgba(52, 152, 219, 0.08);
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            text-align: center;
        }

        .steps-header-text {
            font-size: 11px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin: 0;
        }

        .steps-body {
            padding: 8px 24px;
        }

        .step-item {
            display: table;
            width: 100%;
            padding: 14px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .step-item:last-child {
            border-bottom: none;
        }

        .step-number {
            display: table-cell;
            width: 34px;
            vertical-align: top;
            padding-top: 2px;
        }

        .step-badge {
            display: inline-block;
            width: 26px;
            height: 26px;
            background: linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(52, 152, 219, 0.1) 100%);
            border-radius: 50%;
            text-align: center;
            line-height: 26px;
            font-size: 12px;
            font-weight: 700;
            color: #3498db;
            border: 1px solid rgba(52, 152, 219, 0.3);
        }

        .step-text {
            display: table-cell;
            vertical-align: middle;
            padding-left: 12px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.6;
        }

        /* CTA */
        .cta-section {
            padding: 20px 40px 28px 40px;
            text-align: center;
        }

        .cta-btn {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            box-shadow: 0 8px 24px rgba(230, 126, 34, 0.3);
        }

        /* Warning */
        .warning-section {
            padding: 0 40px 20px 40px;
        }

        .warning-box {
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.08) 0%, rgba(231, 76, 60, 0.03) 100%);
            border-radius: 10px;
            padding: 16px 20px;
            border-left: 3px solid rgba(231, 76, 60, 0.5);
        }

        .warning-box p {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.55);
            margin: 0;
            line-height: 1.6;
            text-align: left;
        }

        .warning-box a {
            color: #e50914;
            text-decoration: none;
            font-weight: 600;
        }

        /* Contact Note */
        .contact-section {
            padding: 0 40px 12px 40px;
        }

        .contact-card {
            background: rgba(52, 152, 219, 0.08);
            border: 1px solid rgba(52, 152, 219, 0.2);
            border-radius: 10px;
            padding: 16px 20px;
            text-align: center;
        }

        .contact-text {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
            line-height: 1.6;
        }

        .contact-email {
            color: #3498db;
            font-weight: 600;
            text-decoration: none;
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
            .icon-section {
                padding: 28px 0 0 0 !important;
            }
            .content {
                padding: 20px 24px 20px 24px !important;
            }
            .status-section {
                padding: 0 24px 16px 24px !important;
            }
            .reason-section {
                padding: 0 24px 16px 24px !important;
            }
            .steps-section {
                padding: 0 24px 8px 24px !important;
            }
            .cta-section {
                padding: 16px 24px 12px 24px !important;
            }
            .contact-section {
                padding: 0 24px 12px 24px !important;
            }
            .warning-section {
                padding: 0 24px 24px 24px !important;
            }
            .divider {
                margin: 0 24px !important;
            }
            .footer {
                padding: 20px 24px !important;
            }
            .title {
                font-size: 19px !important;
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
            .icon-section {
                padding: 24px 0 0 0 !important;
            }
            .icon-circle {
                width: 64px !important;
                height: 64px !important;
                line-height: 64px !important;
            }
            .icon-circle span {
                font-size: 30px !important;
            }
            .content {
                padding: 16px 16px 16px 16px !important;
            }
            .status-section {
                padding: 0 16px 14px 16px !important;
            }
            .reason-section {
                padding: 0 16px 14px 16px !important;
            }
            .steps-section {
                padding: 0 16px 8px 16px !important;
            }
            .steps-body {
                padding: 4px 16px !important;
            }
            .cta-section {
                padding: 14px 16px 12px 16px !important;
            }
            .contact-section {
                padding: 0 16px 12px 16px !important;
            }
            .cta-btn {
                padding: 12px 28px !important;
                font-size: 13px !important;
            }
            .warning-section {
                padding: 0 16px 20px 16px !important;
            }
            .divider {
                margin: 0 16px !important;
            }
            .footer {
                padding: 16px 16px !important;
            }
            .title {
                font-size: 17px !important;
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

                        <!-- Icon -->
                        <div class="icon-section">
                            <div class="icon-circle">
                                <span>&#128203;</span>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="content">
                            <h1 class="title">Verification Update</h1>
                            <p class="subtitle">Your theatre application needs some changes</p>
                            <p class="greeting">
                                Hi${ownerName ? ' <strong style="color: #ffffff;">' + ownerName + '</strong>' : ''},<br><br>
                                We've reviewed your theatre <strong style="color: #e50914;">${theatreName || 'Theatre'}</strong>
                                verification request on <strong style="color: #e50914;">Cine Circuit</strong>
                                and unfortunately, it could not be approved at this time. Don't worry — you have a chance to
                                update your details and resubmit for review.
                            </p>
                        </div>

                        <!-- Status -->
                        <div class="status-section">
                            <div class="status-card">
                                <span class="status-badge-rejected">&#10007; &nbsp; Not Approved</span>
                                <p class="status-text">Your theatre application needs revisions before it can be approved. Please review and update your details.</p>
                            </div>
                        </div>

                        <!-- Reason -->
                        ${rejectionReason ? `
                        <div class="reason-section">
                            <div class="reason-card">
                                <div class="reason-header">
                                    <p class="reason-header-text">Reason for Rejection</p>
                                </div>
                                <div class="reason-body">
                                    <p class="reason-text">${rejectionReason}</p>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Steps -->
                        <div class="steps-section">
                            <div class="steps-card">
                                <div class="steps-header">
                                    <p class="steps-header-text">How To Resubmit</p>
                                </div>
                                <div class="steps-body">
                                    <div class="step-item">
                                        <div class="step-number"><span class="step-badge">1</span></div>
                                        <div class="step-text">Log in to your <strong style="color: rgba(255,255,255,0.8);">Cine Circuit</strong> account</div>
                                    </div>
                                    <div class="step-item">
                                        <div class="step-number"><span class="step-badge">2</span></div>
                                        <div class="step-text">Go to your <strong style="color: rgba(255,255,255,0.8);">theatre profile</strong> and review all the details</div>
                                    </div>
                                    <div class="step-item">
                                        <div class="step-number"><span class="step-badge">3</span></div>
                                        <div class="step-text">Update and correct the required information</div>
                                    </div>
                                    <div class="step-item">
                                        <div class="step-number"><span class="step-badge">4</span></div>
                                        <div class="step-text">Submit your theatre again for <strong style="color: rgba(255,255,255,0.8);">re-verification</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CTA -->
                        <div class="cta-section">
                            <a href="http://localhost:5173/dashboard" class="cta-btn">
                                &#9998; &nbsp; Edit My Theatre
                            </a>
                        </div>

                        <!-- Contact Note -->
                        <div class="contact-section">
                            <div class="contact-card">
                                <p class="contact-text">
                                    &#128231; <strong style="color: #ffffff;">Need assistance?</strong><br>
                                    Our admin team will reach out to you via email for further details.
                                    You can also contact us at <a href="mailto:faizankhan901152@gmail.com" class="contact-email">faizankhan901152@gmail.com</a>
                                </p>
                            </div>
                        </div>

                        <!-- Warning -->
                        <div class="warning-section">
                            <div class="warning-box">
                                <p>
                                    &#9888;&#65039; <strong style="color: rgba(255,255,255,0.65);">Important:</strong>
                                    Please ensure all your theatre details, images, and documents are accurate and complete
                                    before resubmitting. If you need help, <a href="mailto:faizankhan901152@gmail.com">contact our support team</a>.
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
module.exports = theatreRejectedTemplate;
