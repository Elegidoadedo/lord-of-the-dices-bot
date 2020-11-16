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
  console.log('im here!!?')
  
  const { message } = req.body;
    if (!message){
     return res.end()
    }
  console.log('message ------> ', message)
  console.log('message text ------> ', message.text)
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
    if(message.text.substring(1,2).toLowerCase() === 'v'){
      //the comnad is for vampire dice throw
      const command = message.text.toLowerCase().split('v')[1];
      console.log('commaaaand ---->', command)
      const result = random(command.toNumber(), 10)
  console.log('result ------> ', result)

      const successDice = 0;
      const failDices = 0;
      result.forEach( dice => {
        if (dice === 1) failDices++;
        if ( dices >= 6) successDice++;
      })
      const finalResult = successDice - failDices;
      console.log('finalResult ------> ', finalResult)

      let message = '';

      if (finalResult <= 0){
        message = '😥¡ FALLO !😥'
      } else if(successDice === 0 && failDices > 0 ){
        message = '😱 ¡ PIFIA ! 😱'
      } else {
        message = `😄 ¡ ${finalResult} éxitos ! 😄`
      }

      return axios
      .post(
        'https://api.telegram.org/bot1038391098:AAEVVAa3cLSasRUsyTuhwIgqvL5WWF1Lpkw/sendMessage',
        {
          chat_id: message.chat.id,
          text:`
            Resultados de la tirada: ${result} \n
            Tirada normal: ${{message}} \n
            Tirada comabte (sin pifias) ${successDice} éxitos
          `
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
    }
  }
    return;
});

    // parsedMessage = message.text.substring(1).toLowerCase().split('d');
// } else {
//     parsedMessage = message.text.toLowerCase().split('d');
//   }
  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

  //   const times = Number(parsedMessage[0]);
  //   const dice = Number(parsedMessage[1]);
  //   random(times, dice)

  // // If we've gotten this far, it means that we have received a message containing the word "marco".
  // // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  // axios
  //   .post(
  //     'https://api.telegram.org/bot1038391098:AAEVVAa3cLSasRUsyTuhwIgqvL5WWF1Lpkw/sendMessage',
  //     {
  //       chat_id: message.chat.id,
  //       text: 'holaa'
  //     }
  //   )
  //   .then(response => {
  //     // We get here if the message was successfully posted
  //     console.log('Message posted')
  //     res.end('ok')
  //   })
  //   .catch(err => {
  //     // ...and here if it was not
  //     console.log('Error :', err)
  //     res.end('Error :' + err)
  //   })
// })

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!')
})