const getImageAgileProcess   = require('../services/getImageAgileProcess')
const sendLog                = require('../utils/sendLog')

const checkImagemAgileProcess = async (documento) => {
    let value    = documento
    let base64Str = { ok:false, msg:'Sem retorno',imagem:'', list:[] }

    sendLog('INFO',`Solicitando imagem ${documento}, Aguardando AgileProcess...`)

    await getImageAgileProcess( value ).then( async (resposta)=>{

            let msg           = 'Não tem a imagem solicitada.'
            let base64Image   = ''
            let tipoConteudo  = 'INFO'

            if (resposta.Err) {
                  resposta.Err = true 
                  msg = resposta.err
            }

            if (!resposta.Err) {

                  try {
                     let resources = resposta.dados.json_response[0].checkpoint.resources
                     let photo = resposta.dados.json_response[0].checkpoint.image

                     if(photo) {
                        tipoConteudo ='PHOTO'   
                        base64Image  = JSON.parse(photo).photo
                        base64Str.list.push(base64Image)
                     }
                 
                     const promises = resources.map(async (element, idx) => { 
                              base64Image   = element.content
                              tipoConteudo  = element.content_type
                              if (tipoConteudo=='PHOTO') {
                                    base64Str.list.push(base64Image)    
                              }
                      })
                      await Promise.all(promises)

                  } catch (err) {
                      base64Image   = ''
                      tipoConteudo  = 'INFO'
                  }

                  if(tipoConteudo=='PHOTO') {
                        msg              = 'Imagem recebida.'
                        base64Str.msg    = msg
                        base64Str.ok     = true
                        base64Str.imagem = base64Image
                        sendLog('SUCESSO',`Imagem AgileProcess ${documento} : ${base64Str.msg}`)      
                  } else {
                        base64Str.msg    = msg
                        base64Str.ok     = false
                        sendLog('INFO',`Não obteve imagem na API - AgileProcess ${documento} - (Rotina: checkImagemAgileProcess)`)
                  }

            } else {
                  base64Str.msg   = msg
            }  
                 
    }).catch((err)=>{ 
      base64Str.msg   = JSON.stringify(err)
      console.log(err)
      sendLog('ERRO',`Obtendo Imagem - AgileProcess ${documento} : ${ JSON.stringify(err) } - (Rotina: checkImagemAgileProcess)`)
    })

    return base64Str

}

module.exports = checkImagemAgileProcess
