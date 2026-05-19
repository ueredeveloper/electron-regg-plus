/**
* @nome Parecer de Outorga De Direito de Uso
* @descricao Objeto do parecer
* @diretorio 4
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

	// classes: tipo de poço: type-well

	render() {
		let innerHTML = `
				<div>
					<p style="text-align: justify;">
					<strong>I. DO OBJETO</strong></p>
					<p></p>
					<p>
					1. Em XXX, foi protocolado requerimento de outorga de direito 
					de uso de água subterrânea, por meio de 01 (um) poço <span class="inter-tipo-poco"></span> em nome de 
					<b><span class="us-nome"></span></b>, 
					CPF/CNPJ: <b><span class="us-cpf-cnpj"></span></b>, 
					no endereço: <span class="end-logradouro"></span> - Distrito Federal, 
					para fins de <span class="inter-finalidades"></span>.
					</p>
					<br>
					<p>
					2. Trata o presente processo de outorga de direito de uso de água subterrânea por meio de 01 (um) poço <span class="inter-tipo-poco"></span>, para fins de <span class="inter-finalidades"></span> e demanda total de <span class="dem-l-dia"></span> L/dia. Foi apresentado: 
					perfilagem ótica - () onde indica características no domínio freático/<span class="inter-sistema"></span>. Conforme Resolução nº 16, de 03 
					de fevereiro de 2023, a captação de água existente no domínio freático/<span class="inter-sistema"></span> de um <span class="highlight" class="type-well"></span> é considerado 
					um <span class="highlight" class="type-well"></span>. Dessa forma, o pedido de outorga será objeto de análise do presente parecer.
					</p>
				</div>
		`;
		if (this.div !== null) this.div.innerHTML = innerHTML;

	}
	update(documento, interferencia) {
		
		let _items = document.getElementsByClassName('inter-finalidades');

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];
		let endereco = documento.endereco;

		Array.from(_items).forEach(element => {
			let innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
			element.innerHTML = innerHTML
		});

		let __items = document.getElementsByClassName('us-nome');

		Array.from(__items).forEach(element => {
			let innerHTML = usuario.nome;
			element.innerHTML = innerHTML;
		});

		let ___items = document.getElementsByClassName('us-cpf-cnpj')

		Array.from(___items).forEach(element => {
			let innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj)
			element.innerHTML = innerHTML;
		});

		let ____items = document.getElementsByClassName('inter-tipo-poco');

        Array.from(____items).forEach(element => {
            element.textContent = new InterferenciaModel().getTipoPoco(interferencia)
        });
		
		let _____items = document.getElementsByClassName('end-logradouro');
		// Converte o resultado para array e atualiza
		Array.from(_____items).forEach(element => {
			element.innerHTML = new EnderecoModel().getLogradouro(endereco);
		});
		
		// Captura a demanda de abril, que sempre está preenchida. As vazões de jan, fev, mar, nov, dez podem
		//não estar preenchidas
		let aprilFlow4 = interferencia?.demandas.find(dem => dem.mes = 4);

	    let ______items = document.getElementsByClassName('dem-l-dia');
	    // Converte o resultado para array e atualiza
	    Array.from(______items).forEach(item => {
	      item.innerHTML = aprilFlow4?.vazao || 'XXX';
	
	    });

	}
}