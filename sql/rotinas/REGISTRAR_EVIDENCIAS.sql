UPDATE CONHECIMENTO
SET COMPROVANTE_ENVIADO = 0,
    COMPROVANTE_ORIGEM  = '${origem}',
    DT_ENVIO            = CURRENT_TIMESTAMP, 
    QTDE_LOAD           = QTDE_LOAD + 1,
    QTDE_SEND           = QTDE_SEND + 1,
    PROTOCOLO           = ''
WHERE
   DOCUMENTO = '${documento}'
