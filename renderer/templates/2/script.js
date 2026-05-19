/**
 * 
 * @nome Parecer de Outorga Prévia
 * @descricao Arquivo principal .js
 * @diretorio 2
 * @arquivo script.js
 * @id 
 *
 *
 */


function App() {

	const appDiv = document.getElementById("app");

	appDiv.innerHTML = `
			<div style="display:flex; flex-direction:column">
				<div id="subject-view"></div>
				<br>
				<div id="object-view"></div>
				<br>
				<div id="legal-basis-view"></div>
				<br>
				<div id="analyse-view"></div>
				<br>
				<div id="conclusion-view"></div>
				<br>
				<div id="signature-view"></div>
				<br>
			</div>
			`;

	new SubjectView();
	new ObjectView();
	new LegalBasisView();
	new ActionsView();
	new AnalyseView();
	new ConclusionView();
	new SignatureView();


}

// Objetos do serviço
var documento;
// Classe de conexão com o java e ações de atualização de renderização
var utils;

document.addEventListener('DOMContentLoaded', function () {

	utils = new Utils();
	
	App();
});