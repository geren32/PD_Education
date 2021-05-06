const crypto = require('crypto');

function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
            // long arg
            if (arg.slice(0,2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2,longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : false;
                args[longArgFlag] = longArgValue;
            }
        });
    return args;
}
//const args = getArgs();
//console.log(args);


function  makeOneTimeCode () {
    const digits = '0123456789';
    let OneTimeCode = '';
    for (let i = 0; i < 6; i++) {
        OneTimeCode += digits[Math.floor(Math.random() * 10)];
    }

    let confirmTokenExpires = new Date();
    confirmTokenExpires.setTime(confirmTokenExpires.getTime() + (24 * 60 * 60 * 1000)); //24 hours
    confirmTokenExpires = confirmTokenExpires.toISOString();

    return {
        oneTimeCode,
        confirmTokenExpires
    };
}

 function makeLocalToken() {

    const buf =  crypto.randomBytes(32);
    const confirmToken = buf.toString('hex');
    let confirmTokenExpires = new Date();
    confirmTokenExpires.setTime(confirmTokenExpires.getTime() + (24 * 60 * 60 * 1000)); //24 hours
    confirmTokenExpires = confirmTokenExpires.toISOString();

    return {
        confirmToken,
        confirmTokenExpires
    };
}


module.exports = {
    getArgs,
    makeOneTimeCode,
    makeLocalToken
};


