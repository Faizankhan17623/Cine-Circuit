const updateNameTemplate = (oldusername, username) => {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Username Updated - Cine Circuit</title>
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
				background: linear-gradient(135deg, rgba(52, 152, 219, 0.15) 0%, rgba(52, 152, 219, 0.05) 100%);
				border-radius: 50%;
				line-height: 72px;
				border: 2px solid rgba(52, 152, 219, 0.3);
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

			/* Name Change Card */
			.change-section {
				padding: 0 40px 8px 40px;
			}

			.change-card {
				background: rgba(255, 255, 255, 0.04);
				border: 1px solid rgba(255, 255, 255, 0.08);
				border-radius: 14px;
				overflow: hidden;
			}

			.change-header {
				background: rgba(52, 152, 219, 0.1);
				padding: 12px 20px;
				border-bottom: 1px solid rgba(255, 255, 255, 0.06);
				text-align: center;
			}

			.change-header-text {
				font-size: 11px;
				font-weight: 700;
				color: rgba(255, 255, 255, 0.4);
				text-transform: uppercase;
				letter-spacing: 3px;
				margin: 0;
			}

			.change-body {
				padding: 8px 24px;
			}

			/* Old Name */
			.name-row {
				padding: 16px 0;
				border-bottom: 1px solid rgba(255, 255, 255, 0.04);
				text-align: center;
			}

			.name-row:last-child {
				border-bottom: none;
			}

			.name-label {
				font-size: 10px;
				font-weight: 600;
				color: rgba(255, 255, 255, 0.35);
				text-transform: uppercase;
				letter-spacing: 3px;
				margin: 0 0 8px 0;
			}

			.name-value-old {
				font-size: 20px;
				font-weight: 700;
				color: rgba(255, 255, 255, 0.35);
				margin: 0;
				text-decoration: line-through;
				text-decoration-color: rgba(231, 76, 60, 0.5);
			}

			.name-value-new {
				font-size: 22px;
				font-weight: 800;
				color: #3498db;
				margin: 0;
				text-shadow: 0 0 20px rgba(52, 152, 219, 0.25);
			}

			/* Arrow */
			.arrow-section {
				text-align: center;
				padding: 4px 0;
			}

			.arrow-icon {
				display: inline-block;
				width: 36px;
				height: 36px;
				background: rgba(52, 152, 219, 0.1);
				border-radius: 50%;
				line-height: 36px;
				font-size: 16px;
				border: 1px solid rgba(52, 152, 219, 0.2);
			}

			/* Activity Details */
			.details-section {
				padding: 16px 40px 28px 40px;
			}

			.details-box {
				background: rgba(255, 255, 255, 0.03);
				border-radius: 10px;
				padding: 16px 20px;
				border: 1px solid rgba(255, 255, 255, 0.06);
			}

			.detail-row {
				display: table;
				width: 100%;
				padding: 8px 0;
			}

			.detail-label {
				display: table-cell;
				font-size: 13px;
				color: rgba(255, 255, 255, 0.4);
				width: 40%;
				text-align: left;
				vertical-align: middle;
			}

			.detail-value {
				display: table-cell;
				font-size: 13px;
				color: rgba(255, 255, 255, 0.8);
				font-weight: 600;
				text-align: right;
				vertical-align: middle;
			}

			.detail-divider {
				height: 1px;
				background: rgba(255, 255, 255, 0.06);
				margin: 0;
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
				.content {
					padding: 20px 24px 16px 24px !important;
				}
				.change-section {
					padding: 0 24px 8px 24px !important;
				}
				.name-value-old {
					font-size: 17px !important;
				}
				.name-value-new {
					font-size: 19px !important;
				}
				.details-section {
					padding: 12px 24px 22px 24px !important;
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
				.content {
					padding: 16px 16px 12px 16px !important;
				}
				.change-section {
					padding: 0 16px 8px 16px !important;
				}
				.change-body {
					padding: 4px 16px !important;
				}
				.name-value-old {
					font-size: 16px !important;
				}
				.name-value-new {
					font-size: 17px !important;
				}
				.details-section {
					padding: 10px 16px 18px 16px !important;
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
									<span>&#9998;</span>
								</div>
							</div>

							<!-- Content -->
							<div class="content">
								<h1 class="title">Username Updated</h1>
								<p class="subtitle">Your display name has been changed successfully</p>
								<p class="greeting">
									Hi <strong style="color: #ffffff;">${oldusername}</strong>,<br><br>
									Your username on <strong style="color: #e50914;">Cine Circuit</strong> has been
									updated successfully. Here are the details of the change.
								</p>
							</div>

							<!-- Name Change Card -->
							<div class="change-section">
								<div class="change-card">
									<div class="change-header">
										<p class="change-header-text">Name Change Details</p>
									</div>
									<div class="change-body">
										<!-- Old Name -->
										<div class="name-row">
											<p class="name-label">Previous Name</p>
											<p class="name-value-old">${oldusername}</p>
										</div>

										<!-- Arrow -->
										<div class="arrow-section">
											<span class="arrow-icon">&#8595;</span>
										</div>

										<!-- New Name -->
										<div class="name-row">
											<p class="name-label">New Name</p>
											<p class="name-value-new">${username}</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Activity Details -->
							<div class="details-section">
								<div class="details-box">
									<div class="detail-row">
										<span class="detail-label">Action</span>
										<span class="detail-value">Username Change</span>
									</div>
									<div class="detail-divider"></div>
									<div class="detail-row">
										<span class="detail-label">Status</span>
										<span class="detail-value" style="color: #2ecc71;">Completed</span>
									</div>
								</div>
							</div>

							<!-- Warning -->
							<div class="warning-section">
								<div class="warning-box">
									<p>
										&#9888;&#65039; <strong style="color: rgba(255,255,255,0.65);">Wasn't you?</strong>
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
module.exports = updateNameTemplate;
