const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../utils/sendLog')


async function gravaRegistroEvidencias(evidencia) {    
    let dados = {}

    let sql = `UPDATE CONHECIMENTO
                 SET COMPROVANTE_ENVIADO = ${evidencia.enviado},
                     COMPROVANTE_ORIGEM  = '${evidencia.origem}',
                     DT_ENVIO            = CURRENT_TIMESTAMP, 
                     QTDE_LOAD           = QTDE_LOAD + ${evidencia.load},
                     QTDE_SEND           = QTDE_SEND + ${evidencia.send}
                WHERE
                     DOCUMENTO = '${evidencia.documento}' `
    try {
        result = await sqlExec(sql)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sql} ]`)
        }

        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "gravaRegistroEvidencias", "sql" : sql,"registro": evidencia }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = gravaRegistroEvidencias

