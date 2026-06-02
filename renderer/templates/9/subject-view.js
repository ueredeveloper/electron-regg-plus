/**
* @nome Despacho de Indeferimento de Outorga
* @descricao Assunto do Despacho
* @diretorio 9
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
			<div style="float:right;width:40rem">
				<p>
				Indefere a <span class="us-nome"></span>, a outorga de direito de uso de
				recursos hídricos subterrânea, para fins de <span class="inter-finalidades"></span>.
				</p>
			</div>
		`;
		this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];

		let _items = document.getElementsByClassName('us-nome');

		Array.from(_items).forEach(element => {
			element.innerHTML = usuario?.nome || 'XXX';
		});

		let __items = document.getElementsByClassName('inter-finalidades');

		Array.from(__items).forEach(element => {
			element.innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
		});

	}
}
