const sqlQuery      = require('../connection/sqlQuery')
const sendLog       = require('../utils/sendLog')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/consultas/EVIDENCIAS_PENDENTES.SQL');

var sqlEvidencias = fs.readFileSync(sqlFileName, "utf8");

async function getEvidencias() {    
    let dados = {}
    try {
        data = await sqlQuery(sqlEvidencias)
        let { Erro } = data
        if (Erro) { 
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlEvidencias} ]`)
        }  
        dados = data
        return dados
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getEvidencias", "sql" : sqlEvidencias }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getEvidencias