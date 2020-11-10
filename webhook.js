const colors = require('colors')

require('dotenv').config()

const displayDados                  = require('./utils/displayDados')
const enviaOcorrencia               = require('./controllers/enviaOcorrencia')
const getNovasOcorencias            = require('./controllers/getNovasOcorencias')
const checkNovasOcorencias          = require('./controllers/checkNovasOcorencias')
const checkNovasOcorenciasIniciais  = require('./controllers/checkNovasOcorenciasIniciais')
const checkNovasOcorenciasManifesto = require('./controllers/checkNovasOcorenciasManifesto')
const getOcorenciasNaoEnviadas      = require('./controllers/getOcorenciasNaoEnviadas')
const getCliente                    = require('./controllers/getCliente')
const gravaRetornoCliente           = require('./controllers/gravaRetornoCliente')
const reenvioDeOcorencias           = require('./controllers/reenvioDeOcorencias')
const sendLog                       = require('./utils/sendLog')

// Tempo em mseg para loop de checagem
const check_time                 = process.env.CHECK_TIME || 5000

// Tela inicial
process.stdout.write('\x1B[2J\x1B[0f')
const titulo = '[BOT Ocorrências:]'.yellow.bgBlue.bold
console.log(titulo)
sendLog('INFO','Startup serviço')

// Ler parametros de SETUP da API do Cliente
let cliente 
getCliente().then((dados)=>{
   cliente = dados[0]
   console.log('Cliente Ativo:',cliente.CNPJ_CLI)
   sendLog('INFO',`Setup cliente ${cliente.CNPJ_CLI}`)
})

// Contadores
let inseridos   = 0
let err_prep    = 0
let naoEnviadas = 0
let reenvios    = 0
let enviadas    = 0
let recusadas   = 0
let checks      = 0

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

        try {
              // envia ocorrencia para API do cliente              
              ret = await enviaOcorrencia(element,cliente)
              
              if (ret.isAxiosError==true){
                  retorno.Sucesso   = false
                  retorno.Mensagem  = 'Sem retorno da API'
                  retorno.Protocolo = 'ERRO API'
              } else {
                  retorno = ret.dados.BaixaOcorrenciaResult
              }
                          
              if (ret.isErr==true) {  // Ocoreu um erro consumindo a API
                  err_prep++  
              } else        
                if (retorno.Sucesso==false) { // A API informou erro nos dados de envio
                  recusadas++
              } else 
                if (retorno.Sucesso==true) { // A API informou sucesso no envio
                  enviadas++
              } else {
                  err_prep++ // Erro ainda não tratado
              }

              sendLog('AVISO',`Ocorr ID: ${element.ID} - Ret API: ${retorno.Mensagem} - Prot: ${retorno.Protocolo}`)

              // Grava retorno recebido, na base SIC, vindo da API do Cliente
              gravaRetornoCliente(element,retorno).then((resposta)=>{
                if ( resposta.rowsAffected <= 0 ) {
                    err_prep++ // Erro na gravação dos dados de retorno 
                    sendLog('ERRO',`Gravando retorno API em BD (ID.${ocorrencia_id}) : ${resposta}`)

                } else {
                  naoEnviadas--
                }
              })

        } catch( err ) {
            err_prep++
            sendLog('ERRO',`Varrendo ocorrencias (ID.${ocorrencia_id}) : ${err}`)
        }

        ShowInfo()   

    })
  })
}

// Checa novas ocorrências a cada 5 segundos
let chacaNovasOcorencias = setInterval(() => {
  checks++
  ShowInfo()

  // Checa se há novos manifestos (SAÍDA NO CENTRO DE DISTRIBUIÇÃO (CDOUT))
  checkNovasOcorenciasManifesto().then((dados)=>{
    inseridos += dados.rowsAffected 
  })

  // Checa se há novos conhecimentos (PROCESSO DE TRANSPORTE INICIADO)
  checkNovasOcorenciasIniciais().then((dados)=>{
    inseridos += dados.rowsAffected 
  })
  
  // Checa se há novas ocorrencias no GARGAS
  checkNovasOcorencias().then((dados)=>{
    inseridos += dados.rowsAffected 
  })

  // Checa existe ocorrencias não enviadas na base SIC
  getNovasOcorencias().then((dados)=>{
    naoEnviadas = dados[0].QTDE
    ShowInfo()
    if (naoEnviadas > 0) { // Chama processo de envio de dados quando existe dados não enviados
      enviaDados()
    }
  })

  // Checa e revalida reenvios
  if (naoEnviadas == 0) {
    reenvioDeOcorencias().then((dados)=>{
      reenvios += dados.rowsAffected 
    }) 
  }
}, check_time )

// Para a checagem após 90 segundos (Finaliza Programa)
//setTimeout(() => {
//  clearInterval(chacaNovasOcorencias)
//  console.log(' - FIM - ')
//
//}, 90000)


/// *** PENDENCIAS ***
/// - Rotina para gerar ocorrencia quando gerado um manifesto de um conhecimento do cliente
/// - Rotina para leitura e envio de imagens da EasyDOC ou da Agile
