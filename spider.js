const spiderWorker = require('./spider/run');
const execWorker = require('./lib/execRun');

//运行基本
(async function () {
    await execWorker.runExec();
})();