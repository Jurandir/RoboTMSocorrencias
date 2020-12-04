const getImageAgileProcess   = require('../services/getImageAgileProcess')
const sendLog                = require('../utils/sendLog')

const checkImagemAgileProcess = async (documento) => {
    let value    = documento
    let base64Str = { ok:false, msg:'Sem retorno',imagem:''}

    sendLog('INFO',`Solicitando imagem ${documento}, Aguardando AgileProcess...`)

    await getImageAgileProcess( value ).then((resposta)=>{

            if (!resposta.Err) {
                  let base64Image  = resposta.dados.json_response[0].checkpoint.resources[0].content
                  base64Str.msg   = 'Imagem recebida.'
                  base64Str.ok     = true
                  base64Str.imagem = base64Image
                  sendLog('SUCESSO',`Imagem AgileProcess ${documento} : ${base64Str.msg}`)
            } else {
                  base64Str.msg   = 'Não tem a imagem solicitada.'
                  // sendLog('WARNING',`Imagem AgileProcess ${documento} : ${base64Str.msg}`)
            }  
                 
    }).catch((err)=>{ 
      base64Str.msg   = JSON.stringify(err)
      sendLog('ERRO',`Imagem AgileProcess ${documento} : ${ JSON.stringify(err) } - checkImagemAgileProcess`)
    })

    return base64Str

}

module.exports = checkImagemAgileProcess
