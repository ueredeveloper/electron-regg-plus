/**
* @nome Parecer de Renovação de Outorga de Direito de Uso
* @descricao Objeto do parecer
* @diretorio 8
* @arquivo object-view.js
* @id
*
*
*/

class ObjectView {
	constructor() {
		this.div = document.getElementById('object-view');
		this.render();
	}

	render() {
		let innerHTML = `
				<div>
					<p style="text-align: justify;">
					<strong>I. DO OBJETO</strong></p>
					<p></p>
					<p>
					1. Em XXX, foi protocolado requerimento de renovação de outorga de direito
					de uso de água subterrânea, por meio de 01 (um) poço <span class="inter-tipo-poco"></span> em nome de
					<b><span class="us-nome"></span></b>,
					CPF/CNPJ: <b><span class="us-cpf-cnpj"></span></b>,
					no endereço: <span class="end-logradouro"></span> - Distrito Federal,
					para fins de <span class="inter-finalidades"></span>.
					</p>
				</div>
		`;
		if (this.div !== null) this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];
		let endereco = documento.endereco;

		let _items = document.getElementsByClassName('inter-finalidades');

		Array.from(_items).forEach(element => {
			let innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
			element.innerHTML = innerHTML;
		});

		let __items = document.getElementsByClassName('us-nome');

		Array.from(__items).forEach(element => {
			let innerHTML = usuario.nome;
			element.innerHTML = innerHTML;
		});

		let ___items = document.getElementsByClassName('us-cpf-cnpj');

		Array.from(___items).forEach(element => {
			let innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj);
			element.innerHTML = innerHTML;
		});

		let ____items = document.getElementsByClassName('inter-tipo-poco');

        Array.from(____items).forEach(element => {
            element.textContent = new InterferenciaModel().getTipoPoco(interferencia);
        });

		let _____items = document.getElementsByClassName('end-logradouro');

		Array.from(_____items).forEach(element => {
			element.innerHTML = new EnderecoModel().getLogradouro(endereco);
		});

	}
}
