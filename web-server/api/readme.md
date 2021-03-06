# Base URL for all online queries is http://iot4-env-1.us-east-1.elasticbeanstalk.com/


# session
### get 
This request allows you to get a particular session by it's id
```javascript
  axios.get('http://localhost:3000/api/session/22')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
```

### get by location
This request allows you to get sessions in an area. It requires a longitude, latitude, radius
In this example it is pinging tiffins location and an 8 mile radius. 
Params are longitude/latitude/radius
```javascript
axios.get('http://localhost:3000/api/session/byLocation/-91.6633/41.7069/8')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

### get all
This request allows you to get a list of all sessions with their data. Don't use this request lol
```javascript
   axios.get('http://localhost:3000/api/sessions')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
```

### get by location

### post
This request allows you to create a new session 
```javascript
  axios.post("http://localhost:3000/api/session", {
    user_id: "2",
    start_time: "now()",
    end_time: "now()",
    data: [
      {
        timestamp: "now()",
        gyro: {
          pitch: "1",
          yaw: "1",
          roll: "1"
        },
        gps: {
          longitude: "2",
          latitude: "2"
        },
        accel: {
          x: "3",
          y: "3",
          z: "3"
        }
      },
      {
        timestamp: "now()",
        gyro: {
          pitch: "1",
          yaw: "1",
          roll: "1"
        },
        gps: {
          longitude: "2",
          latitude: "2"
        },
        accel: {
          x: "3",
          y: "3",
          z: "3"
        }
      }
    ]
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```
### delete
This request allows you to delete a session base on param provided id
```javascript
  axios.delete('http://localhost:3000/api/session/22')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
```