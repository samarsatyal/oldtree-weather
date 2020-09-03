
const imageElement = document.querySelector(".weather-image");
const notificationElement = document.querySelector(".notification");
const temperatureElement = document.querySelector(".temperature-value p");
const descriptionElement = document.querySelector(".temperature-desc p");
const locationElement = document.querySelector(".current-location p");
const pressureElement = document.querySelector(".pressure p");
const humidityElement = document.querySelector(".humidity p");
const windSpeedElement = document.querySelector(".windSpeed p");

const KELVIN = 273;

const weatherData = {};

const key = config.MY_KEY;

weatherData.temperature ={ //store default 'unit' for temperature in weatherData.
	unit : "celsius"
}

//GET ZIP CODE ENTERED IN THE index.html
function setZipCode(zipFromUser){
	var form = document.getElementById('zipCodeForm');
	var zipFromUser = form.elements.zipcodefield.value; //Zip code value entered by user in index.html

	getWeatherWithZip(zipFromUser);
}

function getWeatherWithZip(zip){
	let api_Zip = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${key}`;
	console.log(api_Zip);

	fetchApiData(api_Zip);
}

//GEOLOCATION CHECK:
//1. First obtain the geolocation of the user's device.
if('geolocation' in navigator){
	navigator.geolocation.getCurrentPosition(setPosition, setError);
}else{
	notificationElement.style.display = "block";
	notificationElement.innerHTML = `<p>Browser doesn't support Geolocation.</p>`;
}

function setPosition(position){
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;

	getWeather(latitude, longitude);
}

function setError(error){
	notificationElement.style.display = "block";
	notificationElement.innerHTML = `<p> ${error.message} </p>`;
}


//2. Get weather data from www.openweathermap.com using the API key.

function getWeather(latitude, longitude){
	let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
	console.log(api);

	fetchApiData(api);
}


//FETCH API DATA -- gets 'api_Zip' from getWeatherWithZip() or 'api' from 'getWeather()'
function fetchApiData(api_data){
	fetch(api_data)
		.then(function(response){
			let data = response.json();

			if(!response.ok){
				throwZipCodeError();
			}else{
				notificationElement.innerHTML = null;
				return data;
			}
		})

		.then(function(data){
			weatherData.temperature.value = Math.floor(data.main.temp - KELVIN);
			weatherData.description = data.weather[0].description;
			weatherData.iconId = data.weather[0].icon;
			weatherData.city = data.name;
			weatherData.country = data.sys.country;
			weatherData.pressure = data.main.pressure;
			weatherData.humidity = data.main.humidity;
			weatherData.windSpeed = data.wind.speed;
		})

		.then(function(){
			displayWeatherForUser();
		});
		
}

function throwZipCodeError(){
	notificationElement.style.display = "block";
	notificationElement.innerHTML = `<p>Incorrect Zip Code</p>`;
}


function displayWeatherForUser(){
	imageElement.innerHTML = `<img src = "icons/${weatherData.iconId}.png"/>`;
	temperatureElement.innerHTML = `${weatherData.temperature.value}°<span>C</span>`;
	descriptionElement.innerHTML = `${weatherData.description}`;
	locationElement.innerHTML = `${weatherData.city}, ${weatherData.country}`;
	pressureElement.innerHTML = `<span>Pressure: </span>${weatherData.pressure}<span> hPa</span>`;
	humidityElement.innerHTML = `<span>Humidity: </span>${weatherData.humidity}<span> %</span>`;
	windSpeedElement.innerHTML = `<span>Wind Speed: </span>${weatherData.windSpeed}<span> mph </span>`;
}

//Convert from Celsius to Fahrenheit when user clicks on the temperatureElement

function celsiusToFahrenheit(temperature){
	return (temperature * 9/5) + 32;
}

temperatureElement.addEventListener("click", function(){
	if(weatherData.temperature.value === undefined) return;

	if(weatherData.temperature.unit == "celsius"){
		let fahrenheit = celsiusToFahrenheit(weatherData.temperature.value);
		fahrenheit = Math.floor(fahrenheit); //store the absolute value in fahrenheit

		temperatureElement.innerHTML = `${fahrenheit}<span> F</span>`;
		weatherData.temperature.unit = "fahrenheit";
	}else{
		temperatureElement.innerHTML = `${weatherData.temperature.value}°<span>C</span>`;
		weatherData.temperature.unit = "celsius";
	}
});