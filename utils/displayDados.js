
const displayDados = (inseridos, err_prep, naoEnviadas, enviadas , recusadas ) => {
    process.stdout.write(`\rGeradas: ${inseridos}, Err.: ${err_prep} , Enviadas.: ${enviadas}, Recusadas.: ${recusadas}, A enviar.: ${naoEnviadas}, Use (Ctr-C) para Finalizar o serviço...`.yellow)
}

module.exports = displayDados