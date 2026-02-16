const passwordChangedTemplate = (email) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Password Changed - Cine Circuit</title>
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

        /* Success Icon */
        .icon-section {
            text-align: center;
            padding: 36px 0 0 0;
        }

        .icon-circle {
            display: inline-block;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.06) 100%);
            border-radius: 50%;
            line-height: 80px;
            border: 2px solid rgba(46, 204, 113, 0.35);
        }

        .icon-circle span {
            font-size: 38px;
        }

        /* Content */
        .content {
            padding: 24px 40px 20px 40px;
            text-align: center;
        }

        .title {
            font-size: 24px;
            font-weight: 800;
            color: #2ecc71;
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

        /* Success Card */
        .success-section {
            padding: 0 40px 20px 40px;
        }

        .success-card {
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(46, 204, 113, 0.03) 100%);
            border: 1px solid rgba(46, 204, 113, 0.2);
            border-radius: 14px;
            padding: 24px;
            text-align: center;
        }

        .success-badge {
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

        .success-text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.55);
            margin: 16px 0 0 0;
            line-height: 1.6;
        }

        /* Info Section */
        .info-section {
            padding: 0 40px 8px 40px;
        }

        .info-box {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            padding: 16px 20px;
            border-left: 3px solid rgba(52, 152, 219, 0.4);
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
            padding: 0 40px 32px 40px;
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
                padding: 20px 24px 16px 24px !important;
            }
            .title {
                font-size: 20px !important;
            }
            .success-section {
                padding: 0 24px 16px 24px !important;
            }
            .info-section {
                padding: 0 24px 8px 24px !important;
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
                padding: 16px 16px 14px 16px !important;
            }
            .title {
                font-size: 18px !important;
            }
            .success-section {
                padding: 0 16px 14px 16px !important;
            }
            .info-section {
                padding: 0 16px 8px 16px !important;
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

                        <!-- Success Icon -->
                        <div class="icon-section">
                            <div class="icon-circle">
                                <span>&#9989;</span>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="content">
                            <h1 class="title">Password Changed!</h1>
                            <p class="subtitle">Your password has been updated successfully</p>
                            <p class="greeting">
                                Hi <strong style="color: #ffffff;">${email}</strong>,<br><br>
                                Your password for <strong style="color: #e50914;">Cine Circuit</strong>
                                has been changed successfully. You can now log in with your new password.
                            </p>
                        </div>

                        <!-- Success Card -->
                        <div class="success-section">
                            <div class="success-card">
                                <span class="success-badge">&#10003; &nbsp; Password Updated</span>
                                <p class="success-text">Your account is now secure with your new password.</p>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="info-section">
                            <div class="info-box">
                                <p>
                                    &#128161; <strong style="color: rgba(255,255,255,0.65);">Remember:</strong>
                                    Keep your password safe and secure. Never share it with anyone.
                                    We recommend using a combination of uppercase, lowercase, numbers, and special characters.
                                </p>
                            </div>
                        </div>

                        <!-- Warning -->
                        <div class="warning-section">
                            <div class="warning-box">
                                <p>
                                    &#9888;&#65039; <strong style="color: rgba(255,255,255,0.65);">Didn't change your password?</strong>
                                    If you did not make this change, your account may be compromised. Please
                                    <a href="mailto:faizankhan901152@gmail.com">contact our support team</a>
                                    immediately to secure your account.
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
                                <a href="mailto:faizhan901152@gmail.com" class="footer-link">Support</a>
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
module.exports = passwordChangedTemplate;
