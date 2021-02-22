const getImageAgileProcess   = require('../services/getImageAgileProcess')
const sendLog                = require('../utils/sendLog')

const checkImagemAgileProcess = async (documento) => {
    let value    = documento
    let base64Str = { ok:false, msg:'Sem retorno',imagem:'', list:[] }

    sendLog('INFO',`Solicitando imagem ${documento}, Aguardando AgileProcess...`)

    await getImageAgileProcess( value ).then( async (resposta)=>{

            let msg           = ''
            let base64Image   = ''
            let tipoConteudo  = 'INFO'

            if (resposta.Err) {
                  resposta.Err = true 
                  msg = resposta.err
            }

            if (!resposta.Err) {

                  try {
                     let resources = resposta.dados.json_response[0].checkpoint.resources.slice(0).reverse()
                     let photo = resposta.dados.json_response[0].checkpoint.image

                     if((photo) && (resources.length==0)) {
                        tipoConteudo ='PHOTO'   
                        base64Image  = JSON.parse(photo).photo
                        base64Str.list.push(base64Image)
                     }
                 
                     const promises = resources.map(async (element, idx) => { 
     
                             let label    = element.content_label
                             let label_id = element.service_event_effect_id
                             let display  = ''


                              base64Image   = element.content
                              tipoConteudo  = element.content_type

                              console.log('IMAGENS:',idx,label,label_id,base64Image.length)

                              if (tipoConteudo=='PHOTO') {
                                    msg              = 'Imagem recebida.'
                                    base64Str.msg    = msg
                                    base64Str.list.push(base64Image) 
                                    base64Str.ok     = true 
                                    display = `Imagem AgileProcess [${label_id}]/(${label}) ${documento} : ${base64Str.msg}`
                                    sendLog('SUCESSO',display)      

                                    // Swap para deixar sempre a imagem SEVA na frete
                                    let lenArray = base64Str.list
                                    if(lenArray>1 && label_id==60){
                                          let img1 = base64Str.list[0]
                                          base64Str.list[0] = base64Image
                                          base64Str.list[lenArray-1] = img1
                                    }
                                    
                                    // console.log(display)

                              } else {
                                    base64Str.msg    = msg
                                    base64Str.ok     = false
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
                        sendLog('SUCESSO',`Imagem AgileProcess (PHOTO) ${documento} : ${base64Str.msg}`)      
                  }

            } else {

                  base64Str.msg   = msg
            }  
                 
    }).catch((err)=>{ 

      base64Str.msg   = JSON.stringify(err)
      console.log(err)
      sendLog('ERRO',`Obtendo Imagem - AgileProcess ${documento} : ${ JSON.stringify(err) } - (Rotina: checkImagemAgileProcess)`)
    })

    if (base64Str.list.length>0) {
      base64Str.ok  = true
      base64Str.msg = `Lista com : ${base64Str.list.length}`

      let len
      base64Str.list.forEach((d,i)=>{
            len = `${d}`.length
            sendLog('INFO',`obteve ${documento} imagem${i} na API - AgileProcess LEN: ${len} - (Rotina: checkImagemAgileProcess)`)
      })
    }

    return base64Str

}

module.exports = checkImagemAgileProcess
