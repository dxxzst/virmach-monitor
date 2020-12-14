const exec = require('child_process').exec;
const redisAsync = require('../lib/redisAsync');
const timer = require('../lib/timeFormatter');
const cacheKey = "VM:PLAN";

function sleep(time = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}

//运行
async function runExec() {
    while (true) {
        execute("curl -s https://billing.virmach.com/modules/addons/blackfriday/new_plan.json", async function (result) {
            try {
                let jsonResult = JSON.parse(result);
                jsonResult.updateTime = timer.get();
                jsonResult = JSON.stringify(jsonResult);
                await redisAsync.setValue(cacheKey, jsonResult);
            } catch (e) {
                console.log(`${timer.get()} runExec error: ${e.message}`);
            }
        });
        await sleep(1000);
    }
}

module.exports = {runExec};