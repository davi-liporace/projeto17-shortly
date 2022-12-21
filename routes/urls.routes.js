import { Router } from "express";
import {
  encurtaUrl,
  urlId,
  UrlShortRoute,
} from "../controllers/urls.controllers.js";
import { urlsMiddleware } from "../Middlewares/urlsMiddlewares.js";

const router = Router();

router.post("/urls/shorten", urlsMiddleware, encurtaUrl);
router.get("/urls/:id", urlId);
router.get("/urls/open/:shortUrl", UrlShortRoute);

export default router;
