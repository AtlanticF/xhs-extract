const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const app = express();
app.use(express.json());

let browser, page, globalA1 = '';

const stealthJsPath = path.resolve(__dirname, 'stealth.min.js');

async function initBrowser() {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
    // 注入 stealth.min.js
    const stealthScript = fs.readFileSync(stealthJsPath, 'utf-8');
    await page.evaluateOnNewDocument(stealthScript);
    console.log('准备访问小红书官网...');
    await page.setUserAgent('  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    await page.goto('https://www.xiaohongshu.com', { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('访问小红书官网成功');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await page.reload({ waitUntil: 'networkidle2' });
    const cookies = await page.cookies();
    const a1Cookie = cookies.find(c => c.name === 'a1');
    if (a1Cookie) {
        globalA1 = a1Cookie.value;
        console.log('当前浏览器中 a1 值为：' + globalA1 + '，请将您的 cookie 中的 a1 也设置成一样，方可签名成功');
    }
    console.log('跳转小红书首页成功，等待调用');
}

async function sign(uri, data, a1, web_session) {
    if (a1 !== globalA1) {
        await page.setCookie({
            name: 'a1',
            value: a1,
            domain: '.xiaohongshu.com',
            path: '/'
        });
        await page.reload({ waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        globalA1 = a1;
    }
    // 这里假设 stealth.min.js 已经注入并且 window._webmsxyw 可用
    const encryptParams = await page.evaluate(
        (url, data) => window._webmsxyw(url, data),
        uri, data
    );
    return {
        "x-s": encryptParams["X-s"],
        "x-t": String(encryptParams["X-t"])
    };
}

app.post('/api/xhs/sign', async (req, res) => {
    try {
        const { uri, data, a1, web_session } = req.body;
        const result = await sign(uri, data, a1, web_session);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/a1', (req, res) => {
    res.json({ a1: globalA1 });
});

const PORT = 3001;
initBrowser().then(() => {
    app.listen(PORT, () => {
        console.log(`Sign service running at http://localhost:${PORT}`);
    });
});