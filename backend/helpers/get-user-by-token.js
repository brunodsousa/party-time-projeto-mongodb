const jwt = require("jsonwebtoken");

const User = require("../models/user");

async function getUserByToken(token) {
  if (!token) {
    return response.status(401).json({ error: "Acesso negado." });
  }

  const decoded = jwt.verify(token, "nekotTerces");

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
}

module.exports = getUserByToken;
