import { connection } from "../database/server.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

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
    const newPassword = bcrypt.hashSync(password, 10);
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
      [name, email, newPassword]
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
      "SELECT * FROM users WHERE email=($1);",
      [email]
    );
    if (
      usuarioeSenha &&
      bcrypt.compareSync(password, usuarioeSenha.rows[0].password)
    ) {
      await connection.query("UPDATE users SET token = $1 WHERE email = $2", [
        token,
        usuarioeSenha.rows[0].email,
      ]);
      res.status(200).send(token);
    } else {
      return res.sendStatus(401);
    }
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

export async function rankingUsuarios(req, res) {
  try {
    const teste = await connection.query(
      `SELECT users.id, name, COUNT(urls.url) AS "linksCount",
     SUM(COALESCE(urls."visitCount",0)) AS "visitCount"
       FROM users LEFT JOIN urls ON users.id = urls."usuarioId"  GROUP BY users.id
      ORDER BY "visitCount" DESC LIMIT 10;`
    );
    res.status(200).send(teste.rows);
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
}
