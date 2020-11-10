const fs = require('fs')

const sendLog = async ( ref, msg ) => {
    let agora =  new Date().toISOString()
    let hoje =  agora.substr(0,10)
    let file = './log/log'+hoje+'.log'
    let linha = `${agora} - ${ref} - ${msg}`+'\n'

    fs.writeFile(file, linha,  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }
    })    
}

module.exports = sendLog