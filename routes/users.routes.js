import { Router } from "express";
import {
  criaUsuario,
  historicoUsuarios,
  LoginUsuario,
  rankingUsuarios,
} from "../controllers/users.controllers.js";
import {
  signInMiddleware,
  signUpMiddleware,
} from "../Middlewares/usersMiddlewares.js";

const router = Router();

router.post("/signup", signUpMiddleware, criaUsuario);
router.post("/signin", signInMiddleware, LoginUsuario);
router.get("/users/me", historicoUsuarios);
router.get("/ranking", rankingUsuarios);
export default router;
