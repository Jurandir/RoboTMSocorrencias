const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../utils/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/OCORRENCIAS_REENVIO_UPD.sql');

var sqlReEnvio = fs.readFileSync(sqlFileName, "utf8");

async function reenvioDeOcorencias() {    
    let dados         = {}
 
    try {
        result = await sqlExec(sqlReEnvio)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlReEnvio} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "reenvioDeOcorencias", "sql" : sqlReEnvio }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = reenvioDeOcorencias