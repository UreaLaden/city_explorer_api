
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
const dataFromTheFile = require('./location.json'); //in an express server, we can synchronously get data from a local json file without a .then

//this route can be visited  http://localhost:3009/puppy
app.get('/location',getLocationData); // this is a route that lives at /puppy and sends a ginger object
function getLocationData(request,response){
    console.log(dataFromTheFile);
    let locOne = new Location(dataFromTheFile,request.query);
    response.send(locOne);
}



//app.get('/location',handleGetLocation(res,req));
   
 
/*
Lab requirement approximation: Create a route name '/location' that sends location data to the client. An example of how the data should look liks is this
[
    {
      "place_id": "222943963",
      "licence": "https://locationiq.com/attribution",
      "osm_type": "relation",
      "osm_id": "237662",
      "boundingbox": [
        "47.802219",
        "47.853569",
        "-122.34211",
        "-122.261618"
      ],
      "lat": "47.8278656",
      "lon": "-122.3053932",
      "display_name": "Lynnwood, Snohomish County, Washington, USA",
      "class": "place",
      "type": "city",
      "importance": 0.61729106268039,
      "icon": "https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png"
    }
*/
    //const output = new Location(dataFromTheFile, req.query);
    //console.log(req.query);
    const output = {
        search_query:'',
        formatted_query:dataFromTheFile[0].display_name,
        latitude:dataFromTheFile[0].lat,
        longitude: dataFromTheFile[0].lon
}
//res.send(output);

function Location(dataFromTheFile,cityName){
    this.search_query = cityName;
    this.formatted_query = dataFromTheFile[0].display_name;
    this.latitude = dataFromTheFile[0].lat;
    this.longitude = dataFromTheFile[0].lon;
}

//============================Initialization================================
// I can visit this server on http://localhose:3009
app.listen(PORT, () => console.log(`app is up on port http://localhose:${PORT}`)); // starts the server