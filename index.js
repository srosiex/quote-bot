const SlackBot = require('slackbots');
const axios = require('axios');
require('dotenv').config();

const bot = new SlackBot({
    token: process.env.SLACK_TOKEN,
    name: 'quotey-bot'
});

//Start Handler

bot.on('start', () => {
    const params = {
        icon_emoji: ':books:'
    }

    bot.postMessageToChannel('general', 'Here are some great quotes.', params)
});

//Error Handler
bot.on('error', (err)=> console.log(err));

//Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message'){
        return
    }
    handleMessage(data.text);
});


//Respond to data
function handleMessage(message) {
    if(message.includes(' randomquote')){
        getRandQuote();
    }else if(message.includes(' authorquote')){
        getAuthorQuote();
    }else if(message.includes(' help')){
        runHelp();
    }
};

//Insert the random quote
function getRandQuote() {
    axios.get('https://quote-garden.herokuapp.com/api/v2/quotes/random')
    .then(res => {
        const quote = res.data.quote.quoteText

        const params = {
            icon_emoji: ':pencil2:'
        };
    
        bot.postMessageToChannel('general', 
        `Random Quote: ${quote}`, params) 
    })
}

//Author quotes
function getAuthorQuote() {
    axios.get('https://api.quotable.io/random')
    .then(res => {
        const quote = res.data.content

        const params = {
            icon_emoji: ':pencil2:'
        };
    
        bot.postMessageToChannel('general', 
        `Author Quote: ${quote}`, params) 
    })
}

//Show help commands
function runHelp() {
    const params = {
        icon_emoji: ':question:'
    };

    bot.postMessageToChannel('general', 
    `Type @quote-bot with either 'randomquote' or 'authorquote' to get a quote.`, params) 
}