const getImageEasydocs   = require('../services/getImageEasydocs')
const sendLog            = require('../utils/sendLog')

const checkImagemEasyDocs = async (documento) => {
    let value    = documento
    let base64Str = { ok:false, msg:'Sem retorno',imagem:''}

    let empresa = value.substring(0,3)
    let ctrc    = value.substring(4,10)

    sendLog('INFO',`Solicitando imagem ${documento}, Aguardando EasyDocs...`)

    await getImageEasydocs(empresa,ctrc ).then((resposta)=>{

            if (resposta.isErr) {
                  base64Str.msg   = resposta.err.message
                  sendLog('ERRO',`Imagem EasyDocs ${documento} : ${base64Str.msg}`)
            } else 
            if (!resposta.Retorno) {
                  base64Str.msg   = 'Não tem a imagem solicitada.'
                  sendLog('WARNING',`Imagem EasyDocs ${documento} : ${base64Str.msg}`)
            } else 
            if (resposta.Retorno) {
                  base64Str.msg   = 'Imagem recebida.'
                  base64Str.ok     = true
                  base64Str.imagem = `${resposta.Imagem}`
                  sendLog('SUCESSO',`Imagem EasyDocs ${documento} : ${base64Str.msg}`)
            } else {
                  sendLog('WARNING',`Imagem EasyDocs ${documento} : Não retornou a solicitação.`)
            }  
                 
    }).catch((err)=>{ 
      base64Str.msg   = JSON.stringify(err)
      sendLog('ERRO',`Imagem EasyDocs ${documento} : ${ JSON.stringify(err) } - checkImagemEasyDocs`)
    })

    return base64Str

}

module.exports = checkImagemEasyDocs