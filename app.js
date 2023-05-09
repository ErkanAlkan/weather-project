const express = require ("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const https = require("https");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
    const query = req.body.cityName;
    const appKey = "c600cd74b89ca2bf564dae8d62c0ee12";
    const units = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?appid="+ appKey +"&units="+ units +"&q="+ query +""
    
    https.get(url, function(response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            response.on("data", function(data){
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon
                const weatherConditionUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
                res.write("<p>The weather is currently " + weatherDescription + "</p>");
                res.write("<h2>The temperature in " + query + " is " + temp + " degrees Celcius</h2>");
                res.write("<img src=" + weatherConditionUrl + ">");
                res.send();
                });
        } else if (response.statusCode == 404) {
            res.send("Please check the spelling of       '   " + query + "     '");
        } else {
            res.send("Check the code");
        }
        
    })

});

app.listen (port,function() {
    console.log("Server is running on port " + port)

});