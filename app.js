const getfrom = document.getElementById('searchForm');
const getSearchBox = document.getElementById('searchBox');
const getlocation = document.getElementById('locationValue');
const getWeatherInfo = document.querySelector('.weather-info');
const forecastInfo  = document.querySelector(".forecast-itembox");
const getWind =document.querySelector('.wind');
const getHumidity = document.querySelector('.humidy');
const error = document.getElementById('notFound');
const forecastItemBox = document.querySelector('.forecast-itembox');

const apiKey = 'c48d6099dd7b4c2e8d7b117c1abcb2e9';
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${apiKey}`;





// Update Date & Time
let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let months = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function updateClock(){
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let day = now.getDay();
    let month = now.getMonth();
    let date = now.getDate();
    let ampm;

    ampm = hours >= 12 ? "PM" : "AM";
    // convert 24h -> 12h (map 0 to 12)
    hours = hours % 12 || 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("ampm").textContent = ampm;
    document.getElementById("day").textContent = days[day];
    document.getElementById("date").textContent = `${months[month]} ${date}`;  

}

updateClock();
setInterval(updateClock,1000);



getfrom.addEventListener('submit',function(e){
    e.preventDefault();
    let locationInput = getSearchBox.value;

    curdata(locationInput);
    fivedayforecastdata(locationInput);

    getSearchBox.value = ""
    getSearchBox.focus();

    

});

async function curdata(locationInput){
    let url = `${weatherUrl}&q=${locationInput}`;

    await fetch(url)
        .then(response=>response.json())
            .then((data)=>{
                if(data.cod !== 200){
                    error.style.display = 'block';
                    getWeatherInfo.style.display = 'none';
                    getWind.style.display = 'none';
                    getHumidity.style.display = 'none';
                    forecastInfo.style.display = 'none';
                    getlocation.innerHTML = `<h5><i class="fa-solid fa-location-dot"></i> ---</h5> `;

                }else{
                    error.style.display = 'none';
                    getWeatherInfo.style.display = 'flex';
                    getWind.style.display = 'flex';
                    getHumidity.style.display = 'flex';
                    forecastInfo.style.display = 'flex';
                    getlocation.style.display = 'block'
                    let temperature = Math.round(data.main.temp);
                    getWeatherInfo.innerHTML = `
                     <img src="./img/${data.weather[0].main}.png" alt="${data.weather[0].main}"/>
                    <div class="information">
                        <h3 id="temperature">${temperature}<span>&deg;C</span></h3>
                        <h4 id="infomation">It's ${data.weather[0].main} day</h4>
                    </div>
                    `
                    getlocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.name} , ${data.sys.country} `;
                    getWind.innerHTML = `
                        <i class="fa-solid fa-wind"></i>
                        <h3>${data.wind.speed} <span>m/s</span></h3>
                    `
                    getHumidity.innerHTML = `
                        <i class="fa-solid fa-droplet"></i>
                        <h3>${data.main.humidity}%</h3>
                    `


                }
            }).catch(err=>console.log(err));
}

function fivedayforecastdata(locationInput){
    let forecastdatas = [];
    let fivedayforecast = `${forecastUrl}&q=${locationInput}`;
    forecastItemBox.innerHTML="";
    

    fetch(fivedayforecast)
            .then(response=>response.json())
                .then((data)=>{
                    
                    let forecasts = data.list;
                    forecasts.forEach((forecast)=>{
                        let date = new Date(forecast.dt_txt);
                        let hours = date.getHours();
                       
                        

                        if(hours === 12){
                            forecastdatas.push(forecast);
                        }
                    });

                    forecastdatas.forEach((forecastdata)=>{
                        console.log(forecastdata);

                            // parse date from this forecast item
                            const fdDate = new Date(forecastdata.dt_txt);
                            // format as "MMM/dd" using the existing months array instead of date-fns
                            const forecastdate = `${months[fdDate.getMonth()]} ${String(fdDate.getDate()).padStart(2, '0')}`;

                            // round the numeric temperature first, then add a plus sign if positive
                            const tempValue = Math.round(forecastdata.main.temp);
                            const temperatureDisplay = tempValue > 0 ? `+${tempValue}` : `${tempValue}`;

                            let html = `
                                <div class="forcast-item">
                                    <h5>${forecastdate}</h5>
                                    <img src="./img/${forecastdata.weather[0].main}.png" class="${forecastdata.weather[0].main}-img">
                                    <div class="forcast-info">
                                        <i class="fa-solid fa-temperature-three-quarters"></i>
                                        <h5>${temperatureDisplay} °C</h5>
                                    </div>
                                </div>


                            `

                            forecastItemBox.insertAdjacentHTML("beforeend",html);


                        });
                }).catch(err=>console.log(err));



}


























