const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../utils/sendLog')


async function gravaRetornoCliente(ocorrencia, retorno) {    
    let dados = {}

    let { Mensagem, Protocolo, Sucesso } = retorno
    let flag = (Sucesso == true) ? 1 : 0 
    let sql = `UPDATE SIC.dbo.OCORRENCIAS
                 SET RET_MENSAGEM  = '${Mensagem}',
                     RET_PROTOCOLO = '${Protocolo}',
                     RET_SUCESSO   = ${flag},
                     DT_ENVIO = CURRENT_TIMESTAMP
               WHERE 
                  ID = ${ocorrencia.ID}`
    
    try {
        result = await sqlExec(sql)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sql} ]`)
        }

        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "gravaRetornoCliente", "sql" : sql,"retorno": retorno }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = gravaRetornoCliente

/*
RET: {
  dados: {
    BaixaOcorrenciaResult: {
      Mensagem: 'Documento CTRC não encontrado.',
      Protocolo: 'B3B14EB1748226DFE053C24DEC0AA494',
      Sucesso: false
    }
  },
  isErr: false
}
*/