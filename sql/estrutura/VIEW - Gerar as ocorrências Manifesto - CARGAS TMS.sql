-- ( 13/11/2020 )
-- CARGASSQL.dbo.
-- SIC.dbo.
-- CREATE [ OR ALTER ] VIEW

USE [SIC]
GO

ALTER VIEW OCORRENCIAS_MANIFESTO_VW
AS  
 SELECT   
	CNH.%%physloc%%                           as ID,
	CONCAT(CNH.EMP_CODIGO,SERIE,CTRC)         as DOCUMENTO,
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
    'SAIDA NO CENTRO DE DISTRIBUICAO (CDOUT)' as OBSERVACAO,  
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
	'CNH'                                     as OUN_TABELA,
	'MANIF'                                   as OUN_CHAVE,
	CAST(NULL AS DATETIME)                    as OUN_DATE,
	302                                       as OUN_CODIGO
FROM  SIC.dbo.CONHECIMENTO CON
    JOIN CARGASSQL.dbo.CNH               ON CNH.EMP_CODIGO     = SUBSTRING(CON.DOCUMENTO,1,3) AND
	                                        CNH.SERIE          = SUBSTRING(CON.DOCUMENTO,4,1) AND
											CNH.CTRC           = SUBSTRING(CON.DOCUMENTO,5,10)
    JOIN CARGASSQL.dbo.CTE               ON CTE.EMP_CODIGO_CNH = CNH.EMP_CODIGO	AND 
	                                        CTE.CNH_SERIE      = CNH.SERIE	AND 
											CTE.CNH_CTRC       = CNH.CTRC											
	JOIN SIC.dbo.CLIENTES CLI            ON CLI.CNPJ_CLI       = SUBSTRING(CNH.CLI_CGCCPF_PAG,1,8)  OR 
											CLI.CNPJ_CLI       = SUBSTRING(CNH.CLI_CGCCPF_DEST,1,8) OR
											CLI.CNPJ_CLI       = SUBSTRING(CNH.CLI_CGCCPF_REMET,1,8)
    LEFT JOIN CARGASSQL.dbo.TRB          ON TRB.EMP_CODIGO     = CNH.EMP_CODIGO AND 
			                                TRB.CNH_SERIE      = CNH.SERIE AND
				                            TRB.CNH_CTRC       = CNH.CTRC 
	LEFT JOIN SIC.dbo.OCORRENCIAS ORR    ON ORR.DOCUMENTO      = CONCAT(CNH.EMP_CODIGO,SERIE,CTRC) AND
	                                        ORR.OUN_CHAVE      = 'MANIF'
WHERE 
 CON.DT_ATUAL > (CURRENT_TIMESTAMP-7) AND
 ORR.OUN_CODIGO IS NULL AND 
 CTE.PROTOCOLOCTE IS NOT NULL AND 
 TRB.CNH_CTRC IS NOT NULL 
 ;

GO
