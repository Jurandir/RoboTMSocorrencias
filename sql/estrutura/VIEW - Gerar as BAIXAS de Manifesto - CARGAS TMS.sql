-- (27/11/2020)
-- CARGASSQL.dbo.
-- SIC.dbo.
-- CREATE [ OR ALTER ] VIEW


USE [SIC]
GO

ALTER VIEW OCORRENCIAS_BAIXAS_VW
AS  
 SELECT   
	CNH.%%physloc%%                           as ID,
	CONCAT(CNH.EMP_CODIGO,SERIE,CTRC)         as DOCUMENTO,
	CNH.CHAVECTE                              as CHAVE,
	CNH.CHAVECTEORIGEM                        as CHAVEORIGINAL,
	CNH.CLI_CGCCPF_PAG                        as CNPJ,
    CURRENT_TIMESTAMP                         as DT_ATUAL,
	MNF.CHEGADA                               as DT_OCORRENCIA,
	MNF.CHEGADA                               as DT_SOLUCAO,
	CAST(NULL AS DATETIME)                    as DT_ENVIO,
	'S'                                       as REPLICAR,  
	CAST(NULL AS int)                         as LATITUDE,
    CAST(NULL AS int)                         as LONGITUDE,
    'CHEGADA NA CIDADE OU FILIAL DE DESTINO'  as OBSERVACAO,  
    15                                        as OCORR301,
    88                                        as OCORR302,
    15                                        as OCORRCASUAL,
    88                                        as OCORRTRANSPORTE,
    88                                        as OCORRSIMPLIFICADA,
	CLI.URL_OCORRENCIA                        as URL_ENDPOINT,
	'1'                                       as TIPOIMAGEM,
    NULL                                      as RET_MENSAGEM,
    NULL                                      as RET_PROTOCOLO,
    0                                         as RET_SUCESSO, 
	'CNH'                                     as OUN_TABELA,
	'BAIXA'                                   as OUN_CHAVE,
	CAST(NULL AS DATETIME)                    as OUN_DATE,
	98                                        as OUN_CODIGO
FROM  SIC.dbo.CONHECIMENTO CON
    JOIN CARGASSQL.dbo.CNH               ON CNH.EMP_CODIGO = SUBSTRING(CON.DOCUMENTO,1,3) AND
	                                        CNH.SERIE      = SUBSTRING(CON.DOCUMENTO,4,1) AND
											CNH.CTRC       = SUBSTRING(CON.DOCUMENTO,5,10)
	JOIN SIC.dbo.CLIENTES CLI            ON CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_PAG,1,8)  OR 
											CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_DEST,1,8) OR
											CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_REMET,1,8)
    JOIN CARGASSQL.dbo.TRB               ON TRB.EMP_CODIGO = CNH.EMP_CODIGO AND 
			                                TRB.CNH_SERIE  = CNH.SERIE AND
				                            TRB.CNH_CTRC   = CNH.CTRC
    JOIN CARGASSQL.dbo.MNF               ON MNF.EMP_CODIGO = TRB.EMP_CODIGO AND 
	                                        MNF.CODIGO     = TRB.MNF_CODIGO
	LEFT JOIN SIC.dbo.OCORRENCIAS ORR    ON ORR.DOCUMENTO  = CONCAT(CNH.EMP_CODIGO,SERIE,CTRC) AND
	                                        ORR.OUN_CHAVE  = 'BAIXA'
WHERE MNF.STATUSBAIXA=2 
  AND ORR.OUN_CODIGO IS NULL 
;

GO
