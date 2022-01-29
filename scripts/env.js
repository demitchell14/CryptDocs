const commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

const fs = require('fs');

const now = new Date().toISOString();
let envStr;

let currentEnv;
if (fs.existsSync('.env')) {
    currentEnv = require('dotenv')
        .config().parsed;
} else {
    currentEnv = require('dotenv')
        .config({ path: '.env.default' }).parsed;
}

currentEnv.REACT_APP_GIT_HASH = commitHash;
currentEnv.REACT_APP_BUILD_DATE = now;

envStr = Object.keys(currentEnv).map((key) => (
    `${key}=${currentEnv[key]}`
)).join('\r\n');

// console.log(envStr);
fs.writeFileSync('.env', envStr, { encoding: 'utf8' })
