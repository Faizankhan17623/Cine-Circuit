const puppeteer = require('puppeteer');
const template = require('./pdfTemplate')

let browserPromise = null;
const getBrowser = () => {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    return browserPromise;
};

const generatePDF = async (htmlTemplate) => {
    console.log("Generating PDF...");
    if (!htmlTemplate) {
        throw new Error('HTML template is required');
    }

    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        // The ticket is static HTML with only data: URL images: no scripts to run, nothing to fetch
        await page.setJavaScriptEnabled(false);
        await page.setContent(htmlTemplate, { waitUntil: 'load', timeout: 30000 });
        const buffer = await page.pdf({
            format: 'A4',
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
            printBackground: true
        });
        console.log("PDF generated and send successfully.");
        return buffer;
    } finally {
        await page.close();
    }
};

module.exports = generatePDF;