const spiderWorker = require('./spider/run');

//运行基本
(async function () {
    await spiderWorker.runJob();
})();