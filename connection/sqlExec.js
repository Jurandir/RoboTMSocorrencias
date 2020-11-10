const { poolPromise } = require('./dbTMS')

async function sqlQuery( sSQL ) {      
    try {  
        let pool = await poolPromise 
        let result = await pool.request().query( sSQL )
        pool.close
        return { rowsAffected: result.rowsAffected[0], msg:"OK", Erro: ""}
    } catch (err) {  
        return { rowsAffected: -1, msg:"ERRO", Erro: err.message }
    } 
}
module.exports = sqlQuery
