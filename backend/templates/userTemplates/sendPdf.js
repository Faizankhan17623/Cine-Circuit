const pdf = require('html-pdf');
const template = require('./pdfTemplate')
const generatePDF = (htmlTemplate) => {
    console.log("Generating PDF...");
    // console.log(htmlTemplate);
    return new Promise((resolve, reject) => {
        if (!htmlTemplate) {
            reject(new Error('HTML template is required'));
            return;
        }

        const options = {
            format: 'A4',
            border: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            timeout: 30000, // 30 seconds timeout
            renderDelay: 1000 // 1 second render delay
        };

        pdf.create(htmlTemplate, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
        console.log("PDF generated and send successfully.");
    });
};

module.exports = generatePDF;