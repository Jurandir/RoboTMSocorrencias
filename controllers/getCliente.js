const sqlQuery      = require('../connection/sqlQuery')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/consultas/CLIENTE.SQL');

var sqlCliente = fs.readFileSync(sqlFileName, "utf8");

async function getCliente() {    
    let dados         = {}
  
    try {
        data = await sqlQuery(sqlCliente)
  
        let { Erro } = data
        if (Erro) { 

            console.log('ERRO:',Erro)
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlCliente} ]`)
        }  
               
        dados = data
        return dados
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getCliente", "sql" : sqlCliente }
        return dados
    } 
}

module.exports = getCliente