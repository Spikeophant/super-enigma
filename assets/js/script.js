//variables set here for various elements.
var searchBtn = document.getElementById('searchBtn');

//kelvin to f
function kelvinToF(k) {
    return 1.8 * (k - 273) + 32;
}

function currentWeatherCard(city) {
    // fetch data and use it to render main weather block.
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=782e3ca392c8347eb0ce69b8a8b4b36e')
        .then(function (response) {
            return response.json();
            if (!response.ok) {
                console.log(response.statusText);
            }
        }).then(function (data) {
        console.log(data);
        var cwRow = document.getElementById('weatherNow');
        var cwIcon = document.createElement('img');
        var curWea = document.createElement('p');
        var curTemp = document.createElement('p');
        var curWind = document.createElement('p');
        var curHumidity = document.createElement('p');
        cwRow.innerHTML = "";
        curTemp.textContent = 'Temp: ' + kelvinToF(data.main.temp).toPrecision(4) + 'F';
        curWind.textContent = 'Wind: ' + data.wind.speed;
        curHumidity.textContent = 'Humidity: ' + data.main.humidity;
        cwIcon.src = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        curWea.textContent = data.name + '   ' + Date(Date.now()).toString();
        curWea.append(cwIcon);
        cwRow.append(curWea);
        cwRow.append(curTemp);
        cwRow.append(curWind);

        cwRow.append(curHumidity);
    });
}

function fiveDayCard(city) {
    var 5dRow = document.getElementById('weather5d')
}

//hook search button
searchBtn.addEventListener('click', function () {
    var city = document.getElementById('cityState').value;
    currentWeatherCard(city);
});

