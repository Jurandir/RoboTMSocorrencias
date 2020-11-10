-- ( Pendencia : Criar index no campo DOCUMENTO )
-- CARGASSQL.dbo.
-- SIC.dbo.
-- CREATE [ OR ALTER ] VIEW

USE [SIC]
GO

ALTER VIEW OCORRENCIAS_INICIAIS_VW
AS  
 SELECT   
	CNH.%%physloc%%                         as ID,
	CONCAT(CNH.EMP_CODIGO,SERIE,CTRC)       as DOCUMENTO,
	CNH.CHAVECTE                            as CHAVE,
	CNH.CHAVECTEORIGEM                      as CHAVEORIGINAL,
	CNH.CLI_CGCCPF_PAG                      as CNPJ,
    CURRENT_TIMESTAMP                       as DT_ATUAL,
	CURRENT_TIMESTAMP                       as DT_OCORRENCIA,
	CURRENT_TIMESTAMP                       as DT_SOLUCAO,
	CAST(NULL AS DATETIME)                  as DT_ENVIO,
	'S'                                     as REPLICAR,  
	CAST(NULL AS int)                       as LATITUDE,
    CAST(NULL AS int)                       as LONGITUDE,
    'PROCESSO DE TRANSPORTE INICIADO'       as OBSERVACAO,  
    15                                      as OCORR301,
    43                                      as OCORR302,
    15                                      as OCORRCASUAL,
    43                                      as OCORRTRANSPORTE,
    43                                      as OCORRSIMPLIFICADA,
	CLI.URL_OCORRENCIA                      as URL_ENDPOINT,
	'2'                                     as TIPOIMAGEM,
    NULL                                    as RET_MENSAGEM,
    NULL                                    as RET_PROTOCOLO,
    0                                       as RET_SUCESSO, 
	'CNH'                                   as OUN_TABELA,
	'INIT'                                  as OUN_CHAVE,
	CAST(NULL AS DATETIME)                  as OUN_DATE,
	0                                       as OUN_CODIGO
FROM CARGASSQL.dbo.CNH
    JOIN CARGASSQL.dbo.CTE               ON CTE.EMP_CODIGO_CNH = CNH.EMP_CODIGO	AND 
	                                        CTE.CNH_SERIE      = CNH.SERIE	AND 
											CTE.CNH_CTRC       = CNH.CTRC											
	JOIN SIC.dbo.CLIENTES CLI            ON CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_PAG,1,8)  OR 
											CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_DEST,1,8) OR
											CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_REMET,1,8)
	LEFT JOIN SIC.dbo.OCORRENCIAS ORR    ON ORR.DOCUMENTO  = CONCAT(CNH.EMP_CODIGO,SERIE,CTRC) AND
	                                        ORR.OUN_CHAVE  = 'INIT'
WHERE DATATU BETWEEN (CURRENT_TIMESTAMP-7) AND (CURRENT_TIMESTAMP+0) AND ORR.OUN_CODIGO IS NULL 
AND CTE.PROTOCOLOCTE IS NOT NULL
;

GO
