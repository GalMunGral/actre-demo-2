const config = require("../db.config");
const connection = require("mysql2").createConnection(config);
const router = require("express").Router();

router.post("/create-station", (req, res) => {
  const {
    stopID,
    name,
    enterFare,
    closedStatus,
    isTrain,
    intersection,
  } = req.body;

  connection.query(
    `INSERT INTO Station VALUES 
      ("${stopID}","${name}",${enterFare},${closedStatus},${isTrain})`,
    (err) => {
      if (err) return res.status(500).send(err);
      if (!isTrain) {
        connection.query(
          `INSERT INTO BusStationIntersection VALUES
            ("${stopID}", "${intersection}")`,
          (err) => {
            if (err) return res.status(500).send(err);
            return res.send();
          }
        );
      } else {
        return res.send();
      }
    }
  );
});

router.post("/update-fare", (req, res) => {
  connection.query(
    `UPDATE Station
      SET EnterFare = ${req.body.enterFare}
      WHERE StopID = "${req.body.stopID}"`,
    (err) => {
      if (err) return res.status(500).send(err);
      return res.send();
    }
  );
});

router.get("/suspended-cards", (_, res) => {
  connection.query(
    `SELECT BreezecardNum, Username, DateTime, BelongsTo
      FROM Breezecard NATURAL JOIN Conflict
      ORDER BY DateTime ASC`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      return res.send(results);
    }
  );
});

router.post("/resolve-conflict", (req, res) => {
  const { shouldAssignToNewUser, username, breezecardNum } = req.body;
  if (shouldAssignToNewUser) {
    connection.query(
      `UPDATE Breezecard
        SET BelongsTo = "${username}"
        WHERE BreezecardNum = "${breezecardNum}"`,
      (err) => {
        if (err) return res.status(500).send(err);
      }
    );
  }
  connection.query(
    `DELETE FROM Conflict WHERE BreezecardNum = "${breezecardNum}"`,
    (err) => {
      if (err) return res.status(500).send(err);
      return res.send();
    }
  );
});

router.get("/breeze-cards", (req, res) => {
  const { username, breezecardNum, minValue, maxValue } = req.query;

  const conds = [];
  if (username) conds.push(`BelongsTo = "${username}"`);
  if (breezecardNum) conds.push(`BreezecardNum = "${breezecardNum}"`);
  if (minValue) conds.push(`Value >= ${minValue}`);
  if (maxValue) conds.push(`Value <= ${maxValue}`);

  const whereClause = conds.length ? `\nWHERE ${conds.join(" AND ")}\n` : "";

  connection.query(
    `SELECT b.BreezecardNum, b.Value, b.BelongsTo
      FROM Breezecard AS b NATURAL LEFT OUTER JOIN Conflict\
      ${whereClause}`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      return res.send(results);
    }
  );
});

router.post("/update-card-value", (req, res) => {
  connection.query(
    `UPDATE Breezecard
      SET Value = ${req.body.newValue}
      WHERE BreezecardNum = "${req.body.breezecardNum}"`,
    (err) => {
      if (err) return res.status(500).send();
      return res.send();
    }
  );
});

router.post("/update-card-owner", (req, res) => {
  connection.query(
    `UPDATE Breezecard
      SET BelongsTo = "${req.body.newOwner}"
      WHERE BreezecardNum = "${req.body.breezecardNum}"`,
    (err) => {
      if (err) return res.status(500).send(err);
      return res.send();
    }
  );
});

router.route("/flow-report").get((req, res) => {
  const { startTime, endTime } = req.query;

  connection.query(
    `SELECT A.Name AS Name, InFlow, IFNULL(OutFlow, 0) AS OutFlow, (InFlow - IFNULL(OutFlow, 0)) AS Flow, A.Revenue AS Revenue
      FROM
        (SELECT S.StopID AS SID, S.Name AS Name, COUNT(*) AS Inflow, SUM(T.Tripfare) AS Revenue
          FROM Station AS S, (
            SELECT * FROM Trip
            WHERE StartTime >= "${startTime}"
            AND StartTime <= "${endTime}" 
          ) AS T
          WHERE S.StopID = T.StartsAt
          GROUP BY T.StartsAt) AS A
      LEFT OUTER JOIN
        (SELECT S.StopID AS SID, S.Name AS Name, COUNT(*) AS Outflow, SUM(T.Tripfare) AS Revenue
          FROM Station AS S, (
            SELECT * FROM Trip
            WHERE StartTime >= "${startTime}"
            AND StartTime <= "${endTime}"
          ) AS T
          WHERE S.StopID = T.EndsAt
          GROUP BY T.EndsAt) AS B
      ON A.SID = B.SID`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      return res.send(results);
    }
  );
});

module.exports = router;
