const connection = require("../mysql");

exports.post = (req, res) => {
  console.log(req.body);
  if (!req.body.start_time || !req.body.end_time || !req.body.data) {
    res
      .status(500)
      .send({ message: "There was an error in the body of your post message" });
    return;
  }
  const queries = [];
  let sessionId = "";
  connection.query(
    `INSERT INTO session (start_time,end_time) VALUES ('${req.body
      .start_time}','${req.body.end_time}')`,
    (err, rows1, fields) => {
      if (err) {
        res.status(500).send({ message: "Session creation error", error: err });
        return;
      }
      sessionId = rows1.insertId;
      let max = 0,
        min = 0;
      let prom = new Promise((resolve, reject) => {
        req.body.data.forEach((ele, i) => {
          // Edge cases
          if (req.body.data.length === 0) {
            resolve("Case 1");
          } else if (req.body.data.length === 1) {
            ele.speed = {};
            ele.speed.value = 0;
            ele.speed.score = 0;
            resolve("Case 2");
          }

          if (i === 0) {
            ele.speed = {};
            ele.speed.value = 0;
          } else if (i === req.body.data.length - 1) {
            const speed =
              getDistance(
                ele.gps.latitude,
                ele.gps.longitude,
                req.body.data[i - 1].gps.latitude,
                req.body.data[i - 1].gps.longitude
              ) /
              parseFloat(
                (new Date(ele.timestamp) -
                  new Date(req.body.data[i - 1].timestamp)) /
                  3600000
              );
            ele.speed = {};
            ele.speed.value = speed;
            if (speed > max) max = speed;
            if (speed < min) min = speed;

            resolve("Case 3");
          } else {
            const speed =
              getDistance(
                ele.gps.latitude,
                ele.gps.longitude,
                req.body.data[i - 1].gps.latitude,
                req.body.data[i - 1].gps.longitude
              ) /
              parseFloat(
                (new Date(ele.timestamp) -
                  new Date(req.body.data[i - 1].timestamp)) /
                  3600000
              );
            ele.speed = {};
            ele.speed.value = speed;
            if (speed > max) max = speed;
            if (speed < min) min = speed;
          }
        });

        req.body.data.forEach(ele => {
          ele.speed.score = scaleBetween(ele.speed.value,0.0,1.0,min,max);
        });
      });
      prom
        .then(success => {
          req.body.data.forEach(ele => {
            console.log(ele);
            queries.push(`INSERT INTO data (session_id,time_stamp,roll,pitch,yaw,gyro_score,longitude,latitude,x,y,z,accel_score,speed,speed_score)
        VALUES ('${sessionId}','${ele.timestamp}','${ele.gyro.roll}','${ele.gyro
              .pitch}','${ele.gyro.yaw}','${ele.gyro.score}',
        '${ele.gps.longitude}','${ele.gps.latitude}','${ele.accel.x}','${ele
              .accel.y}','${ele.accel.z}','${ele.accel.score}','${ele.speed
              .value}','${ele.speed.score}')`);
          });
          connection.query(queries.join("; "), (err, rows, fields) => {
            if (err) {
              res
                .status(500)
                .send({ message: "Data creation error", error: err });
              return;
            } else {
              res.status(200).send({
                message: "Session/Data created successfully",
                id: sessionId
              });
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  );
};

exports.getByLocation = (req, res) => {
  if (!req.params.longitude || !req.params.latitude || !req.params.radius) {
    res.status(500).send({
      message:
        "Error: The body of your message needs longitude,latitude, and radius"
    });
    return;
  }

  connection.query(`SELECT * FROM session`, (err, rows1, fields) => {
    if (err) {
      res.status(500).send({ message: "Session access error", error: err });
    } else {
      let total = [];
      rows1.forEach((element, i) => {
        connection.query(
          `SELECT * FROM data WHERE session_id='${element.id}'`,
          (err, rows2, fields) => {
            element = JSON.parse(JSON.stringify(element));
            rows2 = JSON.parse(JSON.stringify(rows2));
            let asdf = Object.assign({}, element);
            asdf["data"] = rows2.reduce(function(acc, cur, i) {
              acc[i] = cur;
              return acc;
            }, []);

            if (rows2[0]) {
              let testLongitude = rows2[0].longitude;
              let testLatitude = rows2[0].latitude;

              let { longitude, latitude, radius } = req.params;

              const distanceMI = getDistance(
                testLatitude,
                testLongitude,
                latitude,
                longitude
              );
              if (distanceMI <= radius) total.push(asdf);
            }

            if (rows1.length - 1 === i) {
              //console.log(total);
              res.setHeader("Content-Type", "application/json");
              res.status(200).send(JSON.stringify(total));
            }
          }
        );
      });
    }
  });
};
/********************************************************/
// Found at https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
// Much thanks to Chuck !!!

function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}


function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  d /= 1.60934; // Distance in miles
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
/*************************************************************/
exports.getAll = (req, res) => {
  connection.query(`SELECT * FROM session`, (err, rows1, fields) => {
    if (err) {
      res.status(500).send({ message: "User access error", error: err });
    } else {
      let total = [];
      rows1.forEach((element, i) => {
        connection.query(
          `SELECT * FROM data WHERE session_id='${element.id}'`,
          (err, rows2, fields) => {
            element = JSON.parse(JSON.stringify(element));
            rows2 = JSON.parse(JSON.stringify(rows2));

            let asdf = Object.assign({}, element);
            asdf["data"] = rows2.reduce(function(acc, cur, i) {
              acc[i] = cur;
              return acc;
            }, []);
            total.push(asdf);
            if (rows1.length - 1 === i) {
              //console.log(total);
              res.setHeader("Content-Type", "application/json");
              res.status(200).send(JSON.stringify(total));
            }
          }
        );
      });
    }
  });
};
exports.get = (req, res) => {
  if (!req.params.id) {
    res.status(500).send({ message: "Provide an id is your request params" });
  }
  connection.query(
    `SELECT * FROM session WHERE id='${req.params.id}'`,
    (err, rows1, fields) => {
      if (err) {
        res.status(500).send({ message: "Session access error", error: err });
      } else {
        console.log(rows1);
        rows1.forEach(element => {
          connection.query(
            `SELECT * FROM data WHERE session_id='${req.params.id}'`,
            (err, rows2, fields) => {
              rows1 = JSON.parse(JSON.stringify(rows1));
              rows2 = JSON.parse(JSON.stringify(rows2));

              let asdf = Object.assign({}, rows1[0]);
              asdf["data"] = rows2.reduce(function(acc, cur, i) {
                acc[i] = cur;
                return acc;
              }, []);
              res.setHeader("Content-Type", "application/json");
              res.status(200).send(JSON.stringify(asdf));
            }
          );
        });
      }
    }
  );
};

exports.delete = (req, res) => {
  if (!req.params.id) {
    res.status(500).send({ message: "Provide an id is your request params" });
  }
  const queries = [];
  queries.push(`delete from data where session_id=${req.params.id}`);
  queries.push(`delete from session where id=${req.params.id}`);

  connection.query(queries.join("; "), (err, rows, fields) => {
    if (err) {
      res.status(500).send({ message: "User deletion error", error: err });
      console.log(err);
    } else {
      console.log(err, rows, fields);
      res.status(200).send({ message: "User deleted successfully" });
    }
  });
};
