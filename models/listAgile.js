const listAgile = ( documento ) => {
    return { 
            "filters": {
                "user_service_unique_code__in": [ documento ],
                "logically_deleted" : true
            },
            "action": "list",
            "json_content": [{
                "export_options": {
                        "export_checkpoints": "true"
                }
            }]
        }
}

module.exports = listAgile