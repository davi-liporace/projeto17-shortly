import { connection } from "../database/server.js";
import { v4 as uuid } from "uuid";

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

export async function LoginUsuario(req, res) {
  const { email, password } = req.body;
  try {
    const token = uuid();
    const usuarioeSenha = await connection.query(
      "SELECT * FROM users WHERE email=($1) AND password =($2);",
      [email, password]
    );
    if (usuarioeSenha.rowCount === 0) {
      return res.sendStatus(401);
    }
    await connection.query("UPDATE users SET token = $1 WHERE email = $2", [
      token,
      usuarioeSenha.rows[0].email,
    ]);
    res.status(200).send(token);
  } catch (err) {
    res.sendStatus(400);
  }
}

export async function historicoUsuarios(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  try {
    const verificaToken = await connection.query(
      "SELECT * FROM users WHERE token = $1;",
      [token]
    );
    const infoUsuario = await connection.query(
      'SELECT * FROM urls WHERE "usuarioId" = $1;',
      [verificaToken.rows[0].id]
    );
    const somaVisitas = await connection.query(
      'SELECT SUM("visitCount") FROM urls WHERE "usuarioId" = $1;',
      [verificaToken.rows[0].id]
    );
    console.log(somaVisitas);
    if (verificaToken.rowCount === 0) {
      return res.sendStatus(404);
    }
    res.status(200).send({
      id: verificaToken.rows[0].id,
      name: verificaToken.rows[0].name,
      visitCount: somaVisitas.rows[0].sum,
      shortenedUrls: infoUsuario.rows.map((e) => {
        return {
          id: e.id,
          shortUrl: e.shortUrl,
          url: e.url,
          visitCount: e.visitCount,
        };
      }),
    });
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
}
