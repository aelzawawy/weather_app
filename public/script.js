const form = document.querySelector("#myForm");
const input = document.querySelector("#location");
const forecast = document.querySelector("#forecast");
const loc = document.querySelector("#loc");
const days = document.querySelector(".days");
const getLocation = document.querySelector('#getLoc')

form.addEventListener("submit", (e) => {
  e.preventDefault();
  weatherFunction();
});

// Get browser's location
getLocation.addEventListener( 'click', function() {
  if (!navigator.geolocation) return console.log("Geolocation is not supported by this browser.");

  navigator.geolocation.getCurrentPosition(currLocation);
});

const currLocation = (position) => {
  const GPS = input.value = `${position.coords.longitude},${position.coords.latitude}`;
  weatherFunction(GPS);
};

const weatherFunction = async (GPS) => {
  try {
    const location = input.value;
    let res = await fetch(
      `http://localhost:5000/weather?location=${GPS}`
    );
    res = await fetch(
      `http://localhost:5000/weather?location=${location}`
    );
    const data = await res.json();
    // Fetching forecast data
    const daysForecast = data.forecast.forecast.forecastday;
    days.innerHTML = "";
    input.value = `${data.forecast.location.name}, ${data.forecast.location.region}`;
    addCard(daysForecast);

  } catch (err) {
    console.log(err);
  }
};

const addCard = (daysForecast) => {
  daysForecast.map((el) => {
    const date = new Date(el.date_epoch * 1000);

    // Formatting date
    const day = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
    }).format(date);

    // Adding forecast cards
    const html = `
    <div class="card">
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