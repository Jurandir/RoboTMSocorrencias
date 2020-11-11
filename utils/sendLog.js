const fs = require('fs')

const msg_info = process.env.MSG_INFO || 'TRUE'

const sendLog = async ( ref, msg ) => {
    let loga = true
    let agora =  new Date().toISOString()
    let hoje =  agora.substr(0,10)
    let file = './log/log'+hoje+'.log'
    let linha = `${agora} - ${ref} - ${msg}`+'\n'

    if ((msg_info == 'FALSE') && (ref=='INFO')) { loga = false }

    if (loga==true) {
        fs.writeFile(file, linha,  {'flag':'a'},  function(err) {
            if (err) {
                return console.error(err);
            }
        })    
    }
}

module.exports = sendLog