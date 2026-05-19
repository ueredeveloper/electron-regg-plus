/**
 * 
 * @arquivo object-view.js
 * @diretorio 2
 * @descricao Parecer de Outorga Prévia
 * @nome Parecer de Outorga Prévia
 * @id 
 *
 *
 */


class ObjectView {

	constructor() {
		this.div = document.getElementById("object-view");
		this.render();
	}

	render() {
		let innerHTML = `
    	<h2>I. DO OBJETO</h2>
    	
    	<p>1. Em XXX, foi protocolado requerimento relacionado a 
    	<span class="inter-tipo-outorga"></span> para reservar o direito de uso de água subterrânea, 
    	por meio de 01 (um) poço <span class="inter-tipo-poco"></span> em nome de 
    	<b><span class="us-nome"></span></b>, 
    	CPF/CNPJ: <b><span class="us-cpf-cnpj"></span></b>, 
    	no endereço: <span class="end-logradouro"></span></span>
    	 - Distrito Federal, para fins de <span class="inter-finalidades"></span>.</p>
    `;
		if (this.div !== null) this.div.innerHTML = innerHTML;

	}

	update(documento, interferencia) {

		let usuario = documento.usuarios[0];
		let endereco = documento.endereco;
		let finalidades = interferencia.finalidades;

		let _items = document.getElementsByClassName('us-nome');
		// Converte o resultado para array e atualiza
		Array.from(_items).forEach(element => {
			element.innerHTML = new UsuarioModel().getNome(usuario);
		});
		let __items = document.getElementsByClassName('us-cpf-cnpj');
		// Converte o resultado para array e atualiza
		Array.from(__items).forEach(element => {
			element.innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj);
		});

		let ___items = document.getElementsByClassName('end-logradouro');
		// Converte o resultado para array e atualiza
		Array.from(___items).forEach(element => {
			element.innerHTML = new EnderecoModel().getLogradouro(endereco);
		});

		let ____items = document.getElementsByClassName('inter-finalidades');
		// Converte o resultado para array e atualiza
		Array.from(____items).forEach(element => {
			element.innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
		});

		// Tipo de Poço
		let _____items = document.getElementsByClassName('inter-tipo-poco');
		Array.from(_____items).forEach(element => {
			element.textContent = new InterferenciaModel().getTipoPoco(interferencia)
		});


	}
}

