const sqlQuery      = require('../connection/sqlQuery')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/consultas/NOVAS_OCORRENCIAS.SQL');

var sqlOcorencias = fs.readFileSync(sqlFileName, "utf8");

async function getNovasOcorencias() {    
    let dados         = {}

    console.log('Lendos dados...')
   
    try {
        data = await sqlQuery(sqlOcorencias)
  
        let { Erro } = data
        if (Erro) { 

            console.log('ERRO:',Erro)
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlOcorencias} ]`)
        }  
               
        dados = data
        return dados
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getNovasOcorencias", "sql" : sqlOcorencias }
        return dados
    } 
}

module.exports = getNovasOcorencias