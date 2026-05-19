/**
 * @nome Ações de Botões de Teste
 * @descricao Ações de verificação dos métodos
 * @diretorio actions
 * @arquivo script.js
 * @id 
 *
 *
 */

class ActionsView {

	constructor() {
		this.div = document.getElementById('actions');
		this.render();
		this.renderActions();
	}
	render() {

		let index = `
            <div style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%);">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <label style="margin: 10px; background-color: #555; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">Template 1</label>
                    <button id="btn-update-geo-table" style="margin: 5px; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">Atualiza Tabela Geográfica</button>
                    <button id="btn-update-limits-table" style="margin: 5px; padding: 10px 15px; background-color: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">Atualiza Tabela de Limites</button>
                    <button id="btn-update-all" style="margin: 5px; padding: 10px 15px; background-color: #FF5722; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">Editar Tudo com o Objeto Documento</button>

                    <label style="margin: 10px; background-color: #555; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">Template 2</label>
                    <button id="btn-update-object-view" style="margin: 5px; padding: 10px 15px; background-color: #FFC107; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">Editar Objetivo Parecer</button>
                    
                    <label style="margin: 10px; background-color: #555; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">Template 4 - Parecer de Out. De Dir.</label>
                    <button id="btn-update-4" style="margin: 5px; padding: 10px 15px; background-color: #FFC107; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">Editar Parecer Definitivo</button>
                 
                    </div>
            </div>

            `;
		this.div.innerHTML = index;
	}

	renderActions() {

		// Atualiza tabela com informações do ponto (latitude, longitude, bacia e subbacia
		document.getElementById('btn-update-geo-table').onclick = function() {

			let interferencia = new DocumentoModel().getSample().endereco.interferencias[0];
			new GeographicTableView().update(interferencia);
		};
		// Atualiza os limites outorgáveis
		document.getElementById('btn-update-limits-table').onclick = function() {

			let interferencia = new DocumentoModel().getSample().endereco.interferencias[0];

			new LimitsTableView().update(interferencia);
		};

		// Atualiza os limites outorgáveis
		document.getElementById('btn-update-all').onclick = function() {

			if (!documento) {
				documento = new DocumentoModel().getSample()
			}

			let interferencia = documento.endereco.interferencias[0];
	
			utils.updateHtmlDocument(documento, interferencia)
		};



		// Atualiza os objetivo do parecer, adicionando nome, endereço e finalidades
		document.getElementById('btn-update-object-view').onclick = function() {

			if (!documento) {
				documento = new DocumentoModel().getSample();
			}

			let interferencia = documento.endereco.interferencias[0];


			new ObjectView().update(documento, interferencia);
			new AnalyseView().update(documento, interferencia);
			new WellInfoView().update(interferencia);

			// Finalidades requeridas
			new PurpouseRequestedTableView(documento, 1, interferencia, 'tbl-finalidades-requeridas');
			// Finalidades autorizadas
			new PurpouseAuthorizedTableView(documento, 2, interferencia, 'tbl-finalidades-autorizadas');

			new ExploitableReserveView().update(interferencia);

			new GeographicTableView().update(interferencia);
			new LimitsTableView().update(interferencia);

		};



		// Atualiza os objetivo do parecer, adicionando nome, endereço e finalidades
		document.getElementById('btn-update-4').onclick = function() {

			if (!documento) {
				documento = new DocumentoModel().getSample();
			}


			let interferencia = documento.endereco.interferencias[0];

			new SubjectView().update(documento, interferencia);
			new ObjectView().update(documento, interferencia);
			new WellInfoView().update(interferencia);
			// Finalidades requeridas
			new PurpouseTableView(documento, 1, interferencia, 'tbl-request-purpouse-view');

			// Finalidades autorizadas
			new PurpouseTableView(documento, 2, interferencia, 'tbl-authorized-purpouse-view');

			new ExploitableReserveView().update(interferencia);
			new LimitsTableView().update(interferencia);

		};

	}



}