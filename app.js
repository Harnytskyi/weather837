const TelegramBot = require('node-telegram-bot-api');
const readline = require('readline');
const request = require('request');

let rl = readline.createInterface(process.stdin, process.stdout);
const token = '';
const apiKey = '';

const bot = new TelegramBot(token, {polling: true});

let usersId = [];
let lastMessage = {
}

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if(usersId.indexOf(chatId) == -1)
        usersId.push(chatId);
    lastMessage[chatId] = {fist_name: msg.from.first_name, text: msg.text}
});

function sendWeather(weather){
    for (let i = 0, p = Promise.resolve(); i < usersId.length; i++) {
        p = p.then(_ => new Promise(resolve =>
            setTimeout(function () {
                bot.sendMessage(usersId[i], `Weather in ${weather}`);
                resolve();
            }, 500)
        ));
    }
}

function handleAnswer(city){
    request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`, function(error, response, body){
        const data = JSON.parse(body);
        let weather = `${data.name}: ${Math.round(data.main.temp-273)}°C ${data.weather[0].main}`;
        sendWeather(weather);
        for(let id in lastMessage){
            console.log(lastMessage[id].fist_name + ": " + lastMessage[id].text);
        }
    })
}

rl.question('what city you interesting? ', function(answer){
    handleAnswer(answer);
})
