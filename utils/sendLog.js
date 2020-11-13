const fs = require('fs')

const msg_info    = process.env.MSG_INFO || 'TRUE'
const msg_sucesso = process.env.MSG_SUCESSO || 'TRUE'
const msg_aviso   = process.env.MSG_AVISO || 'TRUE'
const msg_warning = process.env.MSG_WARNING

const sendLog = async ( ref, msg ) => {
    
    let data = new Date();
    let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    let dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');

    let loga = true
    let agora =  new Date().toISOString()
    let hoje =  agora.substr(0,10)
    let file = './log/log'+hoje+'.log'
    let linha = `${dataBase} - ${ref} - ${msg}`+'\n'

    if ((msg_info     == 'FALSE') && (ref=='INFO'))    { loga = false }
    if ((msg_sucesso  == 'FALSE') && (ref=='SUCESSO')) { loga = false }
    if ((msg_aviso    == 'FALSE') && (ref=='AVISO'))   { loga = false }
    if ((msg_warning  == 'FALSE') && (ref=='WARNING')) { loga = false }

    if (loga==true) {
        fs.writeFile(file, linha,  {'flag':'a'},  function(err) {
            if (err) {
                return console.error(err);
            }
        })    
    }
}

module.exports = sendLog