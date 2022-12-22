import { Router } from "express";
import {
  criaUsuario,
  historicoUsuarios,
  LoginUsuario,
} from "../controllers/users.controllers.js";
import {
  signInMiddleware,
  signUpMiddleware,
} from "../Middlewares/usersMiddlewares.js";

const router = Router();

router.post("/signup", signUpMiddleware, criaUsuario);
router.post("/signin", signInMiddleware, LoginUsuario);
router.get("/users/me", historicoUsuarios);
export default router;
