const exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}

execute("curl -s https://billing.virmach.com/modules/addons/blackfriday/new_plan.json", function (result) {
    console.log(result);
})