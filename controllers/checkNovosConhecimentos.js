const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../utils/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/CONHECIMENTOS_INICIADOS_JOB_INSERT.sql');

var sqlCheck3 = fs.readFileSync(sqlFileName, "utf8");

async function checkNovosConhecimentos() {    
    let dados         = {}
 
    try {
        result = await sqlExec(sqlCheck3)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlCheck3} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "checkNovosConhecimentos", "sql" : sqlCheck3 }
        sendLog('ERRO',dados)
        return dados
    } 
}

module.exports = checkNovosConhecimentos