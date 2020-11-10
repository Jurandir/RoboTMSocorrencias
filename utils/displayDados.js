
const displayDados = (inseridos, err_prep, naoEnviadas, enviadas , recusadas , checks, reenvios ) => {
    process.stdout.write(`\rInseridas: ${inseridos}, Erros: ${err_prep} , Enviadas: ${enviadas}, Recusadas: ${recusadas}, Pendente: ${naoEnviadas}, Re-Envio: ${reenvios}, Use (Ctr-C) p/ Finalizar..${checks}..`.yellow)
}

module.exports = displayDados