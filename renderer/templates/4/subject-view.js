/**
* @nome Parecer de Outorga De Direito de Uso
* @descricao Assunto do parecer
* @diretorio 4
* @arquivo subject-view.js
* @id 
*
*
*/

class SubjectView {
	constructor() {
		this.div = document.getElementById('subject-view');
		this.render();
	}

	render() {

		let innerHTML = `
				<p style="float:right;width:40rem">Assunto: análise de requerimento de outorga de 
				direito de uso de recursos hídricos subterrâneo, 
				por meio de 01 (um) poço <span class="inter-tipo-poco"></span> para fins de 
				<span class="inter-finalidades"></span>.
				</p>
		`;

		if (this.div !== null) this.div.innerHTML = innerHTML;
	}
	update(documento) {

		let tipoPoco = documento.endereco.interferencias[0].tipoPoco;
		let finalidades = documento.endereco.interferencias[0].finalidades;

		let _items = document.getElementsByClassName('int-tipo-poco');

    	Array.from(_items).forEach(element => {
    		let innerHTML = tipoPoco?.descricao?.toLowerCase() || 'XXX';
    		element.innerHTML = innerHTML;
    	});

		let __items = document.getElementsByClassName('inter-finalidades');

    	Array.from(__items).forEach(element => {
    		let innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
    		element.innerHTML = innerHTML
    	});

	}
}