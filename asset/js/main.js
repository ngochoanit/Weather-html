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
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
    str = str.replace(/??|??|???|???|??/g, "I");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
    str = str.replace(/???|??|???|???|???/g, "Y");
    str = str.replace(/??/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
    // Remove extra spaces
    // B??? c??c kho???ng tr???ng li???n nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // B??? d???u c??u, k?? t??? ?????c bi???t
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
    microphone.classList.remove('recording')
    console.log('Speech recognition error detected: ' + event.error);
}
recognition.onresult = (e) => {
    const text = e.results[0][0].transcript

    handleVoice(text)
}
const handleVoice = (text) => {
    // "th???i ti???t t???i ???? N???ng" => ["th???i ti???t t???i", "???? N???ng"]
    const handledText = text.toLowerCase();
    if (handledText.includes('th???i ti???t t???i')) {
        const location = handledText.split('t???i')[1].trim();

        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;
    } if (handledText.includes('th???i ti???t hi???n t???i')) {
        getWeatherByIP()
        return;
    }

    const container = document.querySelector('.container');
    if (handledText.includes('thay ?????i m??u n???n')) {
        const color = handledText.split('m??u n???n')[1].trim();
        container.style.background = color;
        return;
    }

    if (handledText.includes('m??u n???n m???c ?????nh')) {
        container.style.background = '';
        return;
    }

}

getWeatherByIP()