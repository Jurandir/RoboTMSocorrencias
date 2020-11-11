const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../utils/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/OCORRENCIAS_INICIAIS_JOB_INSERT.sql');

var sqlCheck1 = fs.readFileSync(sqlFileName, "utf8");

async function checkNovasOcorenciasIniciais() {    
    let dados         = {}
 
    try {
        result = await sqlExec(sqlCheck1)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlCheck1} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "checkNovasOcorenciasIniciais", "sql" : sqlCheck1 }
        sendLog('ERRO',dados)
        return dados
    } 
}

module.exports = checkNovasOcorenciasIniciais