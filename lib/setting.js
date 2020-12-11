//反防爬虫
async function pageSetting(page) {
    //防反爬虫 navigator.webdriver || window.webdriver || self != top
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {get: () => false});
        Object.defineProperty(window, 'webdriver', {get: () => false});
    });
    await page.evaluateOnNewDocument(() => {
        window.navigator.chrome = {
            runtime: {},
        };
    });
    await page.evaluateOnNewDocument(() => {
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ? Promise.resolve({state: Notification.permission}) : originalQuery(parameters)
        );
    });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'platform', {
            get: () => "Win32",
        });
    });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2],
        });
    });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', {
            get: () => ["zh-CN", "zh", "en"],
        });
    });
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36");
    //await page.setViewport({width: 1920, height: 979});
}

module.exports = {pageSetting};
