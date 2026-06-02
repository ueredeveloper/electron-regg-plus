/**
 * @nome Despacho de Indeferimento de Outorga
 * @descricao Objeto do despacho
 * @diretorio 9
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
        <div align="justify">
        <p>
        O SUPERINTENDENTE DE RECURSOS HÍDRICOS DA AGÊNCIA REGULADORA DE ÁGUAS, ENERGIA E SANEAMENTO BÁSICO DO DISTRITO FEDERAL –
        ADASA, no uso de suas atribuições regimentais e com base na competência que lhe foi delegada pela Diretoria Colegiada,
        nos termos da Resolução nº 02, de 25 de janeiro de 2019, c/c Portaria nº 49, de 02 de maio de 2019 e com base no art. 12 da Lei nº 2.725, de 13 de
        junho de 2001, e inciso VII do art. 23 da Lei nº 4.285, de 26 de dezembro de 2008, tendo em vista o que consta do Processo SEI N.º
        <b><span class="proc-anexo"></span></b>, resolve:
        </p>

        <p>
        Art. 1º. Indeferir à <b><span class="us-nome"></span></b>,
        CPF/CNPJ: <b><span class="us-cpf-cnpj"></span></b>, o direito de uso de água subterrânea por meio de 01 (um) poço
        <span class="inter-tipo-poco"></span>, para fins de <span class="inter-finalidades"></span>,
        localizado no <span class="end-logradouro"></span> – Distrito Federal,
        em conformidade com o Artigo 19 da Resolução ADASA nº 350/2006 e o artigo 6°, § 1º da Resolução ADASA nº 16/2018 –
        norma complementar à Resolução nº 350/2006.
        </p>

        <p>
        Art. 2º. O poço <span class="inter-tipo-poco"></span> deverá ser obturado no prazo de 90 (noventa) dias,
        contados da publicação do extrato do despacho no Diário Oficial do Distrito Federal.
        </p>
        </div>
        `;

		this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];
		let endereco = documento.endereco;

		let _items = document.getElementsByClassName('proc-anexo');

		Array.from(_items).forEach(element => {
			element.innerHTML = documento?.processo?.anexo?.numero || 'XXX';
		});

		let __items = document.getElementsByClassName('us-nome');

		Array.from(__items).forEach(element => {
			element.innerHTML = new UsuarioModel().getNome(usuario);
		});

		let ___items = document.getElementsByClassName('us-cpf-cnpj');

		Array.from(___items).forEach(element => {
			element.innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj);
		});

		let ____items = document.getElementsByClassName('inter-tipo-poco');

		Array.from(____items).forEach(element => {
			element.textContent = new InterferenciaModel().getTipoPoco(interferencia);
		});

		let _____items = document.getElementsByClassName('inter-finalidades');

		Array.from(_____items).forEach(element => {
			element.innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
		});

		let ______items = document.getElementsByClassName('end-logradouro');

		Array.from(______items).forEach(element => {
			element.innerHTML = new EnderecoModel().getLogradouro(endereco);
		});

	}
}
