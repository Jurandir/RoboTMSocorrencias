const colors = require('colors')

require('dotenv').config()

const displayDados               = require('./utils/displayDados')
const enviaOcorrencia            = require('./controllers/enviaOcorrencia')
const getNovasOcorencias         = require('./controllers/getNovasOcorencias')
const checkNovasOcorencias       = require('./controllers/checkNovasOcorencias')
const getOcorenciasNaoEnviadas   = require('./controllers/getOcorenciasNaoEnviadas')
const getCliente                 = require('./controllers/getCliente')
const gravaRetornoCliente        = require('./controllers/gravaRetornoCliente')

const titulo = '[BOT Ocorrências:]'.yellow.bgBlue.bold
console.log(titulo)

// Ler parametros de SETUP da API do Cliente
let cliente 
getCliente().then((dados)=>{
   cliente = dados[0]
   console.log('Cliente Ativo:',cliente.CNPJ_CLI)
})

let inseridos   = 0
let err_prep    = 0
let naoEnviadas = 0
let enviadas    = 0
let recusadas   = 0
let qtde        = 0

// Mostra estatistica no console 
let ShowInfo = () => {
  displayDados(inseridos, err_prep, naoEnviadas, enviadas, recusadas )
}

// Ler base de ocorrencias SIC para enviar aou cliente
let enviaDados = async () => {
  getOcorenciasNaoEnviadas().then((dados)=>{
    qtde = dados.length
    enviadas += qtde
    ShowInfo()

    // Varre elementos a enviar
    dados.forEach( async (element) => {

        try {
              // envia ocorrencia para API do cliente
              let ret = await enviaOcorrencia(element,cliente)
              let retorno = ret.dados.BaixaOcorrenciaResult
            
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

              // Grava retorno recebido, na base SIC, vindo da API do Cliente
              gravaRetornoCliente(element,retorno).then((resposta)=>{
                if ( resposta.rowsAffected <= 0 ) {
                    err_prep++ // Erro na gravação dos dados de retorno 
                    console.log('Resposta:',resposta)
                }
              })

        } catch( err ) {
            console.log('Erro:',err,ret)
            err_prep++
        }

        ShowInfo()   

    })
  })
}

// Checa novas ocorrências a cada 5 segundos
let chacaNovasOcorencias = setInterval(() => {

  // Checa se há novas ocorrencias no GARGAS
  checkNovasOcorencias().then((dados)=>{
    inseridos += dados.rowsAffected 
    ShowInfo()
  })

  // Checa ocorrencias não enviadas na base SIC
  getNovasOcorencias().then((dados)=>{
    naoEnviadas = dados[0].QTDE
    ShowInfo()
    if (naoEnviadas > 0) { // Chama processo de envio de dados quando existe dados não enviados
      enviaDados()
    }
  })

}, 5000)

// Para a checagem após 90 segundos (Finaliza Programa)
//setTimeout(() => {
//  clearInterval(chacaNovasOcorencias)
//  console.log(' - FIM - ')
//
//}, 90000)


/// *** PENDENCIAS ***
/// - Rotina para re-enviar ocorrencias com envio sem sucesso
/// - Rotina para gerar ocorrencia quando gerado um novo conhecimento
/// - Rotina para gerar ocorrencia quando gerado um manifesto de um conhecimento do cliente
/// - Rotina para leitura e envio de imagens da EasyDOC ou da Agile
