const request = require("request");

const geoInfo = (location, call) => {
  const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/"${location}.json?access_token=pk.eyJ1IjoiZmFyYWgxMjMiLCJhIjoiY2tpb3ZrNnE4MDB0cjJ0cDlzZXZ5eHQ5dSJ9.F6mgRF14yRJ6WN9JqtpWtw`;

  request({ url: geoUrl, json: true }, (error, response) => {
    error
      ? call("error ocurred")
      : response.body.message
      ? call(response.body.message)
      : response.body.features.length == 0
      ? call("Invalid country")
      : call(undefined, {
          long: response.body.features[0].center[0],
          lat: response.body.features[0].center[1],
        });
  });
};

module.exports = geoInfo;
