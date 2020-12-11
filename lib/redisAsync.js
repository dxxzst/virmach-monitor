const redis = require('redis');
const client = redis.createClient();

function getAsync(key) {
    return new Promise((resolve, reject) => {
        client.get(key, function (err, reply) {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
}

function setAsync(key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, function (err, reply) {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        })
    });
}

function delAsync(key) {
    return new Promise((resolve, reject) => {
        client.del(key, function (err, reply) {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        })
    });
}

async function getValue(key) {
    try {
        return await getAsync(key);
    } catch (e) {
        console.log(`getValue ${key} error: ${e.message}`);
        return null;
    }
}

async function setValue(key, value) {
    try {
        await setAsync(key, value);
    } catch (e) {
        console.log(`setValue ${key}:${value} error: ${e.message}`);
    }
}

async function delKey(key) {
    try {
        //存在才删除
        let value = await getAsync(key);
        if (value) {
            await delAsync(key);
        }
    } catch (e) {
        console.log(`delKey ${key}:${value} error: ${e.message}`);
    }
}

module.exports = {getValue, setValue, delKey, client};