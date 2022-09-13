const form = document.querySelector("#myForm");
const input = document.querySelector("#location");
const forecast = document.querySelector("#forecast");
const loc = document.querySelector("#loc");
const days = document.querySelector(".days");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  weatherFunction();
});

const weatherFunction = async () => {
  try {
    const location = input.value;
    const res = await fetch(
      `http://localhost:3000/weather?location=${location}`
    );
    const data = await res.json();

    // Fetching forecast data 
    const daysForecast = data.forecast.forecast.forecastday;
    days.innerHTML = "";
    daysForecast.map((el) => {
      const date = new Date(el.date_epoch * 1000);

      // Formatting date
      const day = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
      }).format(date);

      // Adding forecast cards
      addCard(el, day);
    });

    // if (data.error) {
    //   input.style.backgroundColor='#ee7a7a';
    //   input.value = '';
    //   input.placeholder = data.error;
    //   forecast.innerHTML ='';
    //   loc.innerHTML ='';
    //   forecast.style.opacity = "0";
    //   loc.style.opacity = "0";
    // }
  } catch (err) {
    console.log(err);
  }
};

const addCard = (el, day) => {
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
};

