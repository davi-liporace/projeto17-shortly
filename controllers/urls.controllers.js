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
      'INSERT INTO urls("usuarioId",url, "shortUrl", "visitCount") VALUES ($1,$2,$3,$4);',
      [RecebeId.rows[0].usuarioId, url, urlEncurtada, 0]
    );
    res.status(201).send({ shortUrl: urlEncurtada });
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
}

export async function urlId(req, res) {
  const { id } = req.params;
  try {
    const selecionaId = await connection.query(
      "SELECT * FROM urls WHERE id = $1;",
      [id]
    );
    if (selecionaId.rowCount === 0) {
      return res.sendStatus(404);
    }
    res.status(200).send({
      id: selecionaId.rows[0].id,
      shortUrl: selecionaId.rows[0].shortUrl,
      url: selecionaId.rows[0].url,
    });
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
}

export async function UrlShortRoute(req, res) {
  const { shortUrl } = req.params;
  try {
    const selecionaRota = await connection.query(
      'SELECT * FROM urls WHERE "shortUrl" = $1;',
      [shortUrl]
    );
    if (selecionaRota.rowCount === 0) {
      return res.sendStatus(404);
    }
    const somaVisita = selecionaRota.rows[0].visitCount + 1;
    await connection.query(
      'UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2;',
      [somaVisita, shortUrl]
    );
    res.redirect(200, selecionaRota.rows[0].url);
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
}
