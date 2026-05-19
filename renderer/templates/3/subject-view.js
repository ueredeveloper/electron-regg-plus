/**
* @nome Outorga De Direito de Uso
* @descricao Assunto do Despacho
* @diretorio 3
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
				<p class="outorga-uso">
				Emite outorga de direito de uso de água subterrânea a <span class="us-nome"></span>, 
				para fins de <span class="inter-finalidades"></span>.
				</p>
			</div>
		`;
		this.div.innerHTML = innerHTML;

	}
	update(documento, interferencia){

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];

		let _items = document.getElementsByClassName('us-nome');

    	Array.from(_items).forEach(element => {
    		let innerHTML = usuario?.nome || 'XXX';
    		element.innerHTML = innerHTML
    	});
		
		let __items = document.getElementsByClassName('inter-finalidades');

    	Array.from(__items).forEach(element => {
    		let innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
    		element.innerHTML = innerHTML
    	});

	}
}