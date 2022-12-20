import { Router } from "express";
import { encurtaUrl } from "../controllers/urls.controllers.js";

const router = Router();

router.post("/urls/shorten", encurtaUrl);

export default router;
