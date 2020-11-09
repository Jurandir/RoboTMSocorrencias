
const modo = process.env.NODE_ENV  || 'Developer'
const XAV1 = process.env.TEST_XAV1 || '35200743854116006484570000007681611124057857'
const XAV2 = process.env.TEST_XAV2 || '35200743854116006484570000007681621124629793'


function selectChaveValidaCliente( chaveOriginal ) {
    let ret 
    let opc = chaveOriginal.substr(6,1).toInteger 
    if (modo=='Production' || opc==9) {
        ret = chaveOriginal
    } else 
      if ( opc > 5 ) {
        ret = XAV1
    } else {
        ret = XAV2
    }
    return ret
}

module.exports = selectChaveValidaCliente