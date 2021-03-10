const getEvidencias           = require('./getEvidencias')
const gravaRegistroEvidencias = require('./gravaRegistroEvidencias')
const sendLog                 = require('../utils/sendLog')
const sendDebug               = require('../utils/sendDebug')
const easydocs                = require('../controllers/checkImagemEasyDocs')
const agileprocess            = require('../controllers/checkImagemAgileProcess')
const enviaEvidencias         = require('../controllers/enviaEvidencias')

async function checkNovasEvidencias() {  
    let ret   = { rowsAffected: 0, qtdeSucesso: 0,msg: '', isErr: false  }   
    let dados = await getEvidencias()
    let ultimo_doc

    function gravaEvidenciasLoad_OK(documento, origem){
        let params = {
            documento: documento,
            enviado: 0,
            origem: origem,
            load: 1,
            send: 0,
            protocolo: '',
        }
        gravaRegistroEvidencias(params)
    }
    function gravaEvidenciasSend_OK( documento, protocolo , origem){
        let params = {
            documento: documento,
            enviado: 1,
            origem: origem,
            load: 0,
            send: 1,
            protocolo: protocolo,
        }
        gravaRegistroEvidencias(params)
    }

    function gravaEvidenciaCancelada( documento, protocolo , origem){
        let params = {
            documento: documento,
            enviado: 1,
            origem: origem+'*',
            load: 1,
            send: 1,
            protocolo: protocolo+'.Impossível registrar nova evidência.',
        }
        gravaRegistroEvidencias(params)
    }

    
    if (dados.erro) {
        ret.isErr = true
        ret.msg   = JSON.stringify(dados.erro)
        sendLog('ERRO', ret.msg )
        return ret
    } 
    ret.rowsAffected = dados.length

    async function getTodos() {

        const promises = dados.map(async (element, idx) => {
            let resultado    = {Mensagem:'Sem resposta',Protocolo:'[IMAGEM]',Sucesso:false}
            let isErr        = true
            let isAxiosError = true
            let origem       = 'EASYDOCS'
            let imagemRUIM   = false
            let list         = []

            let evidencia = { ok: false }  //;= await easydocs(element.DOCUMENTO)

            if (evidencia.ok==false){
                // Não achou na Easydocs e vai procurar na AgileProcess
                origem       = 'AGILEPROCESS'
                evidencia    = await agileprocess(element.DOCUMENTO)                
                list.push(...evidencia.list)

                // Testar se "evidencia.cods[0] == 60", COMPROVANTE CLIENTE , se não for setar "evidencia.ok=false"
                // msg = "AgileProcess - Não retornou comprovante cliente = 60"

            } 

            if (evidencia.ok==false){

                sendLog('WARNING',`(EasyDocs,AgileProcess) DOC:${element.DOCUMENTO} - (Não achou a imagem solicitada) (006) (${origem})` )
            } 
            else if (evidencia.ok==true){

                imagemRUIM   = false
                ret.qtdeSucesso++

                //-------------------
                try {
                    
                    const LISTA = []
                    LISTA.push(...list)

                    if((evidencia.imagem.length<200) && (list.length=0) ){
                        imagemRUIM   = true
                        sendLog('AVISO:',`DOC: ${element.DOCUMENTO} - (${origem}) - Imagem corrumpida ou qualidade ruim` )
                    } else {
                 
                        let img = []
                        if(LISTA.length > 0) {
                            img.push( ...LISTA )
                        } else {
                            let tmp = [evidencia.imagem]
                            img.push( ...tmp)
                        }

                        let resposta     = await enviaEvidencias( element, img )
                        isErr            = resposta.isErr
                        isAxiosError     = resposta.isAxiosError || false
                        resultado        = resposta.dados.EvidenciaOcorrenciaResult


                    }
                    gravaEvidenciasLoad_OK(element.DOCUMENTO, origem)
                } catch (err) {
                    console.log('ERRO - (checkNovasEvidencias) :',err)
                    isErr = true
                    sendDebug('DOC:'+element.DOCUMENTO, `(${origem}) param:`+JSON.stringify(element) )
                    sendLog('WARNING',`Envio p/API-DOC:${element.DOCUMENTO} - (002) (${origem})` )
                }
                //-------------------
                if (imagemRUIM == false){
                    if ((isAxiosError==true) || (isErr==true)) { 
                        sendLog('ERRO',`Envio p/API-DOC:${element.DOCUMENTO} - (001) (${origem})` ) 
                    } else if ( resultado.Sucesso == false ) { 
                        sendLog('WARNING',`API : Envio retornado, não OK, DOC: ${element.DOCUMENTO} - Msg: ${resultado.Mensagem} - Prot: ${resultado.Protocolo} (004) (${origem})  Chave: (${element.CHAVEORIGINAL})`)
                        if(`${resultado.Mensagem}`.search('POD do CT-e') > 0 ) {
                            gravaEvidenciaCancelada(element.DOCUMENTO, resultado.Protocolo, origem)
                        }
                    } else if ( resultado.Sucesso == true ) { 
                        gravaEvidenciasSend_OK(element.DOCUMENTO, resultado.Protocolo, origem)
                        sendLog('SUCESSO',`Envio p/API-DOC: ${element.DOCUMENTO} - Ret API: ${resultado.Mensagem} - Prot: ${resultado.Protocolo} (005) (${origem})`)
                    } else {    
                        sendLog('ALERTA',`Envio p/API-DOC: ${element.DOCUMENTO} - (003) (${origem})`)
                        sendDebug('DOC:'+element.DOCUMENTO, `(${origem}) param:`+JSON.stringify(element) )
                    }
                }
                //-------------------
            } 
        })
        
        await Promise.all(promises)
    }
    await getTodos()
    return ret    
}

module.exports = checkNovasEvidencias