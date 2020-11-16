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
  const { message } = req.body;

  const random = (times, diceFaces) => {
    let dicesThrow =[];
    for (let i = 0; i < times; i++){
      dicesThrow.push(Math.floor(Math.random() * diceFaces) + 1)
    }
    return dicesThrow;
  }
  //check if is from a group msg

  if( message.text.substring(0,1) === '/'){
    if(message.text.substring(1,2).toLowerCase() === 'v'){
      //the comnad is for vampire dice throw
      const command = message.text.toLowerCase().split('v')[1];
      const result = random(command, 10)

      let successDice = 0;
      let failDices = 0;
      result.forEach( dice => {
        if (dice === 1) failDices++;
        if ( dice >= 6) successDice++;
      })
      const finalResult = successDice - failDices;

      let msg = '';

      if (finalResult <= 0){
        msg = '😥¡ FALLO !😥'
      } else if(successDice === 0 && failDices > 0 ){
        msg = '😱 ¡ PIFIA ! 😱'
      } else {
        msg = `😄 ¡ ${finalResult} éxitos ! 😄`
      }

      return axios
      .post(
        'https://api.telegram.org/bot1038391098:AAEVVAa3cLSasRUsyTuhwIgqvL5WWF1Lpkw/sendMessage',
        {
          chat_id: message.chat.id,
          text:`
            Resultados de la tirada: ${result.sort(function(a, b) {
              return a - b;
            })} \n
            Tirada normal: ${msg} \n
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
    } else if( message.text.indexOf("d") > 0  ){
      const parsedMessage = message.text.substring(1).toLowerCase().split('d');
      const result = random(parsedMessage[0], parsedMessage[1])
      return axios
      .post(
        'https://api.telegram.org/bot1038391098:AAEVVAa3cLSasRUsyTuhwIgqvL5WWF1Lpkw/sendMessage',
        {
          chat_id: message.chat.id,
          text: result,
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
    } else {
      return axios
        .post(
          'https://api.telegram.org/bot1038391098:AAEVVAa3cLSasRUsyTuhwIgqvL5WWF1Lpkw/sendMessage',
          {
            chat_id: message.chat.id,
            text:'No se ha encontrado el comando'
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
});

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!')
})