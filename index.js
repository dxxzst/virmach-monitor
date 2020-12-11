const express = require('express');
const redisAsync = require('./lib/redisAsync');
const cacheKey = "VM:PLAN";
const port = 3000;

//允许跨域
const app = express();
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method === "OPTIONS") res.send(200);
    next();
});

//基本接口
app.get("/api/v1/status", async (req, res) => {
    let result = await redisAsync.getValue(cacheKey);
    result = JSON.parse(result);
    res.json(result);
});

app.listen(port, () => console.log(`VM:PLAN listening on port ${port}!`))