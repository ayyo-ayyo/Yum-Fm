const crypto = require('crypto');

const active_tokens = new Map();
const timeout_ids = new Set();

function generateNewToken(userId) {
    let token = crypto.randomBytes(24).toString('base64');
    active_tokens.set(token, userId);

    const expireMs = 10 * 60 * 1000; // Time until the token is invalidated (10 minutes)

    let timeoutId;
    timeoutId = setTimeout(() => {
        console.log(`Invalidating token "${token}"`);
        active_tokens.delete(token);
        timeout_ids.delete(timeoutId);
    }, expireMs);

    timeout_ids.add(timeoutId);

    return token;
}

function validateToken(token) {
    if (!active_tokens.has(token)) {
        throw Error('Invalid token')
    }

    return active_tokens.get(token);
}

function clearAllTimeouts() {
    timeout_ids.forEach(curId => clearTimeout(curId));
}

module.exports = {
    generateNewToken,
    validateToken,
    clearAllTimeouts
};