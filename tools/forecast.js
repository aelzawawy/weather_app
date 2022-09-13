const request = require("request");

const forecast = (lat, long, call) => {
  const wUrl = `https://api.weatherapi.com/v1/forecast.json?key=820a10e1f8cf483f84d45203221309&q=${lat},${long}&days=7&aqi=yes&alerts=no`;
  request({ url: wUrl, json: true }, (error, response) => {
    if (error) {
      call("Error occurred");
    } else if (response.body.error) {
      call(response.body.error.message);
    } else {
      call(
        undefined,
        response.body
      );
    }
  });
};


module.exports= forecast;