/**
 * @nome Registro de Uso Subterrâneo
 * @descricao Arquivo principal .js
 * @diretorio 5
 * @arquivo script.js
 * @id 
 * */


function App() {

	const appDiv = document.getElementById("app");

	appDiv.innerHTML = `
		<div style="display:flex;flex-direction:column;">
			<!-- não utilizada em registor <div id="subject-view"></div> -->
			<div id="object-view"></div>

			<b>I - Dados da Captação:</b>
				<div align="justify" id="geographic-table-view"></div>

			<p>Art. 2º A demanda registrada mencionada no art. 1º é a seguinte:</p>
			
			<b>II - Demanda a ser registrada:</b>
				<div id="limits-table-view"></div>

			<p>&nbsp;</p>

			<div id="grant-requirements"></div>
			<div id="chief-signature-view"></div>
		</div>`;
}
var documento;
var utils;

document.addEventListener('DOMContentLoaded', function () {

	App();
	
	utils = new Utils();

	
	//new SubjectView(); // não é utilizado em registro
	new ObjectView();
	new LimitsTableView();
	new GrantRequirementsView();
	new ChiefSignatureView();
	new ActionsView();
	
});
