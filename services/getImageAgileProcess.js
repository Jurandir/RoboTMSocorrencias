const agileBody = require('../models/listAgile')
const loadAPI   = require('./loadAPI')

const method = 'POST'
const endpoint = '/service'
const server =  process.env.AGILE_REST_URL || 'http://termaco.agileprocess.com.br/dash-beta/api/v2'

const getImageAgileProcess = async (doc) => {
    let codeAgile = doc.substring(0,3)+'-'+doc.substring(3,4)+'-'+doc.substring(4,20)
    let params = agileBody(codeAgile)

    //console.log('codeAgile',codeAgile,params,params.filters.logically_deleted)
    let ret    = await loadAPI(method,endpoint,server,params)


    if(ret.json_response==null) {
        let new_param = params
        let deletad   = !params.filters.logically_deleted
        new_param.filters.logically_deleted = deletad
        //console.log('codeAgile',codeAgile,new_param, deletad)
        ret    = await loadAPI(method,endpoint,server,new_param)
    }
    return ret
}

module.exports = getImageAgileProcess
