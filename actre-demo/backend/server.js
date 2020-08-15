const express = require("express");
const bodyParser = require("body-parser");

const PORT = 8081;

const app = express();

app.use(bodyParser.json());

const router = express.Router();

router.use("/auth", require("./routes/auth"));
router.use("/stations", require("./routes/stations"));
router.use("/passenger", require("./routes/passenger"));
router.use("/admin", require("./routes/admin"));

app.use("/api", router);

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`Listening on port ${PORT}!`);
  }
});
