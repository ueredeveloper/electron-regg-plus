/**
* @nome Outorga de Modificação
* @descricao Assunto do Despacho
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
			<div style="float:right;width:40rem">
				<p>
				Modifica os termos de direito de uso de água subterrânea concedida
				ao <span class="us-nome"></span>, para fins de <span class="inter-finalidades"></span>.
				</p>
			</div>
		`;
		this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		Array.from(document.getElementsByClassName('us-nome')).forEach(el => {
			el.innerHTML = documento.usuarios[0]?.nome || 'XXX';
		});

		Array.from(document.getElementsByClassName('inter-finalidades')).forEach(el => {
			el.innerHTML = new FinalidadeModel().getPurpouseString(interferencia.finalidades);
		});
	}
}
