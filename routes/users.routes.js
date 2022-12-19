import { Router } from "express";
import { criaUsuario } from "../controllers/users.controllers.js";

const router = Router();

router.post("/signup", criaUsuario);

export default router;
