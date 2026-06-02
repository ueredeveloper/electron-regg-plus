/**
* @nome Parecer de Transferência de Outorga de Direito de Uso
* @descricao Assunto do parecer
* @diretorio 11
* @arquivo subject-view.js
* @id
*/

class SubjectView {
	constructor() {
		this.div = document.getElementById('subject-view');
		this.render();
	}

	render() {
		let innerHTML = `
				<p style="float:right;width:40rem">Assunto: análise de requerimento de transferência de outorga de
				direito de uso de recursos hídricos subterrâneo,
				por meio de 01 (um) poço <span class="inter-tipo-poco"></span> para fins de
				<span class="inter-finalidades"></span>.
				</p>
		`;
		if (this.div !== null) this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		Array.from(document.getElementsByClassName('inter-tipo-poco')).forEach(el => {
			el.innerHTML = interferencia?.tipoPoco?.descricao?.toLowerCase() || 'XXX';
		});

		Array.from(document.getElementsByClassName('inter-finalidades')).forEach(el => {
			el.innerHTML = new FinalidadeModel().getPurpouseString(interferencia.finalidades);
		});
	}
}
