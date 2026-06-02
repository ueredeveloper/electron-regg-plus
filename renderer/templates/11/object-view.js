/**
* @nome Parecer de Transferência de Outorga de Direito de Uso
* @descricao Objeto do parecer
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
				<div>
					<p style="text-align: justify;"><strong>I. DO OBJETO</strong></p>
					<p></p>
					<p>
					1. Em XXX, foi protocolado requerimento de transferência de outorga de direito
					de uso de água subterrânea, por meio de 01 (um) poço <span class="inter-tipo-poco"></span> em nome de
					<b><span class="us-nome"></span></b>,
					CPF/CNPJ: <b><span class="us-cpf-cnpj"></span></b>,
					no endereço: <span class="end-logradouro"></span> - Distrito Federal,
					para fins de <span class="inter-finalidades"></span>.
					</p>
					<br>
					<p>
					2. O presente processo refere-se à solicitação de transferência de outorga de direito
					de uso de água subterrânea, por meio de poço <span class="inter-tipo-poco"></span>,
					destinada à atividade <span class="inter-finalidades"></span>,
					com demanda total estimada em <span class="dem-l-dia"></span> L/dia.
					A outorga anterior foi concedida à empresa <span class="inter-us-anterior-nome"></span>,
					no âmbito do Processo nº <span class="inter-processo-anterior"></span>,
					por meio do <span class="inter-despacho-tipo">Despacho</span> nº <span class="inter-despacho-numero"></span>,
					de <span class="inter-despacho-data"></span>,
					publicado no Diário Oficial do Distrito Federal nº <span class="inter-dodf-numero"></span>,
					de <span class="inter-dodf-data"></span>,
					com validade de <span class="inter-validade-anterior"></span> anos,
					prorrogada automaticamente por igual período, nos termos da Resolução nº 07, de 22 de maio de 2019,
					em razão da inexistência de solicitação de alteração da demanda outorgada. Assim, o ato permanece
					válido até <span class="inter-validade-expiracao"></span>.
					Ressalta-se que o empreendimento é atendido pela rede pública de abastecimento da Companhia de
					Saneamento Ambiental do Distrito Federal (CAESB). Diante do exposto, a presente solicitação será
					objeto de análise no parecer técnico a ser elaborado.
					</p>
				</div>
		`;
		if (this.div !== null) this.div.innerHTML = innerHTML;
	}

	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];
		let endereco = documento.endereco;

		Array.from(document.getElementsByClassName('inter-finalidades')).forEach(el => {
			el.innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
		});

		Array.from(document.getElementsByClassName('us-nome')).forEach(el => {
			el.innerHTML = usuario.nome;
		});

		Array.from(document.getElementsByClassName('us-cpf-cnpj')).forEach(el => {
			el.innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj);
		});

		Array.from(document.getElementsByClassName('inter-tipo-poco')).forEach(el => {
			el.textContent = new InterferenciaModel().getTipoPoco(interferencia);
		});

		Array.from(document.getElementsByClassName('end-logradouro')).forEach(el => {
			el.innerHTML = new EnderecoModel().getLogradouro(endereco);
		});

		const aprilFlow = interferencia?.demandas.find(dem => dem.mes === 4);
		Array.from(document.getElementsByClassName('dem-l-dia')).forEach(el => {
			el.innerHTML = aprilFlow?.vazao || 'XXX';
		});
	}
}
