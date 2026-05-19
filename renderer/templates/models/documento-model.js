/**
 * @nome Documento
 * @diretorio models
 * @descricao Modelos de Tabelas
 * @arquivo documento-model.js
 * @id 
 *
 *
 */

class DocumentoModel {

	constructor() { }

	getSample() {
		return {
			"id": 22,
			"numero": "158073681",
			"numeroSei": "158073681",
			"processo": {
				"id": 17,
				"numero": "0197-000673/2006",
				"anexo": {
					"id": 24,
					"numero": "0197-000673/2006",
					"processos": []
				},
				"usuario": null,
				"documentos": []
			},
			"tipoDocumento": {
				"id": 3,
				"descricao": "Requerimento"
			},
			"endereco": {
				"id": 29,
				"logradouro": "Fazenda Barreiro, Número 01, Sítio Jatobá ",
				"cidade": null,
				"bairro": "Brazlândia",
				"cep": null,
				"interferencias": [{
					"id": 199, "latitude": -15.977755,
					"longitude": -47.816121,
					"geometry": null,
					"endereco": { "id": 155, "logradouro": "DF - 140, KM 5,6 - Chácara Casa do Vale, S/N, Nova Betânia, São Sebastião", "cidade": null, "bairro": null, "cep": null, "interferencias": [], "estado": null }, "tipoInterferencia": { "id": 2, "descricao": "Subterrânea", "interferencias": [] },
					"tipoOutorga": { "id": 1, "descricao": "Outorga", "interferencias": [] },
					"subtipoOutorga": { "id": 2, "descricao": "Modificação", "interferencias": [] },
					"situacaoProcesso": { "id": 2, "descricao": "Em Análise", "interferencias": [] },
					"tipoAto": { "id": 1, "descricao": "Despacho", "interferencias": [] },
					"baciaHidrografica": {
						"objectid": 4, "shapeLeng": null, "baciaCod": null,
						"baciaNome": "Rio São Bartolomeu", "gdbGeomattrData": null, "shape": null
					},
					"unidadeHidrografica": {
						"objectid": 17, "idBacia": null, "baciaNome": null,
						"baciaCodi": null, "subbaciaN": null, "uhNome": "Ribeirão Santana", "uhLabel": null, "uhCodigo": null, "subbciaCo": null, "shapeLeng": null, "shape": null, "areaKmSq": null, "qmmJan": null, "qmmFev": null, "qmmMar": null, "qmmAbr": null, "qmmMai": null, "qmmJun": null, "qmmJul": null, "qmmAgo": null, "qmmSet": null, "qmmOut": null, "qmmNov": null, "qmmDez": null, "rgHidro": null, "gdbGeomattrData": null, "interferencias": []
					},
					"finalidades": [
						{ "id": 661, "finalidade": "Irrigação paisagística aut", "subfinalidade": "paisagismo/agroecologia", "quantidade": 2.75, "consumo": 66000.0, "total": 66000.0, "interferencia": null, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] } },
						{ "id": 659, "finalidade": "Criação/dessedentação animal", "subfinalidade": "aves", "quantidade": 300.0, "consumo": 75.0, "total": 75.0, "interferencia": null, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] } },
						{ "id": 660, "finalidade": "Irrigação paisagística", "subfinalidade": "paisagismo/agroecologia", "quantidade": 2.75, "consumo": 66000.0, "total": 66000.0, "interferencia": null, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] } },

							{ "id": 658, "finalidade": "Criação/dessedentação aut", "subfinalidade": "aves", "quantidade": 300.0, "consumo": 75.0, "total": 75.0, "interferencia": null, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] } },

					{ "id": 656, "finalidade": "Abastecimento humano Req", "subfinalidade": "área rural", "quantidade": 123.0, "consumo": 150.0, "total": 18450.0, "interferencia": null, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] } },
						{ "id": 657, "finalidade": "Abastecimento humano Aut", "subfinalidade": "área rural", "quantidade": 123.0, "consumo": 110.0, "total": 13530.0, "interferencia": null, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] } },
					
					
					],



					"demandas": [
						{ "id": 3222, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 3, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3223, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 5, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null },
						{ "id": 3224, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 12, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3225, "vazao": 13530.0, "tempo": 2, "periodo": 28, "mes": 2, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null },
						{ "id": 3226, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 11, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3227, "vazao": 79605.0, "tempo": 9, "periodo": 30, "mes": 6, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null },
						{ "id": 3228, "vazao": 79605.0, "tempo": 9, "periodo": 30, "mes": 4, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3229, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 1, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3230, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 6, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3231, "vazao": 13530.0, "tempo": 2, "periodo": 30, "mes": 11, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3232, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 8, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3233, "vazao": 79605.0, "tempo": 9, "periodo": 31, "mes": 10, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3234, "vazao": 13530.0, "tempo": 2, "periodo": 31, "mes": 3, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3235, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 2, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3236, "vazao": 79605.0, "tempo": 9, "periodo": 30, "mes": 9, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3237, "vazao": 79605.0, "tempo": 9, "periodo": 31, "mes": 5, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3238, "vazao": 79605.0, "tempo": 9, "periodo": 31, "mes": 7, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3239, "vazao": 79605.0, "tempo": 9, "periodo": 31, "mes": 8, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3240, "vazao": 13530.0, "tempo": 2, "periodo": 31, "mes": 1, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3241, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 7, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3242, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 10, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3243, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 9, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3244, "vazao": 13530.0, "tempo": 2, "periodo": 31, "mes": 12, "tipoFinalidade": { "id": 2, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }, { "id": 3245, "vazao": 0.0, "tempo": 0, "periodo": 0, "mes": 4, "tipoFinalidade": { "id": 1, "descricao": null, "finalidades": [], "demandas": [] }, "interferencia": null }], "caesb": false, "nivelEstatico": "16.34", "nivelDinamico": "28.68", "profundidade": "78", "vazaoOutorgavel": 9600, "vazaoSistema": 6500, "vazaoTeste": 12000, "sistema": null, "subsistema": null, "codPlan": null, "tipoPoco": { "id": 3, "descricao": "Tubular" }
				}]
				,
				"estado": null
			},
			"usuarios": [{
				nome: "Carlos Drummond de Andrade",
				cpfCnpj: 12345678955
			}]
		}

	}
}