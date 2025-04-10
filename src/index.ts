import express from "express";
import { apiRoutes } from "./routes/apiRoutes";
import { pdfRoutes } from "./routes/pdfRoutes";

const app = express();

app.use(express.json());

app.use("/", apiRoutes);
app.use("/", pdfRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});