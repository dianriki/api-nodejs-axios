// API specific settings https://openweathermap.org/current
const axios = require('axios');
const express = require("express");
const app = express();

const port = 8080

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-origin", "*")
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})


app.get("/test/:q", (req, res) => {
    let KEY = req.params.q
    let LOC = ''

    if (KEY.toLowerCase().match(/jakarta.*/)) {
        LOC = 'jakarta';
    } else if (KEY.toLowerCase().match(/bandung.*/)) {
        LOC = 'bandung';
    } else if (Date.parse(KEY)) {

        let convDate = Date.parse(KEY);
        const d = (new Date(convDate)).toISOString().split('T')[0];

        console.log(d)
        const options = {
            method: 'GET',
            url: 'https://covid-19-statistics.p.rapidapi.com/reports',
            params: { date: d, q: 'Indonesia' },
            headers: {
                'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
                'x-rapidapi-key': 'd2c0aaf7d6msh2ee52cea231b539p11f434jsnc3a591b0efa0'
            }
        };

        axios.request(options).then(function (response) {
            const active = response.data.data[0].active;
            const deaths = response.data.data[0].deaths;
            const recovered = response.data.data[0].recovered;
            const country = response.data.data[0].region.name;

            const covidStats = `COVID-19 UPDATE IN ${country.toUpperCase()} : Active: ${active}, Deaths: ${deaths}, Recovered: ${recovered}`

            // console.log(covidStats);

            res.status(200).json({
                success: true,
                result: covidStats,
                rawData: response.data,
            })

        })
            .catch(error => console.log("Error", error));
    } else {
        res.status(404).json({
            status: 404,
            alert: `Data not found!, type ex. (Wheater in Jakarta, Wheater in Bandung) OR JUST input full date ex.('2021-10-01', '05-07-2020', 'March 21, 2020')for update statistic of covid-19 in Indonesia`,
        })
    }

    if (LOC != '') {
        axios({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${LOC}&appid=be70ba0a75492bc84e03a36114a9346d`,
        })
            .then(response => {
                // Assign vars to response data
                const temperatureK = response.data.main.temp;
                const humidity = response.data.main.humidity;
                const windSpeedK = response.data.wind.speed;
                const windDeg = response.data.wind.deg;
                const cityName = response.data.name;
                const countryName = response.data.sys.country;

                // Handle Temperature conversions from Kelvins
                const temperatureF = (temperatureK * 9) / 5 - 459.67;
                const temperatureC = temperatureK - 273.15;

                // Handle wind Speed and Direction conversions from m/s
                const windSpeedMPH = windSpeedK * 2.2369363;
                const windSpeedKPH = windSpeedK * 3.6;
                const windSpeedKNS = windSpeedK * 1.9438445;
                const windDirection = degreesToCardinalDirection(windDeg);

                function degreesToCardinalDirection(d) {
                    // keep within the range: 0 <= d < 360
                    d = d % 360;

                    if (11.25 <= d && d < 33.75) {
                        return "NNE";
                    } else if (33.75 <= d && d < 56.25) {
                        return "NE";
                    } else if (56.25 <= d && d < 78.75) {
                        return "ENE";
                    } else if (78.75 <= d && d < 101.25) {
                        return "E";
                    } else if (101.25 <= d && d < 123.75) {
                        return "ESE";
                    } else if (123.75 <= d && d < 146.25) {
                        return "SE";
                    } else if (146.25 <= d && d < 168.75) {
                        return "SSE";
                    } else if (168.75 <= d && d < 191.25) {
                        return "S";
                    } else if (191.25 <= d && d < 213.75) {
                        return "SSW";
                    } else if (213.75 <= d && d < 236.25) {
                        return "SW";
                    } else if (236.25 <= d && d < 258.75) {
                        return "WSW";
                    } else if (258.75 <= d && d < 281.25) {
                        return "W";
                    } else if (281.25 <= d && d < 303.75) {
                        return "WNW";
                    } else if (303.75 <= d && d < 326.25) {
                        return "NW";
                    } else if (326.25 <= d && d < 348.75) {
                        return "NNW";
                    } else {
                        return "N";
                    }
                }

                // Construct the human readable response
                const weatherDisplay = `Right now, in \
                    ${cityName}, the current temperature is \
                    ${temperatureF.toFixed(1)}ºF \
                    (${temperatureC.toFixed(1)}ºC), with ${humidity}% humidity, \
                    wind ${windSpeedMPH.toFixed(1)}mph (${windSpeedKPH.toFixed(1)}kph / \
                    ${windSpeedKNS.toFixed(1)}kn) from the ${windDirection}. \
                    Conditions: ${response.data.weather[0].description} `.replace(/\s+/g, " ");

                // console.log(weatherDisplay)

                res.status(200).json({
                    success: true,
                    result: weatherDisplay,
                    rawData: response.data
                })
            })
            .catch(error => console.log("Error", error));
    }
})

app.listen(port, () => console.log("Listening on port 8080"));

// const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
// const API_KEY = 'be70ba0a75492bc84e03a36114a9346d';
// const KEY = '2021-01-20';
// let LOC = '';
// let APIs = '';

// if (KEY.toLowerCase().match(/jakarta.*/)) {
//     LOC = 'jakarta';
//     APIs = `${API_URL}?q=${LOC}&appid=${API_KEY}`;
// } else if (KEY.toLowerCase().match(/bandung.*/)) {
//     LOC = 'bandung';
//     APIs = `${API_URL}?q=${LOC}&appid=${API_KEY}`;
// } else if (Date.parse(KEY)) {
//     const options = {
//         method: 'GET',
//         url: 'https://covid-19-statistics.p.rapidapi.com/reports',
//         params: { date: KEY, q: 'Indonesia' },
//         headers: {
//             'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
//             'x-rapidapi-key': 'd2c0aaf7d6msh2ee52cea231b539p11f434jsnc3a591b0efa0'
//         }
//     };

//     axios.request(options).then(function (response) {
//         const active = response.data.data[0].active;
//         const deaths = response.data.data[0].deaths;
//         const recovered = response.data.data[0].recovered;

//         const covidStats = `Aktiv: ${active}, Jumlah kematian: ${deaths}, Jumlah yang sembuh: ${recovered}`
//         console.log(covidStats);
//     }).catch(function (error) {
//         console.error(error);
//     });
// } else {
//     console.log('Error..');
// }
// // const url = require('url');

// if (LOC != '') {
//     axios
//         .get(APIs)
//         .then(response => {
//             // Assign vars to response data
//             const temperatureK = response.data.main.temp;
//             const humidity = response.data.main.humidity;
//             const windSpeedK = response.data.wind.speed;
//             const windDeg = response.data.wind.deg;
//             const cityName = response.data.name;
//             const countryName = response.data.sys.country;

//             // Handle Temperature conversions from Kelvins
//             const temperatureF = (temperatureK * 9) / 5 - 459.67;
//             const temperatureC = temperatureK - 273.15;

//             // Handle wind Speed and Direction conversions from m/s
//             const windSpeedMPH = windSpeedK * 2.2369363;
//             const windSpeedKPH = windSpeedK * 3.6;
//             const windSpeedKNS = windSpeedK * 1.9438445;
//             const windDirection = degreesToCardinalDirection(windDeg);

//             function degreesToCardinalDirection(d) {
//                 // keep within the range: 0 <= d < 360
//                 d = d % 360;

//                 if (11.25 <= d && d < 33.75) {
//                     return "NNE";
//                 } else if (33.75 <= d && d < 56.25) {
//                     return "NE";
//                 } else if (56.25 <= d && d < 78.75) {
//                     return "ENE";
//                 } else if (78.75 <= d && d < 101.25) {
//                     return "E";
//                 } else if (101.25 <= d && d < 123.75) {
//                     return "ESE";
//                 } else if (123.75 <= d && d < 146.25) {
//                     return "SE";
//                 } else if (146.25 <= d && d < 168.75) {
//                     return "SSE";
//                 } else if (168.75 <= d && d < 191.25) {
//                     return "S";
//                 } else if (191.25 <= d && d < 213.75) {
//                     return "SSW";
//                 } else if (213.75 <= d && d < 236.25) {
//                     return "SW";
//                 } else if (236.25 <= d && d < 258.75) {
//                     return "WSW";
//                 } else if (258.75 <= d && d < 281.25) {
//                     return "W";
//                 } else if (281.25 <= d && d < 303.75) {
//                     return "WNW";
//                 } else if (303.75 <= d && d < 326.25) {
//                     return "NW";
//                 } else if (326.25 <= d && d < 348.75) {
//                     return "NNW";
//                 } else {
//                     return "N";
//                 }
//             }

//             // Construct the human readable response
//             const weatherDisplay = `Right now, in \
//         ${cityName}, the current temperature is \
//         ${temperatureF.toFixed(1)}ºF \
//         (${temperatureC.toFixed(1)}ºC), with ${humidity}% humidity, \
//         wind ${windSpeedMPH.toFixed(1)}mph (${windSpeedKPH.toFixed(1)}kph / \
//         ${windSpeedKNS.toFixed(1)}kn) from the ${windDirection}. \
//         Conditions: ${response.data.weather[0].description} `.replace(/\s+/g, " ");

//             console.log(weatherDisplay)
//         })
//         .catch(error => console.log("Error", error));
// }
