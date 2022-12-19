import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(usersRoutes);

app.listen(4000, () => console.log(`Server running in port: 4000`));
