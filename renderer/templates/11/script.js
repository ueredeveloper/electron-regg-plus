/**
 * @arquivo script.js
 * @diretorio 11
 * @descricao Arquivo principal .js
 * @nome Parecer de Transferência de Outorga de Direito de Uso
 * @id
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
			</div>
			`;

	new SubjectView();
	new ObjectView();
	new LegalBasisView();
	new AnalyseView();
	new ConclusionView();
	new SignatureView();
}

var documento;
var utils;

document.addEventListener('DOMContentLoaded', function () {
	utils = new Utils();
	App();
});
