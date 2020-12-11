const puppeteer = require('puppeteer');
const setting = require('../lib/setting');
const redisAsync = require('../lib/redisAsync');
const timer = require('../lib/timeFormatter');
const vm_url = "https://virmach.com/black-friday-cyber-monday/";
const vm_plan_url = "https://billing.virmach.com/modules/addons/blackfriday/new_plan.json";
const cacheKey = "VM:PLAN";

//监控运行
async function runWorker(page) {
    let errorTimes = 0;
    //正常请求
    page.on('response', async (response) => {
        if (response.url() === vm_plan_url) {
            let jsonResult = await response.json();
            jsonResult.updateTime = timer.get();
            await redisAsync.setValue(cacheKey, JSON.stringify(jsonResult));
            errorTimes = 0;
        }
    });

    //请求出错
    page.on('requestfailed', async (request) => {
        if (request.url() === vm_plan_url) {
            errorTimes++;
            if (errorTimes > 6) {
                errorTimes = 0;
                await page.reload();
                await page.waitForSelector('.pricetable', {visible: true, timeout: 60000});
            }
        }
    });

    // await page.evaluate(() => {
    //     setInterval(function () {
    //         $.getJSON('https://billing.virmach.com/modules/addons/blackfriday/new_plan.json');
    //     }, 5000);
    // });
}

//运行任务
async function runJob(headless = true) {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--disable-features=site-per-process'
        ],
        headless: headless
    });
    try {
        let page = await browser.newPage();
        await setting.pageSetting(page);
        await page.goto(vm_url);
        await runWorker(page);
    } catch (e) {
        console.log(`${timer.get()} runJob error: ${e.message}`);
        await browser.close();
    }
}

module.exports = {runJob};