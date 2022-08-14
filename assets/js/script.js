//variables set here for various elements.
var searchBtn = document.getElementById('searchBtn');
var searchColumn = document.getElementById('search');
//setup local stored object if it doesn't exist.
var cities = {};

if (!localStorage.getItem('cities') === false) {
    cities = JSON.parse(localStorage.getItem('cities'));
    currentWeatherCard(Object.keys(cities)[0]);
}

//kelvin to f
function kelvinToF(k) {
    return 1.8 * (k - 273) + 32;
}
console.log(cities);

//fetch now and render.
function currentWeatherCard(city) {
    // fetch data and use it to render main weather block.
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=782e3ca392c8347eb0ce69b8a8b4b36e')
        .then(function (response) {

            if (!response.ok) {
                console.log(response.statusText);
                alert(response.statusText);
                throw new Error(response.statusText);

            }
            return response.json();
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

//fetch 5d and render.
function fiveDayCard(city) {
    var dRow = document.getElementById('weather5d');
    //do the fetch here so we can loop through the results and create the cards.
    fetch('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=782e3ca392c8347eb0ce69b8a8b4b36e')
        .then(function (response) {
            if (!response.ok) {
                console.log(response.statusText);
            }
            return response.json();
        }).then(function(data) {
            var cwCard = document.createElement('div');
            cwCard.classList.add('card');
            console.log(data);
            for (var w = 0; w < 5; w++) {

            }
    });
}

function buildHistory (cities) {
    var x = 0;
    for (var city in cities) {
        if (x > 4) {
            return;
        }
        var cityBtn = document.createElement('button');
        cityBtn.classList.add('btn', 'btn-secondary');
        cityBtn.id = city;
        if (document.getElementById(city) !== null) {
            console.log(document.getElementById(city));
            console.log("I didn't add this city because I didn't wanna");
            continue;
        } else {
        cityBtn.innerHTML = city;
        searchColumn.append(cityBtn);
        cityBtn.addEventListener('click', function(event) {

            currentWeatherCard(event.target.getAttribute('id'));
        }); }
        x++;
    }

}
buildHistory(cities);

//hook search button
searchBtn.addEventListener('click', function () {
    var city = document.getElementById('cityState').value;
    if (city === '') {
        city = 'Eugene, Oregon';
    }
    if (!cities[city.split(',')[0]]) {
        cities[city.split(',')[0]] = city.split(',')[1];
    }
    currentWeatherCard(city);
    fiveDayCard(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    console.log(cities);
    buildHistory(cities);
});

