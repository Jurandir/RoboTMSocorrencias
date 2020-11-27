-- Mercadoria liberada para entrega
-- ( 13/11/2020 )
-- CARGASSQL.dbo.
-- SIC.dbo.
-- CREATE [ OR ALTER ] VIEW

--USE [SIC]
--GO

--CREATE VIEW OCORRENCIAS_ENTREGA_VW
--AS  
 SELECT   
	MEG.%%physloc%%                           as ID,
	CON.DOCUMENTO                             as DOCUMENTO,
	CNH.CHAVECTE                              as CHAVE,
	CNH.CHAVECTEORIGEM                        as CHAVEORIGINAL,
	CNH.CLI_CGCCPF_PAG                        as CNPJ,
    CURRENT_TIMESTAMP                         as DT_ATUAL,
	CURRENT_TIMESTAMP                         as DT_OCORRENCIA,
	CURRENT_TIMESTAMP                         as DT_SOLUCAO,
	CAST(NULL AS DATETIME)                    as DT_ENVIO,
	'S'                                       as REPLICAR,  
	CAST(NULL AS int)                         as LATITUDE,
    CAST(NULL AS int)                         as LONGITUDE,
    'MERCADORIA LIBERADA PARA ENTREGA'        as OBSERVACAO,  
    15                                        as OCORR301,
    89                                        as OCORR302,
    15                                        as OCORRCASUAL,
    89                                        as OCORRTRANSPORTE,
    89                                        as OCORRSIMPLIFICADA,
	CLI.URL_OCORRENCIA                        as URL_ENDPOINT,
	'1'                                       as TIPOIMAGEM,
    NULL                                      as RET_MENSAGEM,
    NULL                                      as RET_PROTOCOLO,
    0                                         as RET_SUCESSO, 
	'MEG'                                     as OUN_TABELA,
	'ENTREGA'                                 as OUN_CHAVE,
	CAST(NULL AS DATETIME)                    as OUN_DATE,
	203  

    FROM SIC.dbo.CONHECIMENTO CON
    JOIN CARGASSQL.dbo.CNH               ON CNH.EMP_CODIGO     = SUBSTRING(CON.DOCUMENTO,1,3) AND
	                                        CNH.SERIE          = SUBSTRING(CON.DOCUMENTO,4,1) AND
											CNH.CTRC           = SUBSTRING(CON.DOCUMENTO,5,10)
	JOIN SIC.dbo.CLIENTES CLI            ON CLI.CNPJ_CLI       = SUBSTRING(CNH.CLI_CGCCPF_PAG,1,8)  OR 
											CLI.CNPJ_CLI       = SUBSTRING(CNH.CLI_CGCCPF_DEST,1,8) OR
											CLI.CNPJ_CLI       = SUBSTRING(CNH.CLI_CGCCPF_REMET,1,8)

	JOIN CARGASSQL.dbo.IME               ON IME.EMP_CODIGO_CNH = CNH.EMP_CODIGO AND
	                                        IME.CNH_SERIE      = CNH.SERIE AND
	                                        IME.CNH_CTRC       = CNH.CTRC
	JOIN CARGASSQL.dbo.MEG               ON MEG.EMP_CODIGO     = IME.EMP_CODIGO AND
	                                        MEG.CODIGO         = IME.MEG_CODIGO
	LEFT JOIN SIC.dbo.OCORRENCIAS ORR    ON ORR.DOCUMENTO      = CONCAT(CNH.EMP_CODIGO,SERIE,CTRC) AND
	                                        ORR.OUN_CHAVE      = 'ENTREGA'
WHERE 
   --CON.DT_ATUAL > (CURRENT_TIMESTAMP-7) AND
   ORR.OUN_CODIGO IS NULL  

--- IME = Link entre CONHECIMENTO e MAPA DE ENTREGA
--- MEG = MAPA DE ENTREGA