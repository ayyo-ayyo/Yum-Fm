const crypto = require('crypto');

const active_tokens = new Map();

function generateNewToken(userId) {
    let token = crypto.randomBytes(24).toString('base64');
    active_tokens.set(token, userId);

    const expireMs = 5 * 60 * 1000;

    setTimeout(() => {
        active_tokens.delete(token);
    }, expireMs);

    return token;
}

function getUserFromToken(token) {
    if (!active_tokens.has(token)) {
        throw Error('Invalid token')
    }

    return active_tokens.get(token);
}

module.exports = {
    generateNewToken,
    generateNewToken
};