const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')

app.use(bodyParser.json()) // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post('/', function(req, res) {
  console.log('im here', req)
  const { message } = req.body;

  let result =[];
  let parsedMessage;

  const random = (times, diceFaces) => {
    for (let i = 0; i < times; i++){
      result.push(Math.floor(Math.random() * diceFaces) + 1)
    }
    return result;
  }
  //check if is from a group msg
  if( message.text.substring(0,1) === '/'){
    parsedMessage = message.text.substring(1).toLowerCase().split('d');

  } else {
    parsedMessage = message.text.toLowerCase().split('d');
  }
  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  if (!message){
    res.end()
  }
    const times = Number(parsedMessage[0]);
    const dice = Number(parsedMessage[1]);
    random(times, dice)

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  axios
    .post(
      'https://api.telegram.org/bot1038391098:AAEVVAa3cLSasRUsyTuhwIgqvL5WWF1Lpkw/sendMessage',
      {
        chat_id: message.chat.id,
        text: 'holaa'
      }
    )
    .then(response => {
      // We get here if the message was successfully posted
      console.log('Message posted')
      res.end('ok')
    })
    .catch(err => {
      // ...and here if it was not
      console.log('Error :', err)
      res.end('Error :' + err)
    })
})

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!')
})