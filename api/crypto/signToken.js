const crypto = require("crypto");

const SECRET = process.env.JWT_SIGNING_SECRET;

function generateToken(domain) {
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(domain);
  return hmac.digest("hex");
}

function verifyToken(domain, token) {
  const expectedToken = generateToken(domain);
  return expectedToken === token;
}

module.exports = { generateToken, verifyToken };