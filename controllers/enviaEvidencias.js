const axios         = require('axios')
const sendLog       = require('../utils/sendLog')
const sendDebug     = require('../utils/sendDebug')

const selectChaveValidaCliente = require('../utils/selectChaveValidaCliente')

const enviaEvidencias = async ( evidencia, imagem ) => {
    let ret
    let dados
    const url = evidencia.SERVIDOR + evidencia.URL_EVIDENCIAR_OCORRENCIA
    const config = {
      headers: { "Content-Type": 'application/json' }
      }
  
    let bodyParameters = {
        "login": evidencia.LOGIN,
        "senha": evidencia.SENHA,
        "chave": selectChaveValidaCliente( `${evidencia.CHAVEORIGINAL}` ),
        "tipoImagem": evidencia.TIPOIMAGEM,
        "imagem": imagem,
        "replicar": "",
      }
      try {       
          ret = await axios.post(url,  bodyParameters, config)
          bodyParameters.imagem = `(STRING_IMAGEM_BASE64) LEN:'+ ${bodyParameters.imagem.length}`
          sendDebug(evidencia.CHAVEORIGINAL, '(IMAGEM) param:'+JSON.stringify(bodyParameters)+',config:'+JSON.stringify(config) )
          return { dados : ret.data, isErr: false, isAxiosError: ret.isAxiosError }
      } catch (err) { 
          dados = {err, isErr: true, url: url, isAxiosError: true, rotina:"enviaEvidencias" } 
          bodyParameters.imagem = `(STRING_IMAGEM_BASE64) LEN:'+ ${bodyParameters.imagem.length}`
          sendDebug(evidencia.CHAVEORIGINAL, '(IMAGEM ERRO) param:'+JSON.stringify(bodyParameters)+',config:'+JSON.stringify(config) )
          sendLog('ERRO', JSON.stringify(dados) )
          return dados
      }
}

module.exports = enviaEvidencias
