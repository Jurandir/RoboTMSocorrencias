const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../utils/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/OCORRENCIAS_BAIXA_JOB_INSERT.sql');

var sqlCheck4 = fs.readFileSync(sqlFileName, "utf8");

async function checkBaixaManifesto() {    
    let dados         = {}
 
    try {
        result = await sqlExec(sqlCheck4)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlCheck4} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "checkBaixaManifesto", "sql" : sqlCheck4 }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = checkBaixaManifesto