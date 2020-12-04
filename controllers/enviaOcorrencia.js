const axios         = require('axios')
const sendLog       = require('../utils/sendLog')
const sendDebug     = require('../utils/sendDebug')

const debug_log     = process.env.DEBUG_LOG || 'OFF'

const formataDataBD            = require('../utils/formataDataBD')
const selectChaveValidaCliente = require('../utils/selectChaveValidaCliente')

const enviaOcorrencia = async ( ocorrencia, cliente ) => {
    let ret
    let dados
    const url = cliente.SERVIDOR + cliente.URL_OCORRENCIA
    const config = {
      headers: { "Content-Type": 'application/json' }
    }  
    let bodyParameters = {
        "login": cliente.LOGIN,
        "senha": cliente.SENHA,
        "chave": selectChaveValidaCliente( ocorrencia.CHAVEORIGINAL ),
        "ocorrCasual": ocorrencia.OCORRCASUAL,
        "ocorrTransporte": ocorrencia.OCORRTRANSPORTE,
        "dataOcorr": formataDataBD( ocorrencia.DT_ATUAL ),
        "replicar": ocorrencia.REPLICAR,
        "latitude": ocorrencia.LATITUDE,
        "longitude": ocorrencia.LONGITUDE,
        "observacao": ocorrencia.OBSERVACAO
      }
      try {       
          ret = await axios.post(url,  bodyParameters, config)
          sendDebug(ocorrencia.CHAVEORIGINAL, '(OCORRÊNCIA) param:'+JSON.stringify(bodyParameters)+',config:'+JSON.stringify(config) )
          return { dados : ret.data, isErr: false, isAxiosError: ret.isAxiosError }
      } catch (err) { 
          dados = {err, isErr: true, url: url, isAxiosError: true } 
          sendLog('ERRO', JSON.stringify(dados) )
          sendDebug(ocorrencia.CHAVEORIGINAL, '(OCORRÊNCIA ERRO) param:'+JSON.stringify(bodyParameters)+',config:'+JSON.stringify(config) )
          return dados
      }
}

module.exports = enviaOcorrencia


/*
cliente:
    CNPJ_CLI: '43854116',
    SERVIDOR: 'https://qa1orionbr.cevalogistics.com/WCFBaixaOcorrencia/Servicos/RegistraBaixa.svc',
    LOGIN: 'TERMACOS',
    SENHA: 'gFUx8hTs9LddDXGI8RPMkU0eJkBD7MznDYonUg+JvA2B4rta6IZUvd21qwYbmB6ZmoVlma2UCnrVJtWNvkSN8ANnS1lBdFFZLclT6f5BMPn540Z2njTQXo1PQ5hMSBBymsLCyed+yMtV3ryN8DLXicRHogZql9TUW75ihM+wu6Q=',
    URL_OCORRENCIA: '/BaixaOcorrencia',
    URL_OCORRENCIA_SIMPLIFICADA: '/BaixaOcorrenciaSimplificada',
    URL_OCORRENCIA_CLIENTE: '/BaixaOcorrenciaCliente',
    URL_EVIDENCIAR_OCORRENCIA: '/EvidenciaOcorrencia',
    CHAVE_PUBLICA: '<RSAKeyValue><Modulus>tAXzaypuIdGAdPMEVvypU1WlfkVxUvETN69LY9+H+8LxlJuAAHmA9yMTiXG8/w1Fai0KzuS0W1/KxhC6I/gqClW/qEjoJLuTLwh3wLc2nxYkMIkkyWxJTEcR6vI/qqX4WFIpakQnTke9tCfCFZy8miPXGWziSiaoWmPZTa7qfW0=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>',
    DIAS_SQL: 7
  }

ocorrencias :
{
  ID: 214,
  CNPJ: '43854116006727',
  DOCUMENTO: 'ETME34346',
  CHAVE: '31201011552312002097570010000343461446020632',
  CHAVEORIGINAL: '31200943854116006727570010000976741200205330',
  DT_ATUAL: 2020-11-06T16:24:15.000Z,
  DT_OCORRENCIA: 2020-11-06T16:24:13.000Z,
  DT_SOLUCAO: 2020-11-06T16:24:14.000Z,
  DT_ENVIO: null,
  REPLICAR: 'S',
  LATITUDE: '',
  LONGITUDE: '',
  OBSERVACAO: 'CHEGADA NA CIDADE OU FILIAL DE DESTINO',
  OCORR301: 15,
  OCORR302: 88,
  OCORRCASUAL: 15,
  OCORRTRANSPORTE: 88,
  OCORRSIMPLIFICADA: 88,
  URL_ENDPOINT: '/BaixaOcorrencia',
  TIPOIMAGEM: '2',
  FILE_IMAGEM: null,
  RET_MENSAGEM: null,
  RET_PROTOCOLO: null,
  RET_SUCESSO: 0,
  OUN_TABELA: 'CNH',
  OUN_CHAVE: 'ETME34346',
  OUN_DATE: 2020-11-06T16:24:15.000Z,
  OUN_CODIGO: 98
}  
*/

