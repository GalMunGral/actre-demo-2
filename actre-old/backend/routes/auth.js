const md5 = require("md5");
const config = require("../db.config");
const connection = require("mysql2").createConnection(config);
const router = require("express").Router();

router.post("/login", (req, res) => {
  connection.query(
    `SELECT * FROM User
      WHERE Username = "${req.body.username}"
      AND Password = "${md5(req.body.password)}"`,
    (err, results) => {
      if (err || results.length === 0) return res.status(500).send(err);
      return res.send({
        success: true,
        userType: results[0].IsAdmin ? "ADMIN" : "PASSENGER",
      });
    }
  );
});

router.post("/register", (req, res) => {
  const { username, email, password, breezecardNum } = req.body;

  const genCardNumber = () => Math.floor(Math.random() * Math.pow(10, 16));

  connection.query(
    `INSERT INTO User VALUES ("${username}", "${md5(password)}", 0)`,
    (err) => {
      if (err) return res.status(500).send(err);
      connection.query(
        `INSERT INTO Passenger VALUES ("${username}", "${email}")`,
        (err) => {
          if (err) return res.status(500).send(err);

          if (!breezecardNum) {
            // Issue a new card
            connection.query(
              `INSERT INTO Breezecard VALUES ("${genCardNumber()}", 0, "${username}")`,
              (err) => {
                if (err) return res.status(500).send(err);
                return res.send();
              }
            );
          } else {
            // Existing card
            connection.query(
              `SELECT * FROM Breezecard WHERE BreezecardNum = "${breezecardNum}"`,
              (err, results) => {
                if (err) return res.status(500).send(err);
                if (results.length === 0) {
                  // It's a new card
                  connection.query(
                    `INSERT INTO Breezecard VALUES ("${breezecardNum}", 0, "${username}")`,
                    (err) => {
                      if (err) return res.status(500).send(err);
                      return res.send();
                    }
                  );
                } else {
                  if (results[0].BelongsTo === null) {
                    // No one owns the card yet
                    connection.query(
                      `UPDATE Breezecard
                        SET BelongsTo = "${username}"
                        WHERE BreezecardNum = "${breezecardNum}"`,
                      (err) => {
                        if (err) return res.status(500).send(err);
                        return res.send();
                      }
                    );
                  } else {
                    // There is a conflict
                    if (results[0].BelongsTo !== username) {
                      connection.query(
                        `INSERT INTO Conflict VALUES ("${username}", "${breezecardNum}", NOW())`,
                        (err) => {
                          if (err) return res.status(500).send(err);
                          connection.query(
                            `INSERT INTO Breezecard VALUES ("${genCardNumber()}", 0, "${username}")`,
                            (err) => {
                              if (err) return res.status(500).send(err);
                              return res.send();
                            }
                          );
                        }
                      );
                    }
                  }
                }
              }
            );
          }
        }
      );
    }
  );
});

module.exports = router;
