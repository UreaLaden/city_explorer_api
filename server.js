
//============================Packages================================

require('dotenv').config(); // read the '.env' files's saved env variables AFTER reading the real env's variables
const express = require('express');
const cors = require('cors'); //lets our computer talk to itself
const superagent = require('superagent');
const pg = require('pg');

// If this line of code comes, delete it const { response } = require('express');

//============================Apps================================
const app = express(); // express() will return a fully ready to run server object
app.use(cors()); // enables local processes to talk  to the server // Cross Origin Resource Sharing

const PORT = process.env.PORT || 3009; //If there is a port use it otherwise use 3009
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error',error => console.log(error));

//============================Routes================================
const students = [{name:'leaundrae',favBook: 'the unspoken name', class:301}];

app.get('/',(req,res)=>
{
    client.query('SELECT * FROM locations;')
    .then(pgStuff => 
    {
        res.send(pgStuff.rows);
    })
})

//#region Location
const locationKey = process.env.GEOCODE_API_KEY;
app.get('/location',(req,res) =>
{
    CheckDBForLocationInfo(req)
    .then(row => {
        if(row.rows.length === 0){
            IfNotInDBRedirect(req)
            .then(result =>{
                StoreInfoInDB(result, req);
                SendStoredInfoFromDB(result,req,res);
            })
        }
        else{
            res.status(200).send(row.rows[0]);
        }
    })
    .catch(error => res.status(500).send("Internal Error: Location's not here chief" + error));
})

//#region Location Functions
function SendStoredInfoFromDB(results,req,res){
    let obj = results.body[0];
    let newLocationFromDB = new Location(obj,req.query.city);
    res.send(newLocationFromDB);
}

function StoreInfoInDB(results,req){
    const sqlString = 'INSERT INTO locations (search_query,formatted_query,longitude,latitude) VALUES($1,$2,$3,$4);'
    const sqlArray = [req.query.city, results.body[0].display_name, results.body[0].lon, results.body[0].lat];
    client.query(sqlString,sqlArray)
    .then((data)=>console.log(data, "was stored in location table"));
}

function IfNotInDBRedirect(req){
    const url = `https://us1.locationiq.com/v1/search.php?key=${locationKey}&q=${req.query.city}&format=json`;
    return superagent.get(url);
}

function CheckDBForLocationInfo(req){
    const sqlCheckingString = 'SELECT * FROM locations WHERE search_query=$1;'
    const sqlCheckingArray = [req.query.city];
    return client.query(sqlCheckingString,sqlCheckingArray);
}

function Location(data,cityName)
{
    this.search_query = cityName;
    this.formatted_query = data.display_name;
    this.latitude = data.lat;
    this.longitude = data.lon;
}
//#endregion


//#endregion

//#region Weather 
weatherKey = process.env.WEATHER_API_KEY;
app.get('/weather',(request,response) => {
    
    //CheckForWeatherInfo
    CheckForWeatherInfo(request)
    .then(row => {
        if(row.rowCount <= 0){
            console.log("No weather trying to cache");
            IfNoWeatherInfoInDB(request)
            .then(results => {
                StoreWeatherInfoInDB(results);
                SendStoredWeatherInfo(response,results);
            })
        }else{
            console.log("Weatherman's on Deck!");
            response.status(200).json(row.rows[0]);
        }
    })
    .catch( error =>  response.status(500).send("Internal Error: Forecast doesn't look good..."+ error) );
});

function SendStoredWeatherInfo(response,res){
    let newForecastFromDB = new WeatherForcast(res.body);
    response.send(newForecastFromDB);
}

function StoreWeatherInfoInDB(res){

    const sqlStringOne = 'INSERT INTO weather (forecast,time,city) VALUES($1,$2,$3);'
    let promiseArr = [];
    for(let i=0;i<res.body.data.length;i++){
        const sqlArrayOne = [res.body.data[i].weather.description, res.body.data[i].datetime, res.body.display_name];
        let query = client.query(sqlStringOne,sqlArrayOne);
        promiseArr.push(query);
    }
    Promise.all(promiseArr)
    .then( () => console.log("Stored Weather Data" ))
    .catch(error => console.log(error));
}

function IfNoWeatherInfoInDB(request){
    const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.latitude}&lon=${request.query.longitude}&key=${weatherKey}&days=8`;
    return superagent.get(weatherURL)
}

function CheckForWeatherInfo(request){
    const sqlStringCheckOne = 'SELECT * FROM weather WHERE city=$1;'
    const sqlArrayCheckOne = [request.query.search_query];    
    return client.query(sqlStringCheckOne,sqlArrayCheckOne);
}

function WeatherForcast(weatherData){  
    return weatherData.data.map(value =>
    {
         return new Forecast(
             value.weather.description,
             value.datetime,
             value.display_name );
            })        
}

function Forecast(forecast,time,city)
{
    this.forecast = forecast;
    this.time = time;
    this.city = city;
}
//#endregion


//#region Park

const parkKey = process.env.PARKS_API_KEY;
app.get('/parks',(request,response)=>{  
    const parkURL = `https://developer.nps.gov/api/v1/parks?q=${request.query.search_query}&api_key=${parkKey}`;
    superagent.get(parkURL)
    .then((res) => {
        let newParkList = new GetParkList(res.body.data)
        response.send(newParkList);
    })
    .catch(error =>{
        response.status(500).send("Internal Error from the internal...",error);
    })
});

function GetParkList(parkData)
{
    return parkData.map(data =>
    {
        return new Park(data.fullName,
            data.addresses[0].line1,
            data.entranceFees[0].cost,
            data.description,
            data.url);
    })
}

function Park(name,address,fee,description,url)
{
    this.name = name;
    this.address = address;
    this.fee = fee;
    this.description = description;
    this.url = url;
}
//#endregion


//#region Yelp
const yelpKey = process.env.YELP_API_KEY;

app.get('/yelp',(request,response)=>{

    let city = request.query.search_query;
    const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${city}`
    superagent.get(yelpUrl)
    .set('authorization',`Bearer ${yelpKey}`)
    .then(res =>{
        let newBusinessList = new GetBusinessList(res.body.businesses);
        response.status(200).json(newBusinessList);
    })
    .catch(error => console.log("Something went wrong", error));
})

function GetBusinessList(businessData){
    return businessData.map(business =>{
        return new Business(
            business.name,
            business.image_url,
            business.price,
            business.rating,
            business.url);
    })
}

function Business(name,image_url,price,rating,url){
    this.name = name;
    this.image_url = image_url;
    this.price = price;
    this.rating = rating;
    this.url = url;
}

//#endregion

//============================Initialization================================
// I can visit this server on http://localhost:3009
client.connect().then(()=>{
    app.listen(PORT, () => console.log(`app is up on port http://localhost:${PORT}`))
}).catch(error =>{
        console.log(error);
    })