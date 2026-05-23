const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    // We serve the directory to test without CORS and absolute file paths
    const { exec } = require('child_process');
    const server = exec('npx http-server -p 8080');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        await page.goto('http://127.0.0.1:8080/index.html');
        await new Promise(r => setTimeout(r, 2000));
        
        const logoutType = await page.evaluate(() => typeof window.logout);
        console.log('window.logout is:', logoutType);
        
    } catch (e) {
        console.error('Test error:', e);
    } finally {
        await browser.close();
        server.kill();
        process.exit(0);
    }
})();
