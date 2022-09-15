const form = document.querySelector("#myForm");
const input = document.querySelector("#location");
const forecast = document.querySelector("#forecast");
const loc = document.querySelector("#loc");
const days = document.querySelector(".days");
const details = document.querySelector(".details");
const getLocation = document.querySelector("#getLoc");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  weatherFunction();
  details.innerHTML = "";
  document.querySelector("#content").classList.remove("content");
});

///////// Get browser's location function
getLocation.addEventListener("click", function () {
  if (!navigator.geolocation)
    return console.log("Geolocation is not supported by this browser.");

  navigator.geolocation.getCurrentPosition(currLocation);
  details.innerHTML = "";
  document.querySelector("#content").classList.remove("content");
});
const currLocation = (position) => {
  const GPS =
    (input.value = `${position.coords.longitude},${position.coords.latitude}`);
  weatherFunction(GPS);
};

///////// Forecast function
const weatherFunction = async (GPS) => {
  try {
    const location = input.value;
    let res = await fetch(`http://localhost:5000/weather?location=${GPS}`);
    res = await fetch(`http://localhost:5000/weather?location=${location}`);
    const data = await res.json();
    // Fetching forecast data
    const daysForecast = data.forecast.forecast.forecastday;
    days.innerHTML = "";
    input.value = `${data.forecast.location.name}, ${data.forecast.location.region}`;
    // Summery cards
    addCard(daysForecast);
    // Hourly details
    addDetails(daysForecast);
    // input.value = '';
  } catch (err) {
    console.log(err);
  }
};

///////// Days function
const addCard = (daysForecast) => {
  daysForecast.map((el, i) => {
    const date = new Date(el.date_epoch * 1000);

    // Formatting date
    const day = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
    }).format(date);

    // Adding forecast cards
    const html = `
    <div class="card" order="${i}">
      <div class="icon"><img src="${el.day.condition.icon}" alt=""></div>
      <div class="day">${day}</div>
      <div class="max-temp">${el.day.maxtemp_c}℃</div>
      <div class="min-temp">${el.day.mintemp_c}℃</div>
      <div class="condition">${el.day.condition.text}</div>
    </div>
    `;
    days.insertAdjacentHTML("beforeend", html);
  });
};

///////// Details function
const addDetails = (daysForecast) => {
  document.querySelector("body").addEventListener("click", function (e) {
    const cards = document.querySelectorAll(".card");
    if (!e.target.closest(".card")) {
      details.innerHTML = "";
      cards.forEach((el) => el.classList.remove("cardClicked"));
      return document.querySelector("#content").classList.remove("content");
    }
    const current = e.target.closest(".card").getAttribute("order");

    cards.forEach((el) => el.classList.remove("cardClicked"));
    e.target.closest(".card").classList.add("cardClicked");

    details.innerHTML = "";
    daysForecast[current].hour.map((el) => {
      // Formatting hours
      const currDate = new Date(el.time_epoch * 1000);
      const now = new Date(Date.now()).getTime();
      
      // Skipping data from passed hours
      if((el.time_epoch * 1000) < now) return;

      const hour = new Date(currDate).toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      const html = `
      <div class="details-card">
      <div class="hour">${hour}</div>
      <div class="temp">${el.temp_c}℃</div>
      <div class="condition">${el.condition.text}</div>
      <div class="icon"><img src="${el.condition.icon}" alt=""></div>
      <div class="img"><img src="wind.png"width="25" alt=""> ${el.wind_kph} kph (${el.wind_dir})</div> 
      <div class="humedity"><img src="Humidity.png"width="25" alt=""> ${el.humidity}</div>
      <div class="Precipitation"><img src="water.png"width="25" alt=""> ${el.precip_mm} mm</div>
      </div>
      `;
      details.insertAdjacentHTML("beforeend", html);
    });
    document.querySelector("#content").classList.add("content");
  });
};
