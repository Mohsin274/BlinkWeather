const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require('dotenv').config();
const app = express()

const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let unit = req.body.unit;
  if (unit == undefined) {
    unit = 'celsius'
  }
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again...'});
      } else {
        function convertUnixTime(unixTime) {
          const milliseconds = unixTime * 1000;
      
          const date = new Date(milliseconds);
      
          // const year = date.getFullYear();
          // const month = ('0' + (date.getMonth() + 1)).slice(-2);
          // const day = ('0' + date.getDate()).slice(-2);
          const hours = ('0' + date.getHours()).slice(-2);
          const minutes = ('0' + date.getMinutes()).slice(-2);
          const seconds = ('0' + date.getSeconds()).slice(-2);
      
          return `${hours}:${minutes}:${seconds}`;
      }
        let weatherText = `${weather.main.temp}`;
        let date = `${weather.dt}`;
        let cityName = `${weather.name}`;
        let weatherInfo = `${weather.weather[0].description}`;
        let feelsLike = `${weather.main.feels_like}`;
        let dewPoint = `${weather.weather[0].dew_point}`;
        let tempMin = `${weather.main.temp_min}`;
        let tempMax = `${weather.main.temp_max}`;
        let windSpeed = `${weather.wind.speed}`;
        let visibility = `${weather.visibility}`;
        let pressure = `${weather.main.pressure}`;
        let humidity = `${weather.main.humidity}`;
        let countryName = `${weather.sys.country}`;
        let sunriseTime = convertUnixTime(`${weather.sys.sunrise}`);
        let sunsetTime = convertUnixTime(`${weather.sys.sunset}`);
        let iconNum = `${weather.weather[0].id}`;
        // let unitx = req.body.unit;
        res.render('index', {date: date, weather: weatherText, city: cityName, info: weatherInfo, feels: feelsLike, dew: dewPoint, visibility: visibility, min: tempMin, max: tempMax, wind: windSpeed, pressure: pressure, 
          humidity: humidity, country: countryName, sunrise: sunriseTime, sunset: sunsetTime, icon: iconNum, error: null});
        
      }
    }
  });
})

app.listen(port, function () {
  console.log(`listening on port ${port}!`)
})
