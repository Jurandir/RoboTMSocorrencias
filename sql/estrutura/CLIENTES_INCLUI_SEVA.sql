USE [SIC]
GO

INSERT INTO [dbo].[CLIENTES]
           ([CNPJ_CLI]
           ,[SERVIDOR]
           ,[LOGIN]
           ,[SENHA]
           ,[URL_OCORRENCIA]
           ,[URL_OCORRENCIA_SIMPLIFICADA]
           ,[URL_OCORRENCIA_CLIENTE]
           ,[URL_EVIDENCIAR_OCORRENCIA]
           ,[CHAVE_PUBLICA])
     VALUES
           ('43854116006727'
           ,'https://qa1orionbr.cevalogistics.com/WCFBaixaOcorrencia/Servicos/RegistraBaixa.svc'
           ,'TERMACOS'
           ,'gFUx8hTs9LddDXGI8RPMkU0eJkBD7MznDYonUg+JvA2B4rta6IZUvd21qwYbmB6ZmoVlma2UCnrVJtWNvkSN8ANnS1lBdFFZLclT6f5BMPn540Z2njTQXo1PQ5hMSBBymsLCyed+yMtV3ryN8DLXicRHogZql9TUW75ihM+wu6Q='
           ,'/BaixaOcorrencia'
           ,'/BaixaOcorrenciaSimplificada'
           ,'/BaixaOcorrenciaCliente'
           ,'/EvidenciaOcorrencia'
           ,'')

GO


-- '<RSAKeyValue><Modulus>tAXzaypuIdGAdPMEVvypU1WlfkVxUvETN69LY9+H+8LxlJuAAHmA9yMTiXG8/w1Fai0KzuS0W1/KxhC6I/gqClW/qEjoJLuTLwh3wLc2nxYkMIkkyWxJTEcR6vI/qqX4WFIpakQnTke9tCfCFZy8miPXGWziSiaoWmPZTa7qfW0=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>'


--UPDATE CLIENTES
--SET CHAVE_PUBLICA = '<RSAKeyValue><Modulus>tAXzaypuIdGAdPMEVvypU1WlfkVxUvETN69LY9+H+8LxlJuAAHmA9yMTiXG8/w1Fai0KzuS0W1/KxhC6I/gqClW/qEjoJLuTLwh3wLc2nxYkMIkkyWxJTEcR6vI/qqX4WFIpakQnTke9tCfCFZy8miPXGWziSiaoWmPZTa7qfW0=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>'
--WHERE CNPJ_CLI = '43854116006727'


-- 27/11/2020 as 15:30
UPDATE CLIENTES
SET SERVIDOR = 'https://orionbr.cevalogistics.com/WCFBaixaOcorrencia/Servicos/RegistraBaixa.svc',
    LOGIN = 'WEBTERMACO',
    SENHA = 'plqQS/5gjKlJ49n1IRC2WU7jC06OaajvzghiPoI8nWGrlbvdwxC5JHZBt7ZkVKE+zVwfJmY/b1s0UOkb2T+tDWlnDDsvKptVBMxGO3RM3tTiQHOD0jWEx63VmK9bqJXGT7MG+2dt5RsWsbKZkcjeA546Fy1qo3LzX3TSyVmInQ8='
WHERE CNPJ_CLI='43854116'
;
UPDATE CLIENTES
SET SERVIDOR = 'https://www.itrackbrasil.com.br/ws',
    LOGIN = '11552312000710',
    SENHA = 'TERMACO789'
WHERE CNPJ_CLI='62136304'
;

