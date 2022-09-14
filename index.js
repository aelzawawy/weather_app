// const express = require("express");
// const path = require("path"); // core module
// const fs = require("fs");     // core module

// const app = express(); // includes get, send and use functions
// const port = process.env.port || 3000;

//NOTE process.env.port for when using a hosting service, it gets the port automatically
//NOTE node i nodemon -g to auto refresh server

// To send input data
// app.get("/", (req, res) => {
//   res.send("<h1>Hello World!</h1>");
// });
// app.get("/about", (req, res) => {
//   res.send("<p>About page</p>");
// });
// app.get("/weather", (req, res) => {
//   res.send({
//     foercast: 'cold',
//     location: 'Lodon'
//   });
// });

// To send files
// const pubPath = path.join(__dirname, "/public");
// app.use(express.static(pubPath));

// // hbs is a temlate engine for dynamic html files
// // hbs files must be in a folder called views in the root directory of the project

// app.set("view engine", "hbs");
// // Changing views path
// const viewsPath = path.join(__dirname, '/templates/views');
// app.set("views", viewsPath);

// // display files
// app.get("/", (req, res) => {
//   res.render("index", {
//     Title: "Home page from hbs",
//     Name: "Ahmed",
//   });
// });

// app.get("/about", (req, res) => {
//   res.render("about", {
//     about: "About page from hbs",
//     created: "Amr",
//   });
// });

// app.get("/help", (req, res) => {
//   res.render("help", {
//     help: "Help page from hbs",
//     created: "May",
//   });
// });
/////////////////////////////////////////////////////

//nodemon src/app.js -e js,hbs

const express = require("express");
const path = require("path"); // core module
const fs = require("fs"); // core module
const hbs = require("hbs");
// for live reload
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const app = express(); // includes functions for CRUD operations
const port = process.env.port || 5000;
//partials (Common parts in diff pages)
const partialsPath = path.join(`${__dirname}`, `/templates/partials`); //partials path
hbs.registerPartials(partialsPath); //hbs function to see partials

app.use(connectLiveReload()); // for live reload

// To set root directory
const pubPath = path.join(__dirname, "/public");
app.use(express.static(pubPath));

// To use hbs
app.set("view engine", "hbs");
// Changing views default path
const viewsPath = path.join(__dirname, "/templates/views");
app.set("views", viewsPath);

// display files
app.get("/", (req, res) => {
  res.render("index", {});
});

app.get("/about", (req, res) => {
  res.render("about", {});
});

app.get("/help", (req, res) => {
  res.render("help", {});
});

// Start server on our port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// The req part of app.get.function
// req.query is an object with info from the part after ? in the route
// http://localhost:3000/products?seach=games
// {
//   search:games
// }

// app.get("/weather", (req, res) => {
//   if(!req.query.location) return res.send({error:'Please enter a location'});
//   const location = req.query.location;
//   res.send({
//     address: location,
//     forecast: 'sunny'
//   })
// });

// Implementing the weather API
const forecast = require("./tools/forecast");
const geoInfo = require("./tools/geoInfo");

app.get("/weather", (req, res) => {
  if (!req.query.location)
    return res.send({ error: "Please enter a location" });

  geoInfo(req.query.location, (geoErro, data) => {
    if (geoErro) return res.send({ error: geoErro });

    forecast(data.lat, data.long, (err, data) => {
      const dayForcast = data.forecast.forecastday;
      if (err) return res.send({ error: err });
      res.send({
        forecast: data,
        location: req.query.location,
      });
    });
  });
});
