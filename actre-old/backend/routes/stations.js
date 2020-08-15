const config = require("../db.config");
const connection = require("mysql2").createConnection(config);
const router = require("express").Router();

router.get("/", (req, res) => {
  connection.query(
    `SELECT Name, StopID, EnterFare, ClosedStatus, IsTrain, Intersection
      FROM Station NATURAL LEFT OUTER JOIN BusStationIntersection
      ORDER BY StopID ASC`,
    (err, results) => {
      if (err) return res.status(500).end(err);
      return res.send(results);
    }
  );
});

module.exports = router;
