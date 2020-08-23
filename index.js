const express = require("express");
const mongoose = require("mongoose");
const menurouter = require("./routes/foodItems");
const userroute = require("./routes/RegisterUser");
const auth = require("./routes/auth");
const app = express();
const verificationrouter = require("./routes/verification");
require("dotenv").config();
const history = require("./routes/history");
process.env.SUPRESS_NO_CONFIG_WARNING = "y";
if (!process.env.jwtPrivateKey) {
  console.log("fatal error");
  process.exit(1);
} else console.log(process.env.jwtPrivateKey);
mongoose
  .connect(
    "mongodb+srv://anam2:anam123@cluster0.fw8l5.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/", history);
app.use("/auth", auth);
app.use("/menu", menurouter);
app.use("/", userroute);
app.use("/", verificationrouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
