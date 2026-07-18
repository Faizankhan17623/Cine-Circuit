const cancellationTemplate = (userName, data) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancelled - Cine Circuit</title>
        <style>
            body { margin:0; padding:0; background-color:#0f0f0f; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; }
            .wrap { width:100%; background:#0f0f0f; padding:40px 0; }
            .card { max-width:520px; margin:0 auto; background:linear-gradient(145deg,#1a1a2e 0%,#16213e 50%,#1a1a2e 100%); border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); }
            .header { background:linear-gradient(135deg,#e50914 0%,#b20710 100%); padding:28px 40px; text-align:center; }
            .brand { font-size:24px; font-weight:800; color:#fff; letter-spacing:2px; text-transform:uppercase; margin:0; }
            .body { padding:28px 40px; color:rgba(255,255,255,0.75); font-size:14px; line-height:1.7; }
            .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:13px; }
            .label { color:rgba(255,255,255,0.4); }
            .value { color:#fff; font-weight:600; }
            .footer { padding:20px 40px; text-align:center; font-size:12px; color:rgba(255,255,255,0.25); }
        </style>
    </head>
    <body>
        <div class="wrap">
            <div class="card">
                <div class="header"><p class="brand">Cine Circuit</p></div>
                <div class="body">
                    <p>Hi ${userName || 'there'},</p>
                    <p>Your booking has been cancelled and a refund has been initiated.</p>
                    <div style="margin-top:16px;">
                        <div class="row"><span class="label">Show Date</span><span class="value">${data.Showdate || 'N/A'}</span></div>
                        <div class="row"><span class="label">Show Time</span><span class="value">${data.time || 'N/A'}</span></div>
                        <div class="row"><span class="label">Refund Amount</span><span class="value">&#8377;${data.refundAmount || 0}</span></div>
                        <div class="row"><span class="label">Refund Status</span><span class="value">${data.refundStatus || 'pending'}</span></div>
                    </div>
                    <p style="margin-top:16px;">Refunds are typically processed by your bank within 5-7 business days.</p>
                </div>
                <div class="footer">&copy; ${new Date().getFullYear()} Cine Circuit. All rights reserved.</div>
            </div>
        </div>
    </body>
    </html>`
}

module.exports = cancellationTemplate
