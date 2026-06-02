/**
 * @nome Despacho de Indeferimento de Outorga
 * @descricao Arquivo principal .js
 * @diretorio 9
 * @arquivo script.js
 * @id
 *
 *
 */

function App() {

	const appDiv = document.getElementById("app");

	appDiv.innerHTML = `
		<div style="display:flex;flex-direction:column;">
			<div id="subject-view"></div>
			<div id="object-view"></div>
			<div id="chief-signature-view"></div>
		</div>`;
}

var documento;
var utils;

document.addEventListener('DOMContentLoaded', function () {

	App();

	utils = new Utils();

	new SubjectView();
	new ObjectView();
	new ChiefSignatureView();

});
