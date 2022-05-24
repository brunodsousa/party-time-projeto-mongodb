const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");
const verifyToken = require("../helpers/check-token");
const getUserByToken = require("../helpers/get-user-by-token");

router.get("/:id", verifyToken, async function (request, response) {
  const { id } = request.params;

  try {
    const user = await User.findOne({ _id: id }, { password: 0 });

    return response.json({ error: null, user });
  } catch (error) {
    return response.status(404).json({ error: "Usuário não encontrado." });
  }
});

router.patch("/", verifyToken, async function (request, response) {
  const token = request.header("auth-token");
  const user = await getUserByToken(token);

  const { id, name, email, password, confirmPassword } = request.body;
  const userId = user._id.toString();

  if (userId !== id) {
    return response.status(401).json({ error: "Acesso negado." });
  }

  const updateData = {
    name,
    email,
  };

  if (password) {
    if (password !== confirmPassword) {
      return response.status(401).json({ error: "As senhas não conferem." });
    } else {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      updateData.password = passwordHash;
    }
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true }
    );

    return response.json({
      error: null,
      message: "Usuário atualizado com sucesso.",
      data: updatedUser,
    });
  } catch (error) {
    return response.status(400).json(error);
  }
});

module.exports = router;
