//variables set here for various elements.
var searchBtn = document.getElementById('searchBtn');
var searchColumn = document.getElementById('search');
//setup local stored object if it doesn't exist.
var cities = {};

if (localStorage.getItem('cities')) {
    cities = JSON.parse(localStorage.getItem('cities'));
    currentWeatherCard(Object.keys(cities)[0]);
    fiveDayCard(Object.keys(cities)[0]);
}

//kelvin to f
function kelvinToF(k) {
    return 1.8 * (k - 273) + 32;
}

console.log(cities);

//fetch now and render.
function currentWeatherCard(city) {
    // fetch data and use it to render main weather block.
    try {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=782e3ca392c8347eb0ce69b8a8b4b36e')
        .then(function (response) {

            if (!response.ok) {
                console.log(response.statusText);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(function (data) {
        console.log(data);
        var cwRow = document.getElementById('weatherNow');
        var cwIcon = document.createElement('img');
        var curWeaHeader = document.createElement('h4');
        var curWea = document.createElement('p');
        var curTemp = document.createElement('p');
        var curWind = document.createElement('p');
        var curHumidity = document.createElement('p');
        cwRow.innerHTML = '';
        curTemp.textContent = 'Temp: ' + kelvinToF(data.main.temp).toPrecision(4) + 'F';
        curWind.textContent = 'Wind: ' + data.wind.speed;
        curHumidity.textContent = 'Humidity: ' + data.main.humidity;
        cwIcon.src = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        curWea.textContent = Date(Date.now()).toString();
        curWeaHeader.textContent = data.name;
        curWeaHeader.append(cwIcon);
        cwRow.append(curWeaHeader);
        cwRow.append(curWea);
        cwRow.append(curTemp);
        cwRow.append(curWind);

        cwRow.append(curHumidity);
    });} catch (e) {
        throw new Error('Failed to load or populate city.');
    }
}

//fetch 5d and render.
function fiveDayCard(city) {
    var dRow = document.getElementById('weather5d');
    dRow.innerHTML = '';
    //do the fetch here so we can loop through the results and create the cards.
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=782e3ca392c8347eb0ce69b8a8b4b36e')
        .then(function (response) {
            if (!response.ok) {
                console.log(response.statusText);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(function (data) {

        console.log(data);
        for (var w = 0; w < data.list.length; w++) {
            if (data.list[w].dt_txt.includes('15:00:00')) {
                var cwCard = document.createElement('div');
                cwCard.classList.add('card');
                cwCard.setAttribute('style', 'width: 10rem;');
                //cwCard
                var cwCardBody = document.createElement('div');
                cwCardBody.classList.add('card-body');
                var cwCardBodyH5 = document.createElement('h5');
                cwCardBodyH5.classList.add('card-title');
                cwCardBodyH5.textContent = data.list[w].dt_txt.split(' ')[0];
                cwCardBody.append(cwCardBodyH5);
                var cwCardIcon = document.createElement('img');
                cwCardIcon.src = 'https://openweathermap.org/img/w/' + data.list[w].weather[0].icon + '.png';
                var cwCardTemp = document.createElement('p');
                cwCardTemp.textContent = 'Temp: ' + kelvinToF(data.list[w].main.temp).toPrecision(4);
                var cwCardWind = document.createElement('p');
                cwCardWind.textContent = 'Wind: ' + data.list[w].wind.speed;
                var cwCardHumid = document.createElement('p');
                cwCardHumid.textContent = 'Humidty: ' + data.list[w].main.humidity;

                cwCardBody.append(cwCardIcon);
                cwCardBody.append(cwCardTemp);
                cwCardBody.append(cwCardWind);
                cwCardBody.append(cwCardHumid);
                cwCard.append(cwCardBody);
                dRow.append(cwCard);
            }
        }
    });
}

function buildHistory(cities) {
    var x = 0;
    for (var city in cities) {
        if (x > 9) {
            return;
        }
        var cityBtn = document.createElement('button');
        cityBtn.classList.add('btn', 'btn-secondary', 'btn-large', 'btn-block');
        cityBtn.id = city;
        if (document.getElementById(city) !== null) {
            console.log(document.getElementById(city));
            console.log('I didn\'t add this city because I didn\'t wanna');
            continue;
        } else {
            cityBtn.innerHTML = city;
            searchColumn.append(cityBtn);
            cityBtn.addEventListener('click', function (event) {

                currentWeatherCard(event.target.getAttribute('id'));
                fiveDayCard(event.target.getAttribute('id'));
            });
        }
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
    try {
        currentWeatherCard(city);
        fiveDayCard(city);
    } catch (e) {
        alert(e);
        return;
    }
    if (!cities[city.split(',')[0]]) {
        cities[city.split(',')[0]] = city.split(',')[1];
    }
    localStorage.setItem('cities', JSON.stringify(cities));
    console.log(cities);
    buildHistory(cities);
});

