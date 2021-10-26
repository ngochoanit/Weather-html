const searchInput = document.querySelector('#search-input')
const cityName = document.querySelector('.city-name')
const weatherState = document.querySelector('.weather-state')
const weatherIcon = document.querySelector('.weather-icon')
const temperature = document.querySelector('.temperature')
const sunrise = document.querySelector('.sunrise')
const sunset = document.querySelector('.sunset')
const humidity = document.querySelector('.humidity')
const windSpeed = document.querySelector('.wind-speed')
const microphone = document.querySelector('.microphone')

const APP_WEATHER_ID = '296f8c5729ff9fa23838c6079dae1641'
const DEFAULT_VALUE = '--'
const APP_LOCATION_ID = '8bd1ab6809ea415fa282b30662849ada'

const regionNamesInEnglish = new Intl.DisplayNames(['vi'], { type: 'region' });

searchInput.addEventListener('change', (e) => {
    const city = removeVietnameseTones(e.target.value)
    getWeatherAPI(city)
})
function getWeatherAPI(address, location = '') {
    if (address) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${APP_WEATHER_ID}&units=metric&lang=vi`)
            .then(async (res) => {
                if (res && res.status === 200) {
                    const data = await res.json();
                    render(data, location);
                }
            })
    }
}
function render(data, location) {

    cityName.innerHTML = `${location ? (location + ' - ' + data.name) : (data.name + ' - ' + regionNamesInEnglish.of(data.sys.country))} ` || DEFAULT_VALUE
    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE
    weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE
    sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE
    sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE
    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE
    windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE
}
function getWeatherByIP() {
    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${APP_LOCATION_ID}`).then(async (res) => {
        if (res && res.status === 200) {
            const data = await res.json();
            const City = await data.country_capital
            const location = await data.district
            await getWeatherAPI(City, location)
        }
    })
}
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}

// virtual assistant.
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition

const recognition = new SpeechRecognition();

recognition.lang = 'vi-VI';
recognition.continuous = false;
microphone.addEventListener('click', (e) => {
    e.preventDefault();
    recognition.start()
    microphone.classList.add('recording')
})
recognition.onspeechend = () => {
    recognition.stop()
    microphone.classList.remove('recording')
}
recognition.onerror = (event) => {
    recognition.stop()
    console.log('Speech recognition error detected: ' + event.error);
}
recognition.onresult = (e) => {
    const text = e.results[0][0].transcript

    handleVoice(text)
}
const handleVoice = (text) => {
    // "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
    const handledText = text.toLowerCase();
    if (handledText.includes('thời tiết tại')) {
        const location = handledText.split('tại')[1].trim();

        console.log('location', location);
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;
    }

    const container = document.querySelector('.container');
    if (handledText.includes('thay đổi màu nền')) {
        const color = handledText.split('màu nền')[1].trim();
        container.style.background = color;
        return;
    }

    if (handledText.includes('màu nền mặc định')) {
        container.style.background = '';
        return;
    }

}

getWeatherByIP()