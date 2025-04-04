const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const knex = require("../config/db");

exports.register = async (req, res) => {
  try {
    console.log("Registering user:", req.body);

    const { name, phone, bloodType, role, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await knex("tblPY1")
      .insert({
        username,
        password: hashedPassword,
        name,
        phone,
        bloodType,
        role,
      })
      .returning("*");

    const { userId, role: rl } = user;
    const token = jwt.sign(
      { userId: userId, role: rl },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await knex("tblPY1").where({ username }).first();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.userId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};
