const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../utils/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/OCORRENCIAS_MANIFESTO_JOB_INSERT.sql');

var sqlCheck2 = fs.readFileSync(sqlFileName, "utf8");

async function checkNovasOcorenciasManifesto() {    
    let dados         = {}
 
    try {
        result = await sqlExec(sqlCheck2)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlCheck2} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "checkNovasOcorenciasManifesto", "sql" : sqlCheck2 }
        sendLog('ERRO',dados)
        return dados
    } 
}

module.exports = checkNovasOcorenciasManifesto