const bugReportSubmittedTemplate = (bugId, title, description, userName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bug Report Received — Cine Circuit</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0f0f0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e0e0e0; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: linear-gradient(145deg, #1a1a1a 0%, #141414 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid #2a2a2a; }
    .header { background: linear-gradient(135deg, #b20710 0%, #e50914 50%, #b20710 100%); padding: 36px 40px; text-align: center; }
    .brand { font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 3px; text-transform: uppercase; }
    .brand-sub { font-size: 11px; color: rgba(255,255,255,0.75); letter-spacing: 4px; text-transform: uppercase; margin-top: 4px; }
    .icon-wrap { margin: 32px auto 0; width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; }
    .body { padding: 40px; }
    .greeting { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .subtitle { font-size: 14px; color: #999; line-height: 1.7; margin-bottom: 28px; }
    .id-box { background: linear-gradient(135deg, #1e0507 0%, #2d0a0e 100%); border: 1px dashed #e50914; border-radius: 12px; padding: 20px 28px; margin-bottom: 28px; text-align: center; }
    .id-label { font-size: 11px; color: #888; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .id-value { font-size: 26px; font-weight: 800; color: #e50914; letter-spacing: 4px; font-family: 'Courier New', monospace; }
    .details-box { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px 28px; margin-bottom: 28px; }
    .detail-row { margin-bottom: 16px; }
    .detail-row:last-child { margin-bottom: 0; }
    .detail-label { font-size: 10px; color: #666; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; }
    .detail-value { font-size: 14px; color: #d0d0d0; line-height: 1.6; border-left: 3px solid #e50914; padding-left: 12px; }
    .info-box { background: rgba(229,9,20,0.06); border: 1px solid rgba(229,9,20,0.2); border-radius: 10px; padding: 18px 22px; margin-bottom: 28px; }
    .info-box p { font-size: 13px; color: #bbb; line-height: 1.7; }
    .info-box p span { color: #e50914; font-weight: 600; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #2a2a2a, transparent); margin: 24px 0; }
    .footer { background: #111; padding: 24px 40px; text-align: center; border-top: 1px solid #1e1e1e; }
    .footer p { font-size: 12px; color: #555; line-height: 1.8; }
    .footer a { color: #e50914; text-decoration: none; }
    @media (max-width: 600px) {
      .body { padding: 24px; }
      .header { padding: 28px 24px; }
      .brand { font-size: 22px; }
      .id-value { font-size: 20px; }
      .footer { padding: 20px 24px; }
    }
    @media (max-width: 400px) {
      .body { padding: 16px; }
      .details-box { padding: 16px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="brand">Cine Circuit</div>
        <div class="brand-sub">Your Cinema Experience</div>
        <div class="icon-wrap">🐛</div>
      </div>
      <div class="body">
        <div class="greeting">Bug Report Received, ${userName}!</div>
        <div class="subtitle">
          Thank you for taking the time to report this issue. Our team has received your bug report and will investigate it as soon as possible. We'll notify you once it's resolved.
        </div>

        <div class="id-box">
          <div class="id-label">Your Bug Report ID</div>
          <div class="id-value">${bugId}</div>
        </div>

        <div class="details-box">
          <div class="detail-row">
            <div class="detail-label">Bug Title</div>
            <div class="detail-value">${title}</div>
          </div>
          <div class="divider"></div>
          <div class="detail-row">
            <div class="detail-label">Description</div>
            <div class="detail-value">${description}</div>
          </div>
          <div class="divider"></div>
          <div class="detail-row">
            <div class="detail-label">Status</div>
            <div class="detail-value">🟡 Open — Under Review</div>
          </div>
          <div class="divider"></div>
          <div class="detail-row">
            <div class="detail-label">Submitted On</div>
            <div class="detail-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' })} IST</div>
          </div>
        </div>

        <div class="info-box">
          <p>
            Please <span>save your Bug ID (${bugId})</span> for future reference. You can use it to track the status of your report in your dashboard under <span>My Bug Reports</span>.
          </p>
        </div>

        <div class="info-box">
          <p>
            Our admin team will review your report and update the status to <span>In Progress</span> or <span>Resolved</span>. You'll receive an email notification when your bug is resolved.
          </p>
        </div>
      </div>
      <div class="footer">
        <p>
          This is an automated message from <a href="#">Cine Circuit</a>.<br />
          If you did not submit this bug report, please contact our support team.<br />
          &copy; ${new Date().getFullYear()} Cine Circuit. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`
}

module.exports = bugReportSubmittedTemplate
