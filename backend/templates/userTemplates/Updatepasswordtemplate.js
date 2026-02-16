const updatePasswordTemplate = (email, token) => {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Reset Your Password - Cine Circuit</title>
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
				box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(229, 9, 20, 0.08);
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
				padding: 32px 0 0 0;
			}

			.icon-circle {
				display: inline-block;
				width: 72px;
				height: 72px;
				background: linear-gradient(135deg, rgba(230, 126, 34, 0.15) 0%, rgba(230, 126, 34, 0.05) 100%);
				border-radius: 50%;
				line-height: 72px;
				border: 2px solid rgba(230, 126, 34, 0.3);
			}

			.icon-circle span {
				font-size: 32px;
			}

			/* Content */
			.content {
				padding: 24px 40px 20px 40px;
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
				margin: 0 0 24px 0;
				line-height: 1.5;
			}

			.greeting {
				font-size: 15px;
				color: rgba(255, 255, 255, 0.75);
				text-align: left;
				margin: 0 0 16px 0;
				line-height: 1.6;
			}

			/* Reset Button Section */
			.button-section {
				padding: 0 40px 8px 40px;
				text-align: center;
			}

			.button-card {
				background: rgba(255, 255, 255, 0.04);
				border: 1px solid rgba(255, 255, 255, 0.08);
				border-radius: 14px;
				padding: 32px 24px;
			}

			.button-label {
				font-size: 14px;
				color: rgba(255, 255, 255, 0.55);
				margin: 0 0 24px 0;
				line-height: 1.5;
			}

			.reset-btn {
				display: inline-block;
				padding: 16px 44px;
				background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
				color: #ffffff !important;
				text-decoration: none;
				border-radius: 10px;
				font-size: 16px;
				font-weight: 700;
				letter-spacing: 1px;
				text-transform: uppercase;
				box-shadow: 0 8px 28px rgba(230, 126, 34, 0.35);
			}

			.button-expire {
				font-size: 12px;
				color: rgba(255, 255, 255, 0.35);
				margin: 20px 0 0 0;
			}

			.button-expire span {
				color: #e67e22;
				font-weight: 700;
			}

			/* Link Fallback */
			.link-section {
				padding: 16px 40px 8px 40px;
			}

			.link-box {
				background: rgba(255, 255, 255, 0.03);
				border-radius: 10px;
				padding: 16px 20px;
				border: 1px solid rgba(255, 255, 255, 0.06);
			}

			.link-label {
				font-size: 11px;
				font-weight: 600;
				color: rgba(255, 255, 255, 0.35);
				text-transform: uppercase;
				letter-spacing: 2px;
				margin: 0 0 10px 0;
				text-align: left;
			}

			.link-url {
				font-size: 12px;
				color: rgba(230, 126, 34, 0.8);
				word-break: break-all;
				text-align: left;
				line-height: 1.6;
				margin: 0;
			}

			/* Info Section */
			.info-section {
				padding: 16px 40px 8px 40px;
			}

			.info-box {
				background: rgba(255, 255, 255, 0.03);
				border-radius: 10px;
				padding: 16px 20px;
				border-left: 3px solid rgba(230, 126, 34, 0.4);
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
				padding: 16px 40px 32px 40px;
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
				.content {
					padding: 20px 24px 16px 24px !important;
				}
				.button-section {
					padding: 0 24px 8px 24px !important;
				}
				.reset-btn {
					padding: 14px 36px !important;
					font-size: 15px !important;
				}
				.link-section {
					padding: 12px 24px 8px 24px !important;
				}
				.info-section {
					padding: 12px 24px 8px 24px !important;
				}
				.warning-section {
					padding: 12px 24px 24px 24px !important;
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
					padding: 16px 16px 12px 16px !important;
				}
				.button-section {
					padding: 0 16px 8px 16px !important;
				}
				.button-card {
					padding: 24px 16px !important;
				}
				.reset-btn {
					padding: 13px 28px !important;
					font-size: 14px !important;
				}
				.link-section {
					padding: 10px 16px 8px 16px !important;
				}
				.link-url {
					font-size: 11px !important;
				}
				.info-section {
					padding: 10px 16px 8px 16px !important;
				}
				.warning-section {
					padding: 10px 16px 20px 16px !important;
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
									<span>&#128275;</span>
								</div>
							</div>

							<!-- Content -->
							<div class="content">
								<h1 class="title">Reset Your Password</h1>
								<p class="subtitle">We received a request to reset your password</p>
								<p class="greeting">
									Hi <strong style="color: #ffffff;">${email}</strong>,<br><br>
									We received a password reset request for your <strong style="color: #e50914;">Cine Circuit</strong>
									account. Click the button below to create a new password.
								</p>
							</div>

							<!-- Reset Button -->
							<div class="button-section">
								<div class="button-card">
									<p class="button-label">
										Click the button below to reset your password and regain access to your account.
									</p>
									<a href="http://localhost:5173/Reset-Password/${token}" class="reset-btn">
										&#128274; &nbsp; Reset Password
									</a>
									<p class="button-expire">
										This link will expire in <span>10 minutes</span>
									</p>
								</div>
							</div>

							<!-- Link Fallback -->
							<div class="link-section">
								<div class="link-box">
									<p class="link-label">Button not working? Copy this link</p>
									<p class="link-url">http://localhost:5173/Reset-Password/${token}</p>
								</div>
							</div>

							<!-- Info -->
							<div class="info-section">
								<div class="info-box">
									<p>
										&#128161; <strong style="color: rgba(255,255,255,0.65);">Tip:</strong>
										After resetting, choose a strong password with a mix of uppercase, lowercase,
										numbers, and special characters. Avoid reusing passwords from other websites.
									</p>
								</div>
							</div>

							<!-- Warning -->
							<div class="warning-section">
								<div class="warning-box">
									<p>
										&#9888;&#65039; <strong style="color: rgba(255,255,255,0.65);">Didn't request this?</strong>
										If you did not request a password reset, please ignore this email. Your password
										will remain unchanged. If you suspect unauthorized access,
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
module.exports = updatePasswordTemplate;
