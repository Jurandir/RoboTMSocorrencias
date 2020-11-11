const sqlQuery      = require('../connection/sqlQuery')
const sendLog       = require('../utils/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/consultas/OCORRENCIAS_NAO_ENVIADAS.SQL');

var sqlNaoEnviadas = fs.readFileSync(sqlFileName, "utf8");

async function getOcorenciasNaoEnviadas() {    
    let dados         = {}
  
    try {
        data = await sqlQuery(sqlNaoEnviadas)
  
        let { Erro } = data
        if (Erro) { 

            console.log('ERRO:',Erro)
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlNaoEnviadas} ]`)
        }  
               
        dados = data
        return dados
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getNovasOcorencias", "sql" : sqlNaoEnviadas }
        sendLog('ERRO',dados)
        return dados
    } 
}

module.exports = getOcorenciasNaoEnviadas