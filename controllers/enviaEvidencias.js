const axios         = require('axios')
const sendLog       = require('../utils/sendLog')

const selectChaveValidaCliente = require('../utils/selectChaveValidaCliente')

const enviaEvidencias = async ( ocorrencia, cliente, imagem ) => {
    let ret
    let dados
    const url = cliente.SERVIDOR + cliente.URL_EVIDENCIAR_OCORRENCIA
    const config = {
      headers: { "Content-Type": 'application/json' }
      }
  
    let bodyParameters = {
        "login": cliente.LOGIN,
        "senha": cliente.SENHA,
        "chave": selectChaveValidaCliente( ocorrencia.CHAVEORIGINAL ),
        "tipoImagem": ocorrencia.TIPOIMAGEM,
        "imagem": imagem,
        "replicar": "",
      }
      try {       
          //console.log(bodyParameters,config)
          ret = await axios.post(url,  bodyParameters, config)
          //console.log(ret)
          return { dados : ret.data, isErr: false, isAxiosError: ret.isAxiosError }
      } catch (err) { 
          dados = {err, isErr: true, url: url, isAxiosError: true, rotina:"enviaEvidencias" } 
          sendLog('ERRO', JSON.stringify(dados) )
          return dados
      }
}

module.exports = enviaEvidencias
