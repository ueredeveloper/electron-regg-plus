/**
* @nome Despacho de Transferência de Outorga de Direito de Uso
* @descricao Assunto do Despacho
* @diretorio 10
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
			<div style="float:right;width:40rem">
				<p>
				Transfere os termos de direito de uso de água subterrânea
				ao <span class="us-nome"></span>, para fins de <span class="inter-finalidades"></span>.
				</p>
			</div>
		`;
		this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];

		Array.from(document.getElementsByClassName('us-nome')).forEach(el => {
			el.innerHTML = usuario?.nome || 'XXX';
		});

		Array.from(document.getElementsByClassName('inter-finalidades')).forEach(el => {
			el.innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
		});
	}
}
