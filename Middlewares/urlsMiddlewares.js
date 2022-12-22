import { connection } from "../database/server.js";
import { encurtaUrlSchema } from "../Schemas/urlSchemas.js";

export async function urlsMiddleware(req, res, next) {
  const user = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!req.headers) {
    return res.sendStatus(401);
  }
  const findToken = await connection.query(
    "SELECT * FROM users WHERE token = $1;",
    [token]
  );
  if (findToken.rowCount === 0) {
    return res.sendStatus(401);
  }
  const { error } = encurtaUrlSchema.validate(user, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }
  next();
}
