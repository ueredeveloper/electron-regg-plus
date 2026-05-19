/**
 * 
* Assunto do parecer.
* @nome Parecer de Outorga Prévia
* @descricao Assunto do Parecer
* @diretorio 2
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
				<p style="float:right;width:40rem">Assunto: análise de requerimento de outorga prévia para 
                reservar o direito de uso de água subterrânea por meio de 01 (um) poço 
                <span class="inter-tipo-poco"></span> para fins de 
				<span class="inter-finalidades"></span>.
				</p>		
		`;
		if (this.div !== null) this.div.innerHTML = innerHTML;

	}
	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;

		let __items = document.getElementsByClassName('inter-finalidades');

		Array.from(__items).forEach(element => {
			let innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
			element.innerHTML = innerHTML
		});

	}
}