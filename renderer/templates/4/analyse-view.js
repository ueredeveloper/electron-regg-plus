/**
* @nome Parecer de Outorga De Direito de Uso
* @descricao Análise do parecer
* @diretorio 4
* @arquivo analyse-view.js
* @id 
*
*
*/

class AnalyseView {
	constructor() {
		this.div = document.getElementById('analyse-view');
		this.render();
	}

	//classes: inter-subsistema inter-bh inter-uh

	render() {
		let innerHTML = `
			<div>
			<p><strong>III. DA ANÁLISE</strong></p>
			<p></p>
			<p>4. Outorga anterior: Despacho nºou Regularização</p>
			<p></p>
            <p><br></p>
			<p>5. O ponto de captação analisado está localizado no subsistema <span class="inter-sistema"></span>, 
            Unidade Hidrográfica do <span class="inter-uh"></span>, Bacia Hidrográfica do <span class="inter-bh"></span>.
            </p>
			</div><div>
			<p></p><p><br></p>

			<h3>I. Localização da propriedade e do poço:</h3>
			<p></p><p></p>

			<p>Figura 01: croqui de localização da propriedade.</p>
			<p><br><br></p>

			<p>Figura 02: croqui de localização do poço.</p>
			<p><br><br></p>

			<p>Figura 03: Croqui da área com existência de irrigação (Frutífera) em 31/05/2016.</p>
			<p><br><br></p>

			<p>Figura 04: Croqui da área atendida pela CAESB - Sistema de abastecimento da área (Portal Atlas Caesb).</p> 
			<p><br><br></p>

			<!--<p>II. Dados do poço:</p>-->
            <!-- Informações do poço -->
			<div id="well-info-view"></div>
			

			<div>
			<p></p>

			<p>6. As finalidades de uso e respectivas demandas solicitadas estão dispostos na tabela abaixo, organizadas por tipo de processo:</p>

			<p></p><p><br></p>

			<p>Tabela 01: Finalidades e demandas requeridas.</p>

            <!-- Finalidades Requeridas -->
			<div style="display:flex; justify-content: center;" id="tbl-request-purpouse-view"></div>

			<p><br></p>

			<div style="align:center" id="purpouse-legal-basis-view"></div>

			<p>
			<br>
			8. As demandas solicitadas e devidamente justificadas para cada finalidade de uso foram analisadas considerando a 
			disponibilidade hídrica da reserva explotável dos subsistemas subterrâneos. As demandas que apresentaram ausência de 
			justificativas para as estimativas de uso, foram ajustadas às recomendações da Resolução nº 18/2020:
			</p>

			<p><br></p>

			<p>Tabela 02: Finalidades e demandas ajustadas, conforme a Resolução nº 18/2020.</p>

            <!-- Finalidades Autorizadas -->
            <div id="tbl-authorized-purpouse-view" style="display:flex; justify-content: center;"></div>

			<br>
			<p>9. A reserva explotável e balanço hídrico do subsistema subterrâneo apresenta dados favoráveis, 
			considerando a inclusão das demandas requeridas, conforme tabelas abaixo:
			</p>

			<p>Figura 05: Reserva explotável e balanço hídrico do subsistema <span class="inter-sistema"></span>.</p>
        
        	</br>
        	</br>
			<p>10.&nbsp;As demandas poderão ser outorgadas pela Adasa, desde que observados os limites estabelecidos pela 
			Resolução/ADASA nº 16/2018 e valores da demanda ajustados na tabela 2.</p>
			<p><br></p>

			<p>Resolução/ADASA nº 16/2018</p>

			<p style="margin-left:30.0pt;">Art. 5º. Ficam estabelecidos os seguintes limites a serem outorgados para as captações de água subterrânea:</p>

			<p style="margin-left:30.0pt;">I - Até 80% da vazão do teste de bombeamento nas porções dos aquíferos localizadas em áreas rurais, com tempo de captação máximo de 20 h por dia;</p>

			<p style="margin-left:30.0pt;">II - Até 50% da vazão do teste de bombeamento nas porções dos aquíferos localizados em áreas urbanas, com tempo de captação máximo de 20 h por dia;</p>

			<p style="margin-left:30.0pt;">III - Nos casos de abastecimento humano, os limites dos incisos I e II poderão atingir até 90% da vazão nominal do poço;</p>

			<p style="margin-left:30.0pt;">IV- Na ausência de dados de testes de bombeamento, serão consideradas as vazões médias regionais e período máximo de captação de 20 (vinte) horas por dia.</p>

			<p style="margin-left:30.0pt;">&nbsp;</p>

			<!-- Ponto de Captação e Limites Outorgados -->
			<div id="water-data-view"></div>
			<br>
			<div id="limits-table-view"></div>

			<p>12. As solicitações de renovação de outorga protocoladas fora do prazo previsto no parágrafo único, art. 27 
			da Resolução/Adasa n° 350/2006 foram consideradas neste parecer como novas outorgas.</p>

			</br>
 			<p>13. Cabe ressaltar que conforme o art. 39 da Resolução Adasa n° 350/2006, o outorgado deverá se 
			responsabilizar pelo padrão de qualidade e potabilidade da água a partir da retirada do aquífero subterrâneo.</p>

			</br>
 			<p>14. Com base no perfil construtivo e geológico do poço, bem como na perfilagem ótica obtida por inspeção de vídeo, 
 			indica que a captação da água ocorre no domínio freático/poroso. Essas características estão em conformidade com 
 			a Resolução nº 16, de 03 de fevereiro de 2023.</p>

			</br>
			<p>15. A documentação solicitada foi atendida e sustenta a solicitação de outorga de direito de uso  de água 
			subterrânea.</p>

			</div>

		`
		if (this.div !== null) this.div.innerHTML = innerHTML;

		new PurpouseLegalBasisView();
		new WellInfoView();
		new WaterDataView();
		new GeographicTableView();
		new LimitsTableView();

		new ConclusionView();

	}
	update(documento, interferencia) {

		let finalidades = interferencia.finalidades;
		let usuario = documento.usuarios[0];

		let _items = document.getElementsByClassName('inter-finalidades');

		Array.from(_items).forEach(element => {
			let innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
			element.innerHTML = innerHTML
		});

		let __items = document.getElementsByClassName('us-nome');
		// Converte o resultado para array e atualiza
		Array.from(__items).forEach(element => {
			element.innerHTML = new UsuarioModel().getNome(usuario);
		});
		let ___items = document.getElementsByClassName('us-cpf-cnpj');
		// Converte o resultado para array e atualiza
		Array.from(___items).forEach(element => {
			element.innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj);
		});

		let ____items = document.getElementsByClassName('inter-tipo-poco');

		Array.from(____items).forEach(element => {
			element.textContent = new InterferenciaModel().getTipoPoco(interferencia)
		});

		let _____items = document.getElementsByClassName('inter-uh');

		Array.from(_____items).forEach(element => {
			element.innerHTML = new InterferenciaModel().getUnidadeHidrografica(interferencia) || 'vvv';
		});

		let ______items = document.getElementsByClassName('inter-sistema');

		// Converte o resultado para array e atualiza
		Array.from(______items).forEach(__el => {
			__el.innerHTML = new InterferenciaModel().getSistemaSubsistema(interferencia) || 'XXX';

		});

		new WaterDataView().update(interferencia)

	}
}