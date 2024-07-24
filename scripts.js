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

    // Hava durumu tahmin fonksiyonu
    function getWeatherForecast() {
        const apiKey = 'YOUR_API_KEY';  // Buraya kendi hava durumu API anahtarınızı ekleyin
        const city = 'Istanbul';  // Hava durumu tahminini almak istediğiniz şehir
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const forecast = `Temperature: ${data.main.temp}°C, ${data.weather[0].description}`;
                document.getElementById('forecast').textContent = forecast;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                document.getElementById('forecast').textContent = 'Unable to fetch weather data';
            });
    }

    getWeatherForecast();
});
