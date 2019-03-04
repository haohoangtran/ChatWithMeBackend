let crypto = require('crypto');
const SHAKEY = "hihihaha%$%!#@!";
const jwt = require('jsonwebtoken');
const fs = require('fs');
const FCM = require('FCM');
const path = require('path');
const SERVER_FIREBASE_KEY = "AAAAn2z8EMU:APA91bGx2KDvCsKonMiu4HZzcm8-r40A5YH88o3M6UE3Z3u_gQtV4RweP5B2W9m14jf29pC76sVZYMYmwDZNOMY5LrvFD9jogdprob900Z6AyfKbDm2zx6NshGe7NAByyvdyift-L834"
let md5 = data => {
    return crypto.createHash('md5').update(data).digest("hex");
};

let verifyToken = (token) => {
    try {
        return jwt.verify(token, SHAKEY);
    } catch (ex) {
        return null
    }
};
let getToken = (data) => {
    return jwt.sign({...data}, SHAKEY, {expiresIn: '24h'});
};
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
    input = escape(input);
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
}

function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return unescape(output);
}


function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " ")) || "";
}

function getNameFileInDir(dir, filename, ext) {
    console.log(path.join(dir, filename))
    let dirr = path.join(dir, filename + ext);
    let bo = fs.existsSync(dirr)
    if (bo) {
        return getNameFileInDir(dir, filename + '1');
    } else {
        return filename;
    }
}

function pushNotification(to, title, body, data) {

    let message = {
        to, data,
        notification: {
            title,
            body,
            "sound": true,
            "alert": true,
        }
    };
    FCM.FCM(SERVER_FIREBASE_KEY, message);
}
module.exports = {
    md5, getToken, verifyToken, encode64, decode64, getParameterByName, getNameFileInDir, pushNotification
};