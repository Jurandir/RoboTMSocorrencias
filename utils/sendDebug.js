const fs            = require('fs')
const debug_log     = process.env.DEBUG_LOG || 'OFF'

const sendDebug = async ( ref, msg ) => {

    if (debug_log != 'ON') {
        return
    }
    
    let data = new Date();
    let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    let dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');

    let loga = true
    let agora =  new Date().toISOString()
    let hoje =  agora.substr(0,10)
    let file = './log/DEBUG_'+hoje+'.log'
    let linha = `${dataBase} - ${ref} - ${msg}`+'\n'

    if (loga==true) {
        fs.writeFile(file, linha,  {'flag':'a'},  function(err) {
            if (err) {
                return console.error(err);
            }
        })    
    }
}

module.exports = sendDebug