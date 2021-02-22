const axios         = require('axios')
const sendLog       = require('../utils/sendLog')
const sendDebug     = require('../utils/sendDebug')

const selectChaveValidaCliente = require('../utils/selectChaveValidaCliente')

const enviaEvidencias = async ( evidencia, imagem ) => {
    let ret
    let dados
    let fotos = []
    let list = []
    
    if (typeof(imagem)== 'object') {
      fotos = imagem
    } else {
      fotos = [imagem]
    }
        
    const url = evidencia.SERVIDOR + evidencia.URL_EVIDENCIAR_OCORRENCIA
    const config = {
      headers: { "Content-Type": 'application/json' }
      }
  
    let bodyParameters = {
        "login": evidencia.LOGIN,
        "senha": evidencia.SENHA,
        "chave": selectChaveValidaCliente( `${evidencia.CHAVEORIGINAL}` ),
        "tipoImagem": evidencia.TIPOIMAGEM,
        "imagem": imagem[0],
        "replicar": "",
      }
      try { 
          
          //---------------------------------------------
          // comentado para enviar somente 1 imagem
          //---------------------------------------------
          //const promises = fotos.map(async (foto, idx) => {
          //    bodyParameters.imagem = foto
              let idx = 0
              ret = await axios.post(url,  bodyParameters, config)

          //    list.push(ret)
              let bp = bodyParameters
              bp.imagem = `IMAGEM: ${idx}, (STRING_IMAGEM_BASE64) LEN: ${bodyParameters.imagem.length}`
              sendDebug(evidencia.CHAVEORIGINAL, `(param:`+JSON.stringify(bp)+',config:'+JSON.stringify(config) )  

          //})
          //await Promise.all(promises)

          return { dados : ret.data, list: list ,isErr: false, isAxiosError: false }

      } catch (err) { 
          dados = {err, list: [] ,isErr: true, url: url, isAxiosError: true, rotina:"enviaEvidencias" } 
          bodyParameters.imagem = `(STRING_IMAGEM_BASE64) LEN:'+ ${bodyParameters.imagem.length}`
          sendDebug(evidencia.CHAVEORIGINAL, '(IMAGEM ERRO) param:'+JSON.stringify(bodyParameters)+',config:'+JSON.stringify(config) )
          sendLog('ERRO', JSON.stringify(dados) )

          return dados
      }
}

module.exports = enviaEvidencias
