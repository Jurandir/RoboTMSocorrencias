-- Mercadoria liberada para entrega


SELECT MEG.* 
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
--- IME = Link entre CONHECIMENTO e MAPA DE ENTREGA
--- MEG = MAPA DE ENTREGA