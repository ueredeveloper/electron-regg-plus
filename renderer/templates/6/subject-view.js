/**
* Assunto do parecer.
* @nome Outorga Prévia - Poço Raso
* @descricao Assunto do Despacho
* @diretório 6
* @arquivo subject-view.js
* @id 
*/

class SubjectView {
	constructor() {
		this.div = document.getElementById('subject-view');
		this.render();
	}

	// classes: inter-finalidades int-tipo-poco

	render() {
		let innerHTML = `
			<div style="float:right;width:40rem">
				<p>Emite outorga prévia para reservar o direito de uso de água subterrânea a <span class="us-nome"></span>, 
				para fins de <span class="inter-finalidades"></span>.
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