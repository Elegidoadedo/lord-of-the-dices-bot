// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = 'test';

// Require our Telegram helper package
const TelegramBot = require('node-telegram-bot-api');

module.exports = async (request, response) => {
    const random = (times, diceFaces) => {
        let dicesThrow =[];
        for (let i = 0; i < times; i++){
          dicesThrow.push(Math.floor(Math.random() * diceFaces) + 1)
        }
        return dicesThrow;
      }

    try {
        // Create our new bot handler with the token
        // that the Botfather gave us
        // Use an environment variable so we don't expose it in our code
        const bot = new TelegramBot(process.env.TELEGRAM_TKN);

        // Retrieve the POST request body that gets sent from Telegram
        const { body } = request;

        // Ensure that this is a message being sent
        if (body.message) {
            // Retrieve the ID for this chat
            // and the text that the user sent
            const { chat: { id }, text } = body.message;

            if( text && text.substring(0,1) === '/'){
                if(text && text.substring(1,2).toLowerCase() === 'v'){
                  //the comnad is for vampire dice throw
                  const command = text.toLowerCase().split('v')[1];
                  const result = random(command, 10)

                  let successDice = 0;
                  let failDices = 0;
                  result.forEach( dice => {
                    if (dice === 1) failDices++;
                    if ( dice >= 6) successDice++;
                  })
                  const finalResult = successDice - failDices;

                  let msg = '';

                  if (finalResult <= 0 && successDice >= 0){
                    msg = '😥¡ FALLO !😥'
                  } else if(successDice === 0 && failDices > 0 ){
                    msg = '😱 ¡ PIFIA ! 😱'
                  } else {
                    msg = `😄 ¡ ${finalResult} éxitos ! 😄`
                  }

                  const message = `
                  Resultados de la tirada: ${result.sort(function(a, b) {
                    return a - b;
                  })} \n Tirada normal:\n  ${msg} \n Tirada combate (sin pifias): \n  ${successDice} éxitos
                `
                // Send our new message back in Markdown and
                // wait for the request to finish
                await bot.sendMessage(id, message, {parse_mode: 'Markdown'});
            }}
        }
    }
    catch(error) {
        // If there was an error sending our message then we 
        // can log it into the Vercel console
        console.error('Error sending message');
        console.log(error.toString());
    }
    
    // Acknowledge the message with Telegram
    // by sending a 200 HTTP status code
    // The message here doesn't matter.
    response.send('OK');
};
