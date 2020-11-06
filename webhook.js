const colors = require('colors')

require('dotenv').config()

const getNovasOcorencias   = require('./controllers/getNovasOcorencias')
const checkNovasOcorencias = require('./controllers/checkNovasOcorencias')

const titulo = '[BOT Ocorrências:]'.yellow.bgBlue.bold
console.log(titulo)

let inseridos = 0
let err_prep = 0

function displayDados() {
    process.stdout.write(`\rGeradas: ${inseridos}, Err.: ${err_prep} , Enviadas.: ${err_prep}, Recusadas.: ${err_prep}`)
}

// Checa novas ocorrências a cada 30 segundos
let chacaNovasOcorencias = setInterval(() => {
  checkNovasOcorencias().then((dados)=>{
      inseridos += dados.rowsAffected 
      displayDados()
  })   
}, 5000)

// Para a checagem após 90 segundos
setTimeout(() => {
  clearInterval(chacaNovasOcorencias)
  console.log(' - FIM -')
}, 90000)

/*
*/


//getNovasOcorencias().then((dados)=>{
//   console.log('Dados:',dados)
//
//})



