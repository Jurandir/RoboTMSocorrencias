const sqlExec       = require('../connection/sqlExec')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/OCORRENCIAS_JOB_INSERT.SQL');

var sqlCheck = fs.readFileSync(sqlFileName, "utf8");

async function checkNovasOcorencias() {    
    let dados         = {}
 
    try {
        result = await sqlExec(sqlCheck)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlCheck} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "checkNovasOcorencias", "sql" : sqlCheck }
        return dados
    } 
}

module.exports = checkNovasOcorencias