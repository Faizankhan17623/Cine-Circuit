const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>OTP Verification - Cine Circuit</title>
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

			/* Header / Brand */
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

			/* Icon Circle */
			.icon-section {
				text-align: center;
				padding: 32px 0 0 0;
			}

			.icon-circle {
				display: inline-block;
				width: 72px;
				height: 72px;
				background: linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(229, 9, 20, 0.05) 100%);
				border-radius: 50%;
				line-height: 72px;
				border: 2px solid rgba(229, 9, 20, 0.3);
			}

			.icon-circle span {
				font-size: 32px;
			}

			/* Body Content */
			.content {
				padding: 24px 40px 32px 40px;
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
				color: rgba(255, 255, 255, 0.55);
				margin: 0 0 28px 0;
				line-height: 1.5;
			}

			.greeting {
				font-size: 15px;
				color: rgba(255, 255, 255, 0.75);
				text-align: left;
				margin: 0 0 16px 0;
				line-height: 1.6;
			}

			/* OTP Box */
			.otp-wrapper {
				padding: 0 40px 8px 40px;
				text-align: center;
			}

			.otp-box {
				background: linear-gradient(135deg, rgba(229, 9, 20, 0.12) 0%, rgba(178, 7, 16, 0.08) 100%);
				border: 2px dashed rgba(229, 9, 20, 0.4);
				border-radius: 12px;
				padding: 24px 20px;
			}

			.otp-label {
				font-size: 11px;
				font-weight: 600;
				color: rgba(255, 255, 255, 0.45);
				text-transform: uppercase;
				letter-spacing: 3px;
				margin: 0 0 12px 0;
			}

			.otp-code {
				font-size: 40px;
				font-weight: 800;
				color: #e50914;
				letter-spacing: 12px;
				margin: 0;
				font-family: 'Courier New', monospace;
				text-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
			}

			.otp-timer {
				font-size: 12px;
				color: rgba(255, 255, 255, 0.4);
				margin: 14px 0 0 0;
			}

			.otp-timer span {
				color: #e50914;
				font-weight: 700;
			}

			/* Warning / Info */
			.info-section {
				padding: 0 40px 32px 40px;
			}

			.info-box {
				background: rgba(255, 255, 255, 0.03);
				border-radius: 10px;
				padding: 18px 20px;
				border-left: 3px solid rgba(229, 9, 20, 0.5);
				margin-top: 24px;
			}

			.info-box p {
				font-size: 13px;
				color: rgba(255, 255, 255, 0.5);
				margin: 0;
				line-height: 1.6;
				text-align: left;
			}

			.warning-text {
				font-size: 12px;
				color: rgba(255, 255, 255, 0.35);
				text-align: center;
				margin: 20px 0 0 0;
				line-height: 1.5;
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

			.footer-link:hover {
				text-decoration: underline;
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
				.content {
					padding: 20px 24px 24px 24px !important;
				}
				.otp-wrapper {
					padding: 0 24px 8px 24px !important;
				}
				.otp-code {
					font-size: 32px !important;
					letter-spacing: 8px !important;
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
				.content {
					padding: 16px 16px 20px 16px !important;
				}
				.otp-wrapper {
					padding: 0 16px 8px 16px !important;
				}
				.otp-code {
					font-size: 28px !important;
					letter-spacing: 6px !important;
				}
				.otp-box {
					padding: 20px 12px !important;
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
				.title {
					font-size: 17px !important;
				}
				.icon-circle {
					width: 60px !important;
					height: 60px !important;
					line-height: 60px !important;
				}
				.icon-circle span {
					font-size: 26px !important;
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
									<span>&#128274;</span>
								</div>
							</div>

							<!-- Body Content -->
							<div class="content">
								<h1 class="title">Verify Your Account</h1>
								<p class="subtitle">One step away from the world of entertainment</p>
								<p class="greeting">
									Dear User,<br><br>
									Thank you for joining <strong style="color: #e50914;">Cine Circuit</strong>.
									To complete your registration, please use the following OTP to verify your account.
								</p>
							</div>

							<!-- OTP Code -->
							<div class="otp-wrapper">
								<div class="otp-box">
									<p class="otp-label">Your Verification Code</p>
									<p class="otp-code">${otp}</p>
									<p class="otp-timer">Expires in <span>1 minute</span></p>
								</div>
							</div>

							<!-- Info Section -->
							<div class="info-section">
								<div class="info-box">
									<p>
										&#9888;&#65039; <strong style="color: rgba(255,255,255,0.65);">Security Notice:</strong>
										Never share this OTP with anyone. Our team will never ask for your OTP via call, SMS, or email.
									</p>
								</div>
								<p class="warning-text">
									If you did not request this verification, please ignore this email.
									Your account will remain secure.
								</p>
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
module.exports = otpTemplate;
