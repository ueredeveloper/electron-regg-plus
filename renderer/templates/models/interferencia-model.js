/**
 * @nome Interferencia
 * @diretorio models
 * @descricao Modelos de Tabelas
 * @arquivo interferencia-model.js
 * @id 
 *
 *
 */

class InterferenciaModel {
	constructor() { }

	// Método um exemplo json da interferência
	getSample() {
		return { "caesb": true, "nivelEstatico": "6", "nivelDinamico": "6", "profundidade": "0", "vazaoOutorgavel": 14000, "vazaoSistema": 13000, "vazaoTeste": 15000, "tipoPoco": { "id": 1, "descricao": "Manual" }, "sistema": "P1", "id": 32, "latitude": -15.55245275071159, "longitude": -47.4260946018407, "endereco": { "id": 68, "logradouro": "Campos do Jordão, Pedra Nova, 12", "documentos": [], "interferencias": [] }, "tipoInterferencia": { "id": 2, "descricao": "Subterrânea" }, "tipoOutorga": { "id": 2, "descricao": "Outorga Prévia" }, "subtipoOutorga": { "id": 2, "descricao": "Modificação" }, "situacaoProcesso": { "id": 2, "descricao": "Em Análise" }, "tipoAto": { "id": 2, "descricao": "Portaria" }, "baciaHidrografica": { "objectid": 8, "baciaNome": "Rio Preto" }, "unidadeHidrografica": { "objectid": 4, "uhNome": "Ribeirão Santa Rita" }, "finalidades": [{ "id": 112, "finalidade": "Criação de Animais", "subfinalidade": "Touro", "quantidade": 85.0, "consumo": 96.0, "total": 8160.0, "tipoFinalidade": { "id": 1 } }, { "id": 111, "finalidade": "Criação de Animais", "subfinalidade": "Touro", "quantidade": 85.0, "consumo": 96.0, "total": 7644.0, "tipoFinalidade": { "id": 2 } }], "demandas": [{ "id": 649, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 1, "tipoFinalidade": { "id": 1 } }, { "id": 652, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 6, "tipoFinalidade": { "id": 1 } }, { "id": 655, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 3, "tipoFinalidade": { "id": 1 } }, { "id": 659, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 11, "tipoFinalidade": { "id": 1 } }, { "id": 661, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 12, "tipoFinalidade": { "id": 1 } }, { "id": 662, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 8, "tipoFinalidade": { "id": 1 } }, { "id": 663, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 5, "tipoFinalidade": { "id": 1 } }, { "id": 650, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 9, "tipoFinalidade": { "id": 2 } }, { "id": 651, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 3, "tipoFinalidade": { "id": 2 } }, { "id": 653, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 1, "tipoFinalidade": { "id": 2 } }, { "id": 654, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 7, "tipoFinalidade": { "id": 2 } }, { "id": 656, "vazao": 8160.0, "tempo": 9, "periodo": 28, "mes": 2, "tipoFinalidade": { "id": 2 } }, { "id": 657, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 6, "tipoFinalidade": { "id": 2 } }, { "id": 658, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 10, "tipoFinalidade": { "id": 2 } }, { "id": 660, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 8, "tipoFinalidade": { "id": 2 } }, { "id": 664, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 7, "tipoFinalidade": { "id": 1 } }, { "id": 666, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 10, "tipoFinalidade": { "id": 1 } }, { "id": 667, "vazao": 8160.0, "tempo": 9, "periodo": 28, "mes": 2, "tipoFinalidade": { "id": 1 } }, { "id": 668, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 9, "tipoFinalidade": { "id": 1 } }, { "id": 670, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 4, "tipoFinalidade": { "id": 1 } }, { "id": 665, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 4, "tipoFinalidade": { "id": 2 } }, { "id": 669, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 5, "tipoFinalidade": { "id": 2 } }, { "id": 671, "vazao": 8160.0, "tempo": 9, "periodo": 30, "mes": 11, "tipoFinalidade": { "id": 2 } }, { "id": 672, "vazao": 8160.0, "tempo": 9, "periodo": 31, "mes": 12, "tipoFinalidade": { "id": 2 } }] }
	}

	// Retorna string com nome da unidade hidrográfica
	getUnidadeHidrografica(interferencia) {
		return interferencia.unidadeHidrografica.uhNome;
	}
	// Retorna uma string com sistema e subsistema. Ex: Paraná R3
	getSistemaSubsistema(interferencia) {
		let sistema = interferencia?.sistema || '';
    	let subsistema = interferencia?.subsistema || '';
		return sistema + (subsistema!=='' ? ' - ' + subsistema : '');
	}
	// Retorno string em minúsculo com o tipo de poço, se manual ou tubular.
	getTipoPoco(interferencia) {
		return interferencia?.tipoPoco?.descricao.toLowerCase() || 'XXX';
	}
	/**
	 * Verifica se o valor é nulo ou se é igual a zero, caso seja retorna string "NÃO INFORMADO", caso não seja retorna o valor.
	 * @param {String|Number} value 
	 * @returns {String|Number}
	 */
	parseOrDefault(value) {
		let _value = Number(value);
		return isNaN(_value) || _value === 0 ? 'Não informado' : _value;
	}
	
	// Retorno string em minúsculo com o tipo de poço, se manual ou tubular.
	getLimitType (interferencia) {
		return interferencia?.tipoPoco?.id===3? "Limites Outorgados": "Limites Registrados";
	}
}