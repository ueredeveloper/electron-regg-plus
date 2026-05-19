/**
 * 
 * @nome Utilizades
 * @descricao Funções compartilhadas
 * @diretorio utils
 * @arquivo script.js
 * @id 
 *
 *
 */

 class Utils {

	constructor() {}

	/**
	 * Atualiza tudo utilizando um exemplo da tabela documento com endereço, interferências e usuário
	 * @param {*}
	 */
	updateHtmlDocument(docJson, interJson) {
		
		let documento = docJson;
		let interferencia = interJson;
		
		//console.log('update html doc', interferencia.unidadeHidrografica.uhNome)
		
		// Verifica se a classe ObjectView está disponível
		if (typeof ObjectView !== 'undefined') {
			// Atualiza ObjectView
			new ObjectView().update(documento, interferencia);
		} else {
			console.error("SubjectView não definida.");
		}

		// Verifica e atualiza SubjectView se estiver disponível
		if (typeof SubjectView !== 'undefined') {
			new SubjectView().update(documento, interferencia);
		} else {
			console.error("SubjectView não definida.");
		}

		// Verifica e atualiza AnalyseView se estiver disponível
		if (typeof AnalyseView !== 'undefined') {
			new AnalyseView().update(documento, interferencia);
		} else {
			console.error("AnalyseView não definida.");
		}

		// Verifica e atualiza WellInfoView se estiver disponível
		if (typeof WellInfoView !== 'undefined') {
			new WellInfoView().update(interferencia);
		} else {
			console.error("WellInfoView não definida.");
		}

		// Verifica e inicializa PurpouseTableView
		if (typeof PurpouseRequestedTableView !== 'undefined') {
			new PurpouseRequestedTableView(documento, 1, interferencia, 'tbl-request-purpouse-view');
		} else {
			console.error("Purpouse Requested Table View não definida.");
		}

		// Verifica e inicializa PurpouseTableView
		if (typeof PurpouseAuthorizedTableView !== 'undefined') {
			new PurpouseAuthorizedTableView(documento, 2, interferencia, 'tbl-authorized-purpouse-view');
		} else {
			console.error("Purpouse Authorized Table View não definida.");
		}

		// Atualiza despachos com as tabelas geográficas
		if (typeof GeographicTableView !== 'undefined') {
			new GeographicTableView().update(interferencia);
		} else {
			console.error("GeographicTableView não definida.");
		}

		// Atualiza limites autorizados
		if (typeof LimitsTableView !== 'undefined') {
			new LimitsTableView().update(interferencia);
		} else {
			console.error("LimitsTableView não definida.");
		}

	}

}

