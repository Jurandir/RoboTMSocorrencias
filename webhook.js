//-- Versão Inicial em ( 13/11/2020 ) 
//-- Versão Atual   em ( 27/11/2020 ) ( PRECISA REFATORAR )
//-- By: Jurandir Ferreira
const colors = require('colors')

require('dotenv').config()

const displayDados                  = require('./utils/displayDados')
const enviaOcorrencia               = require('./controllers/enviaOcorrencia')
const getNovasOcorencias            = require('./controllers/getNovasOcorencias')
const checkNovosConhecimentos       = require('./controllers/checkNovosConhecimentos')
const checkNovasOcorencias          = require('./controllers/checkNovasOcorencias')
const checkNovasEvidencias          = require('./controllers/checkNovasEvidencias')
const checkBaixaManifesto           = require('./controllers/checkBaixaManifesto')
const checkNovasOcorenciasIniciais  = require('./controllers/checkNovasOcorenciasIniciais')
const checkNovasOcorenciasManifesto = require('./controllers/checkNovasOcorenciasManifesto')
const getOcorenciasNaoEnviadas      = require('./controllers/getOcorenciasNaoEnviadas')
const getCliente                    = require('./controllers/getCliente')
const gravaRetornoCliente           = require('./controllers/gravaRetornoCliente')
const reenvioDeOcorencias           = require('./controllers/reenvioDeOcorencias')
const sendLog                       = require('./utils/sendLog')

// Tempo em mseg para loop de checagem
const check_time                 = process.env.CHECK_TIME      || 10000
const time_evidencias            = process.env.TIME_EVIDENCIAS || 1800000

// Tela inicial
process.stdout.write('\x1B[2J\x1B[0f')
const titulo = '[BOT Ocorrências:]'.yellow.bgBlue.bold
console.log(titulo)
sendLog('MSG','Startup serviço')

// Ler parametros de SETUP da API do Cliente
let cliente 
getCliente().then((dados)=>{
   cliente = dados[0]
   console.log('Cliente Ativo:',cliente.CNPJ_CLI)
   sendLog('AVISO',`Setup cliente ${cliente.CNPJ_CLI}`)
})

// Contadores
let conhecimentos    = 0
let baixaManifesto   = 0
let inseridos        = 0
let err_prep         = 0
let naoEnviadas      = 0
let reenvios         = 0
let enviadas         = 0
let recusadas        = 0
let checks           = 0
let load_evidencias  = 0
let check_evidencias = 0

// Mostra estatistica no console 
let ShowInfo = () => {
  displayDados(inseridos, err_prep, naoEnviadas, enviadas, recusadas, checks , reenvios )
}

// Ler base de ocorrencias SIC para enviar aou cliente
let enviaDados = async () => {
  getOcorenciasNaoEnviadas().then((dados)=>{

    // Varre elementos a enviar
    dados.forEach( async (element) => {
      let ret
      let ocorrencia_id = element.ID
      let retorno = { Sucesso:false, Mensagem:'Falha ao acessar API', Protocolo: 'S/N'  }
      let str_ref = 'AVISO'

        try {
              // envia ocorrencia para API do cliente              
              ret = await enviaOcorrencia(element,cliente)
              
              if (ret.isAxiosError==true){
                  retorno.Sucesso   = false
                  retorno.Mensagem  = 'Sem retorno da API'
                  retorno.Protocolo = 'ERRO API'
                  str_ref = 'ERROAPI'
              } else {
                retorno = ret.dados.BaixaOcorrenciaResult
                str_ref = 'MSG'
              }
                          
              if (ret.isErr==true) {  // Ocoreu um erro consumindo a API
                  str_ref = 'ERRO'
                  err_prep++  
              } else        
                if (retorno.Sucesso==false) { // A API informou erro nos dados de envio
                  str_ref = 'AVISOAPI'
                  recusadas++
              } else 
                if (retorno.Sucesso==true) { // A API informou sucesso no envio
                  str_ref = 'SUCESSO'
                  enviadas++
              } else {
                  str_ref = 'ALERTA'
                  err_prep++ // Erro ainda não tratado
              }

              sendLog(str_ref,`Ocorr ID: ${element.ID} - DOC: ${element.DOCUMENTO} - Ret-API: ${retorno.Mensagem} - Prot: ${retorno.Protocolo}`)

              // Grava retorno recebido, na base SIC, vindo da API do Cliente
              gravaRetornoCliente(element,retorno).then((resposta)=>{
                if ( resposta.rowsAffected <= 0 ) {
                    err_prep++ // Erro na gravação dos dados de retorno 
                    sendLog('ERRO',`Gravando retorno API em BD (ID.${ocorrencia_id}) : ${resposta}`)

                } else {
                  sendLog('INFO',`OK - (ID.${ocorrencia_id}) : ${JSON.stringify(resposta)}`)
                  naoEnviadas--
                }
              })

        } catch( err ) {
            err_prep++
            sendLog('ERRO',`Varrendo ocorrencias (ID.${ocorrencia_id}) : ${err}`)
        }

        ShowInfo()   
      //}

    })
  })
}

// Fluxo de execução
//let inicio_id                       = 0
let x_checkBaixaManifesto           = true
let x_checkNovosConhecimentos       = true
let x_checkNovasOcorenciasManifesto = true
let x_checkNovasOcorenciasIniciais  = true
let x_checkNovasOcorencias          = true
let x_getNovasOcorencias            = true
let x_reenvioDeOcorencias           = true
let x_novasEvidencias               = true

  
// Checa novas ocorrências a cada ($check_time$)
let chacaNovasOcorencias = setInterval(() => {
  checks++
  ShowInfo()

 // Baixa manifesto ( CHEGADA NA CIDADE OU FILIAL DE DESTINO ) 
  if (x_checkBaixaManifesto == true ) {

      x_checkBaixaManifesto  = false
      checkBaixaManifesto().then((dados)=>{
            baixaManifesto += dados.rowsAffected 
            if (dados.rowsAffected > 0) {
              sendLog('AVISO',`Baixa de Manifesto - (QTDE: ${dados.rowsAffected}, TOTAL: ${baixaManifesto})`)
            }
            x_checkBaixaManifesto  = true
      })

  }

  // Checa se há novos conhecimentos
  if (x_checkNovosConhecimentos == true ) {

      x_checkNovosConhecimentos  = false
      checkNovosConhecimentos().then((dados)=>{
          conhecimentos += dados.rowsAffected 
          if (dados.rowsAffected > 0) {
            sendLog('AVISO',`Conhecimentos - (QTDE: ${dados.rowsAffected}, TOTAL: ${conhecimentos})`)
          }
          x_checkNovosConhecimentos  = true
      })

  }

  // Checa se há novos manifestos (SAÍDA NO CENTRO DE DISTRIBUIÇÃO (CDOUT))
  if (x_checkNovasOcorenciasManifesto == true ) {

      x_checkNovasOcorenciasManifesto  = false
      checkNovasOcorenciasManifesto().then((dados)=>{
          if (dados.rowsAffected > 0) {
            inseridos += dados.rowsAffected 
            sendLog('AVISO',`Novas Ocorrências - (QTDE: ${dados.rowsAffected}, TOTAL: ${inseridos})`)
          }
          x_checkNovasOcorenciasManifesto  = true
      })

  }

  // Checa se há novos conhecimentos iniciados ( Ocorrencia : PROCESSO DE TRANSPORTE INICIADO )
  if (x_checkNovasOcorenciasIniciais == true ) {

      x_checkNovasOcorenciasIniciais  = false
      checkNovasOcorenciasIniciais().then((dados)=>{
          if (dados.rowsAffected > 0) {
            inseridos += dados.rowsAffected 
            sendLog('AVISO',`Conhecimentos Iniciados - (QTDE: ${dados.rowsAffected}, TOTAL: ${inseridos})`)
          }
          x_checkNovasOcorenciasIniciais  = true
      })

  }    
  
  // Checa se há novas ocorrencias no GARGAS
  if (x_checkNovasOcorencias == true ) {

      x_checkNovasOcorencias  = false
      checkNovasOcorencias().then((dados)=>{
          if (dados.rowsAffected > 0) {
            inseridos += dados.rowsAffected 
            sendLog('AVISO',`Novas Ocorrências - (QTDE: ${dados.rowsAffected}, TOTAL: ${inseridos})`)
          }
          x_checkNovasOcorencias  = true
      })

  }

  // Checa existe ocorrencias não enviadas na base SIC
  if (x_getNovasOcorencias == true ) {

      x_getNovasOcorencias  = false
      getNovasOcorencias().then((dados)=>{
          if (dados[0].QTDE > 0) { 
              naoEnviadas = dados[0].QTDE
              ShowInfo()
            // Chama processo de envio de dados quando existe dados não enviados
              enviaDados()
          } else {
            // inicio_id = 0
          }
          x_getNovasOcorencias  = true
      })

  }    

  // Checa e revalida reenvios
  if (naoEnviadas == 0) {
    if (x_reenvioDeOcorencias == true ) {

        x_reenvioDeOcorencias  = false
        reenvioDeOcorencias().then((dados)=>{
          if (dados.rowsAffected > 0) {
            reenvios += dados.rowsAffected 
            sendLog('AVISO',`Ocorrências ReEnviadas- (QTDE: ${dados.rowsAffected}, TOTAL: ${reenvios})`)
          }
          x_reenvioDeOcorencias  = true
      })

    } 
  }
}, check_time )

// Checa novas evidências
function novasEvidencias() {
    checkNovasEvidencias().then((dados)=>{
      if (dados.rowsAffected > 0) {
        check_evidencias += dados.rowsAffected 
        sendLog('AVISO',`Proces Evidências - (QTDE: ${dados.rowsAffected}, TOTAL: ${check_evidencias})`)
      }
      ShowInfo()
    })
}

const geraComprovantes = function() {
  if (x_novasEvidencias==true) {
      novasEvidencias()
  }    
  setTimeout(geraComprovantes, time_evidencias);
}

setTimeout(geraComprovantes, 5000)


