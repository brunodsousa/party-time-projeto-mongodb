const jwt = require("jsonwebtoken");

function checkToken(request, response, next) {
  const token = request.header("auth-token");

  if (!token) {
    return response.status(401).json({ error: "Acesso negado." });
  }

  try {
    const verified = jwt.verify(token, "nekotTerces");

    request.user = verified;

    next();
  } catch (error) {
    return response.status(400).json({ error: "Token inválido." });
  }
}

module.exports = checkToken;
