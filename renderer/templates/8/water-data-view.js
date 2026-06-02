/**
 * @id
 * @nome Parecer de Renovação de Outorga de Direito de Uso
 * @descricao Dados hídricos do parecer
 * @diretorio 8
 * @arquivo water-data-view.js
 *
 */

class WaterDataView {
	constructor() {
		this.div = document.getElementById('water-data-view');
		this.render();
	}

	render() {
		const innerHTML = `
        <div>
          <p>11. Considerando que o ponto de captação está localizado no subsistema <span class="inter-sistema"></span>,
          o limite de outorga corresponde a 50% da vazão do teste de bombeamento, pois o empreendimento está localizado
          em área urbana. <b>A demanda total solicitada pelo usuário não poderá ser outorgada, uma vez que excede o
          limite máximo de 20 (vinte) horas de bombeamento</b>. Segundo os valores de referência estabelecidos na
          Resolução nº 18/2020, sendo a seguinte:
          </p>
          <p>&nbsp;</p>
          <p style="margin-left: 2em;">Poço 01: demanda de <b><span class="dem-l-dia"></span> L/dia</b>,
          vazão de <b><span class="inter-vazao-outorgavel"></span> (L/h)</b>,
          sendo estimado tempo de captação máximo de <b><span class="dem-h-dia"></span>h/dia</b>.</p>
          <p>&nbsp;</p>
          <p>O ato de outorga seguirá as seguintes características:</p>
          <p>&nbsp;</p>
          <p>I - Dados da captação:</p>

          <div id="geographic-table-view"></div>
          <br>
          <p>II - Demanda a ser outorgada:</p>

          <div id="limits-table-view"></div>
        </div>

      `;
		if (this.div !== null) this.div.innerHTML = innerHTML;
	}

	update(interferencia) {

		let aprilDem = interferencia?.demandas.find(dem => dem.tipoFinalidade.id === 2 && dem.mes === 4);

		let _items = document.getElementsByClassName('dem-l-dia');

		Array.from(_items).forEach(item => {
			item.innerHTML = new DemandaModel().formatNumber(aprilDem?.vazao) || 'XXX';
		});

		let __items = document.getElementsByClassName('dem-h-dia');

		Array.from(__items).forEach(item => {
			item.innerHTML = aprilDem?.tempo || 'XXX';
		});

		let ___items = document.getElementsByClassName('dem-p-dia');

		Array.from(___items).forEach(item => {
			item.innerHTML = aprilDem?.periodo || 'XXX';
		});

		let vazaoOutorgavel = interferencia?.vazaoOutorgavel || 'XXX';

		let _____items = document.getElementsByClassName('inter-vazao-outorgavel');

		Array.from(_____items).forEach(item => {
			item.innerHTML = new DemandaModel().formatNumber(vazaoOutorgavel) || 'XXX';
		});

		let ______items = document.getElementsByClassName('inter-sistema');

		Array.from(______items).forEach(el => {
			el.innerHTML = new InterferenciaModel().getSistemaSubsistema(interferencia) || 'XXX';
		});

	}
}
