const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/register", async function (request, response) {
  const { name, email, password, confirmPassword } = request.body;

  if (!name || !email || !password || !confirmPassword) {
    return response
      .status(400)
      .json({ error: "Por favor, preencha todos os campos." });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ error: "As senhas não conferem." });
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return response
      .status(400)
      .json({ error: "O e-mail informado já está em uso." });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    const newUser = await user.save();

    const token = jwt.sign(
      {
        name: newUser.name,
        id: newUser._id,
      },
      "nekotTerces"
    );

    return response.json({
      error: null,
      message: "Você realizou o cadastro com sucesso.",
      token,
      userId: newUser._id,
    });
  } catch (error) {
    return response.status(400).json({ error });
  }
});

router.post("/login", async function (request, response) {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (!user) {
    return response
      .status(400)
      .json({ error: "Não há um usuário cadastrado com este e-mail." });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return response.status(400).json({ error: "E-mail ou senha incorretos." });
  }

  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "nekotTerces"
  );

  return response.json({
    error: null,
    message: "Você está autenticado!",
    token,
    userId: user._id,
  });
});

module.exports = router;
