import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middlwares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

//gives us req.body and converts it to standard javascript object
app.use(bodyParser.json());
app.use(cors());

fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
