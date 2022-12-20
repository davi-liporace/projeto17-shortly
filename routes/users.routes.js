import { Router } from "express";
import { criaUsuario, LoginUsuario } from "../controllers/users.controllers.js";

const router = Router();

router.post("/signup", criaUsuario);
router.post("/signin", LoginUsuario);

export default router;
