/**
 * @nome Parecer de Transferência de Outorga de Direito de Uso
 * @descricao Dados hídricos do parecer
 * @diretorio 11
 * @arquivo water-data-view.js
 */

class WaterDataView {
	constructor() {
		this.div = document.getElementById('water-data-view');
		this.render();
	}

	render() {
		const innerHTML = `
        <div>
          <p>11. Considerando que o ponto de captação está localizado no subsistema <span class="inter-sistema"></span>, o limite a ser outorgado é de 50% da vazão média do subsistema,
		      pois o empreendimento está localizado em área urbana. A demanda solicitada pelo usuário, ajustada segundo os valores de referência da
		      Resolução nº 18/2020 é de <b><span class="dem-l-dia"></span> L/dia</b>,
              vazão de <b><span class="inter-vazao-outorgavel"></span> (L/h)</b>,
		      sendo estimado tempo de captação máximo de <b><span class="dem-h-dia"></span>h/dia</b>. O ato de outorga seguirá as seguintes características:
          </p>
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

		const aprilDem = interferencia?.demandas.find(dem => dem.tipoFinalidade?.id === 2 && dem.mes === 4);

		Array.from(document.getElementsByClassName('dem-l-dia')).forEach(el => {
			el.innerHTML = new DemandaModel().formatNumber(aprilDem?.vazao) || 'XXX';
		});

		Array.from(document.getElementsByClassName('dem-h-dia')).forEach(el => {
			el.innerHTML = aprilDem?.tempo || 'XXX';
		});

		Array.from(document.getElementsByClassName('inter-vazao-outorgavel')).forEach(el => {
			el.innerHTML = new DemandaModel().formatNumber(interferencia?.vazaoOutorgavel) || 'XXX';
		});

		Array.from(document.getElementsByClassName('inter-sistema')).forEach(el => {
			el.innerHTML = new InterferenciaModel().getSistemaSubsistema(interferencia) || 'XXX';
		});
	}
}
