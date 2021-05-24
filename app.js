const TelegramBot = require('node-telegram-bot-api');

const token = '';

const bot = new TelegramBot(token, {polling: true});

let usersId = [];

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  usersId.push(chatId);
  bot.sendMessage(chatId, `Received your message from + ${chatId}`);
});

function sendWeather(weather){
    for (let i = 0, p = Promise.resolve(); i < usersId.length; i++) {
        p = p.then(_ => new Promise(resolve =>
            setTimeout(function () {
                bot.sendMessage(usersId[i], `${usersId[i]} you weather ${weather}`);
                resolve();
            }, 500)
        ));
    }
}


function handleAnswer(city){
    sendWeather(city);
}

let readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);

rl.question('what city you interesting?', function(answer){
    handleAnswer(answer);
})