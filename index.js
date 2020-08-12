const express = require("express");
const mongoose = require("mongoose");
const menurouter = require("./routes/foodItems");
const userroute = require("./routes/users");

const app = express();

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
app.use("/menu", menurouter);
app.use("/signup", userroute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
