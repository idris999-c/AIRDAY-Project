document.addEventListener('DOMContentLoaded', function() {
    // Takvim ayarları
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        events: []
    });

    // Sidebar tıklama olayları
    document.querySelectorAll('.sidebar a').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });

            if (sectionId === 'weather') {
                loadWeatherContent();
            } else {
                document.getElementById(sectionId).classList.add('active');
            }
        });
    });

    // Varsayılan olarak Home bölümünü göster
    document.getElementById('home').classList.add('active');
});

function loadWeatherContent() {
    const weatherSection = document.getElementById('weather');
    weatherSection.innerHTML = `
        <div class="wrapper">
            <header>
                <i class="bx bx-left-arrow-alt"></i> Hava Durumu
            </header>
            <section class="input-part">
                <p class="info-txt"></p>
                <input type="text" placeholder="Şehir adı" spellcheck="false" required>
                <div class="seperator"></div>
                <button>Konumu Belirle</button>
            </section>
            <section class="weather-part">
                <img src="#" alt="Weather Icon">
                <div class="temp">
                    <span class="numb">_</span>
                    <span class="deg">°</span>C
                </div>
                <div class="weather">_ _</div>
                <div class="location">
                    <i class="bx bx-map"></i>
                    <span>_, _</span>
                </div>
                <div class="bottom-details">
                    <div class="column feels">
                        <i class="bx bxs-thermometer"></i>
                        <div class="details">
                            <div class="temp">
                                <span class="numb-2">_</span>
                                <span class="deg">°</span>C
                            </div>
                            <p>Feels like</p>
                        </div>
                    </div>
                    <div class="column humidity">
                        <i class="bx bxs-droplet-half"></i>
                        <div class="details">
                            <span>_</span>
                            <p>Humidity</p>
                        </div>
                    </div>
                    <div class="column wind">
                        <i class="bx bxs-wind"></i>
                        <div class="details">
                            <span>_</span>
                            <p>Wind Speed</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
    weatherSection.classList.add('active');

    // Button event listener
    document.querySelector('.input-part button').addEventListener('click', function() {
        const city = document.querySelector('.input-part input').value;
        if (city !== "") {
            requestWeatherData(city);
        }
    });

    // Enter key event listener
    document.querySelector('.input-part input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const city = this.value;
            if (city !== "") {
                requestWeatherData(city);
            }
        }
    });
}

function requestWeatherData(city) {
    const apiKey = 'bf0a32862a55d53fb23545df974dd3d2'; 
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(api)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(data);
            } else {
                document.querySelector('.info-txt').textContent = "City not found";
                document.querySelector('.info-txt').classList.add('error');
            }
        })
        .catch(() => {
            document.querySelector('.info-txt').textContent = "Something went wrong";
            document.querySelector('.info-txt').classList.add('error');
        });
}

function displayWeatherData(data) {
    const weatherPart = document.querySelector('.weather-part');
    const infoTxt = document.querySelector('.info-txt');
    
    const city = data.name;
    const country = data.sys.country;
    const { description, id } = data.weather[0];
    const { temp, feels_like, humidity } = data.main;
    const { speed } = data.wind;

    let icon = "";
    if (id === 800) icon = "icons/clear.svg";
    else if (id >= 200 && id <= 232) icon = "icons/storm.svg";
    else if (id >= 300 && id <= 321) icon = "icons/drizzle.svg";
    else if (id >= 500 && id <= 531) icon = "icons/rain.svg";
    else if (id >= 600 && id <= 622) icon = "icons/snow.svg";
    else if (id >= 701 && id <= 781) icon = "icons/atmosphere.svg";
    else if (id >= 801 && id <= 804) icon = "icons/cloud.svg";

    weatherPart.querySelector('img').src = icon;
    weatherPart.querySelector('.temp .numb').textContent = Math.floor(temp);
    weatherPart.querySelector('.weather').textContent = description;
    weatherPart.querySelector('.location span').textContent = `${city}, ${country}`;
    weatherPart.querySelector('.temp .numb-2').textContent = Math.floor(feels_like);
    weatherPart.querySelector('.humidity span').textContent = `${humidity}%`;
    weatherPart.querySelector('.wind span').textContent = `${speed} km/h`;

    infoTxt.classList.remove('pending', 'error');
    document.querySelector('.wrapper').classList.add('active');
    weatherPart.classList.add('active');
}
