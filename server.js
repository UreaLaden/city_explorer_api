
/*
## Set up Server
- Create and clone down a github repository
- touch server.js
- npm init
- npm install -S express dotenv cors - Install needed libraries
-Setup the server.js file
- Loading the packages
- setting up the app
- adding routes
- starting the server
*/


/*
    The Environment: the collection of all variables that belong to the terminal window your code is running in
    I want to use the PORT the computer wants me to use since the port is a computerish thing
    I will pick my port from the environment.

    Creating a variable in your terminals env is 'export VARNAME=value'
    It is semantic to name your variables in all caps

    If I want to look at the env variables in the terminal type: 'env'
    To see them in javascript: 'process.env.VARNAME'

    As devs, we can save our environment variables in a file called '.env'
    
    When data is sent from the client to the backend, it comes in a property: ' request.query'
    */
//============================Packages================================

const express = require('express');
const cors = require('cors'); //lets our computer talk to itself
// If this line of code comes, delete it const { response } = require('express');

//TODO: load dotenv
require('dotenv').config(); // read the '.env' files's saved env variables AFTER reading the real env's variables


//============================Apps================================
const app = express(); // express() will return a fully ready to run server object
app.use(cors()); // enables local processes to talk  to the server // Cross Origin Resource Sharing

const PORT = process.env.PORT || 3009; //If there is a port use it otherwise use 3009
console.log(process.env.candy);
//============================Routes================================
const locationData = require('./location.json'); //in an express server, we can synchronously get data from a local json file without a .then
const weatherData = require('./weather.json');
const { response } = require('express');

//this route can be visited  http://localhost:3009/puppy
app.get('/location',getLocationData); // this is a route that lives at /puppy and sends a ginger object
function getLocationData(request,response){
    let locOne = new Location(locationData,request.query);
    response.send(locOne);
}

app.get('/weather',getWeatherData);
function getWeatherData(req,res){
    console.log(weatherData);
    let currentForecast = new WeatherForcast(weatherData);
    res.send(currentForecast);
}

function WeatherForcast(weatherData){
    let allForecasts = [];
    for(let i=0;i< weatherData.data.length;i++){
        let forecast = weatherData.data[i].weather.description;
        let dateTime = weatherData.data[i].datetime;
        let city = weatherData.city_name;
        allForecasts.push(new Forecast(forecast,dateTime, city));
    } 
    return allForecasts;   
    
}

function Forecast(forecast,time,city){
    this.forecast = forecast;
    this.time = time;
    this.city = city;
}

function Location(dataFromTheFile,cityName){
    let city = Object.keys(cityName)[0];
    this.search_query = city;
    this.formatted_query = dataFromTheFile[0].display_name;
    this.latitude = dataFromTheFile[0].lat;
    this.longitude = dataFromTheFile[0].lon;
}

//============================Initialization================================
// I can visit this server on http://localhost:3000
app.listen(PORT, () => console.log(`app is up on port http://localhost:${PORT}`)); // starts the server