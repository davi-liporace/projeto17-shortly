import { connection } from "../database/server.js";

export async function criaUsuario(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.sendStatus(500);
    }
    const usuarioJaExiste = await connection.query(
      "SELECT * FROM users WHERE email=($1);",
      [email]
    );
    if (usuarioJaExiste.rowCount > 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
      [name, email, password]
    );
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
  }
}
