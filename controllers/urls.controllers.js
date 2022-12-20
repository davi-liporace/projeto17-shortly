import { nanoid } from "nanoid";
import { connection } from "../database/server.js";

export async function encurtaUrl(req, res) {
  const { url } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  try {
    const urlEncurtada = nanoid();
    const RecebeId = await connection.query(
      'SELECT "usuarioId" FROM sessoes WHERE token = $1;',
      [token]
    );
    await connection.query(
      'INSERT INTO urls("usuarioId",url, "shortUrl") VALUES ($1,$2,$3);',
      [RecebeId.rows[0].usuarioId, url, urlEncurtada]
    );
    res.status(201).send({ shortUrl: urlEncurtada });
  } catch (err) {
    res.sendStatus(400);
  }
}
