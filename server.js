
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
const superagent = require('superagent');
// If this line of code comes, delete it const { response } = require('express');

//TODO: load dotenv
require('dotenv').config(); // read the '.env' files's saved env variables AFTER reading the real env's variables


//============================Apps================================
const app = express(); // express() will return a fully ready to run server object
app.use(cors()); // enables local processes to talk  to the server // Cross Origin Resource Sharing

const PORT = process.env.PORT || 3009; //If there is a port use it otherwise use 3009
//============================Routes================================
//const locationData = require('./location.json'); //in an express server, we can synchronously get data from a local json file without a .then
const weatherData = require('./weather.json');

locationKey = process.env.GEOCODE_API_KEY;
//this route can be visited  http://localhost:3009/puppy

//#region Location

app.get('/location',getLocationData); // this is a route that lives at /puppy and sends a ginger object
function getLocationData(request,response){
    
    const url = `https://us1.locationiq.com/v1/search.php?key=${locationKey}&q=${request.query.city}&format=json`;
    superagent.get(url)
    .then((res)=>{
        let location = new Location(res,request.query);
        response.send(location);
    })
    .catch(error => {
        response(500).send("Something went wrong");
    });
}

function Location(data,cityName){
    this.search_query = Object.entries(cityName)[0][1];
    this.formatted_query = data.body[0].display_name;
    this.latitude = data.body[0].lat;
    this.longitude = data.body[0].lon
}

//#endregion

//#region Weather 
weatherKey = process.env.WEATHER_API_KEY;
app.get('/weather',getWeatherData);
function getWeatherData(request,response){
    const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.latitude}&lon=${request.query.longitude}&key=${weatherKey}&days=8`;
    superagent.get(weatherURL)
    .then((res) =>{
        let forecast = new WeatherForcast(res.body);
        response.send(forecast);
    })
    .catch( error => {
        response(500).send("Something went wrong");
    })
}

function WeatherForcast(weatherData){
    
    return weatherData.data.map(value =>{
         return new Forecast(
             value.weather.description,
             value.datetime,
             weatherData.city_name);        
    })        
}

function Forecast(forecast,time,city){
    this.forecast = forecast;
    this.time = time;
    this.city = city;
}
//#endregion

//============================Initialization================================
// I can visit this server on http://localhost:3009
app.listen(PORT, () => console.log(`app is up on port http://localhost:${PORT}`)); // starts the server