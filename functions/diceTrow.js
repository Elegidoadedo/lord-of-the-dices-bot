const diceTrow = (times, diceFaces) => {
  let dicesThrow =[];
  for (let i = 0; i < times; i++){
    dicesThrow.push(Math.floor(Math.random() * diceFaces) + 1)
  }
  return dicesThrow;
}

module.exports = diceTrow;