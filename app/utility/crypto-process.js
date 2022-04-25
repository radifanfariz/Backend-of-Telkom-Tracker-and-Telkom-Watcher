const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'A88BF378612E335FB3B35DD6D57EC000';
const iv = crypto.randomBytes(16);

exports.encrypt = (text) => {
    // console.log("key:",key);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

exports.decrypt = (text) => {
    // console.log("key:",key);
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}