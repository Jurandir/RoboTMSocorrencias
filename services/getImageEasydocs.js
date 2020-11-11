const axios = require('axios')
require('dotenv').config();

const url = process.env.EASYDOCS_SOAP_URL

const getImageEasydocs = async (emp,num) => {
  
  const empresa = emp
  const numero = num

  let bodyParameters = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
      <tem:Recupera_ImagemQtd>
          <tem:CodigoCliente>160</tem:CodigoCliente>
          <tem:ListaImagens>
              <tem:EImagemKey>
              <tem:CodigoFilial>${empresa}</tem:CodigoFilial>
              <tem:NumeroConhecimento>${numero}</tem:NumeroConhecimento>
              <tem:file_s3_key>
              </tem:file_s3_key>
              </tem:EImagemKey>
          </tem:ListaImagens>
      </tem:Recupera_ImagemQtd>
  </soapenv:Body>
  </soapenv:Envelope>
`
  const config = {
    headers: { 
        "Content-Type": "text/xml;charset=UTF-8",
        "Accept-Encoding": "gzip,deflate",
        "Accept": "*/*"
        }
    }
    
    try {
        let ret = await axios.post(url,  bodyParameters, config)

        // Resposta da API SOAP da Easydocs
        const xml = decodeURI(ret.data)

        const regexNumero  = /<NumeroConhecimento>(.+?)<\/NumeroConhecimento>/
        const regexEmpresa = /<CodEmpresa>(.+?)<\/CodEmpresa>/
        const regexFilial  = /<CodigoFilial>(.+?)<\/CodigoFilial>/
        const regexImagem  = /<Imagem>(.+?)<\/Imagem>/
        const regexRetorno = /<Retorno>(.+?)<\/Retorno>/
        

        const matchNumero   = regexNumero.exec(xml)
        const matchEmpresa  = regexEmpresa.exec(xml)
        const matchFilial   = regexFilial.exec(xml)
        const matchImagem   = regexImagem.exec(xml)
        const matchRetorno  = regexRetorno.exec(xml)

        
        let result = {
            "CodEmpresa": `${matchEmpresa[1]}`,
            "CodigoFilial": `${matchFilial[1]}`,
            "NumeroConhecimento": `${matchNumero[1]}`,
            "isErr": false
        }  

        if (matchRetorno[1] == 'false') {
            result.Imagem = ''
            result.Retorno = false
        } else {    
            result.Imagem = `${matchImagem[1]}`
            result.Retorno = true
        }
        
        return result
        
    } catch (err) { 
        return {err, isErr: true, url: url };
    }
}

module.exports = getImageEasydocs
