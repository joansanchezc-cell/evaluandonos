const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('file:///C:/Users/ANDRESAN/Desktop/Evaluandonos/index.html', { waitUntil: 'networkidle0' });

  console.log('Page loaded. Attempting login...');
  await page.evaluate(() => {
    document.getElementById('li-user').value = 'andresan';
    document.getElementById('li-pass').value = 'admin123';
    document.getElementById('btn-login').click();
  });

  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Attempting student login...');
  await page.evaluate(() => {
    document.getElementById('li-est-id').value = '12345';
    document.getElementById('btn-login-est').click();
  });

  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
