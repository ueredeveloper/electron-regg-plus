/**
 * @nome Outorga de Modificação
 * @descricao Objeto do despacho
 * @diretorio 11
 * @arquivo object-view.js
 * @id
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
        Art. 1º Modificar os termos de direito de uso de água subterrânea concedida ao <b><span class="us-nome"></span></b>,
        CPF/CNPJ n.º <b><span class="us-cpf-cnpj"></span></b>,
        por meio da <span class="inter-despacho-tipo">Outorga</span> n.º <span class="inter-despacho-numero"></span>,
        de <span class="inter-despacho-data"></span>,
        por meio de 01 (um) poço <span class="inter-tipo-poco"></span>, para fins de <span class="inter-finalidades"></span>,
        localizado no endereço: <span class="end-logradouro"></span> – Distrito Federal,
        com as novas características:
        </p>
        </div>
        `;

		this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];
		let endereco = documento.endereco;

		Array.from(document.getElementsByClassName('proc-anexo')).forEach(el => {
			el.innerHTML = documento?.processo?.anexo?.numero || 'XXX';
		});

		Array.from(document.getElementsByClassName('us-nome')).forEach(el => {
			el.innerHTML = new UsuarioModel().getNome(usuario);
		});

		Array.from(document.getElementsByClassName('us-cpf-cnpj')).forEach(el => {
			el.innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj);
		});

		Array.from(document.getElementsByClassName('inter-tipo-poco')).forEach(el => {
			el.textContent = new InterferenciaModel().getTipoPoco(interferencia);
		});

		Array.from(document.getElementsByClassName('inter-finalidades')).forEach(el => {
			el.innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
		});

		Array.from(document.getElementsByClassName('end-logradouro')).forEach(el => {
			el.innerHTML = new EnderecoModel().getLogradouro(endereco);
		});
	}
}
