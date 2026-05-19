/**
 * 
 * @nome Parecer de Outorga Prévia
 * @descricao Dados de demanda de água e localização
 * @diretorio 2
 * @arquivo water-data-view.js
 * @id 
 *
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
          <p>10. Considerando que o ponto de captação está localizado no subsistema <span class="inter-sistema"></span>, o limite a ser outorgado é de 80% da 
          vazão média do subsistema, pois o empreendimento está localizado em área rural. A demanda solicitada pelo usuário, 
          ajustada segundo os valores de referência da Resolução nº 18/2020, é de 
          <b><span class="dem-l-dia"></span> L/dia</b>, 
          vazão de <b><span class="inter-vazao-outorgavel"></span> (L/h)</b>, 
          sendo estimado tempo de captação 
          máximo de <b><span class="dem-h-dia"></span>h/dia</b>. O ato de outorga seguirá as seguintes características:
          </p>
          <br>
          <p>I -  Dados da captação:</p>

          <div id="geographic-table-view"></div>
          <br>
          <p>II - Demanda a ser outorgada:</p>

          <div id="limits-table-view"></div>
          </br>
        </div>
        
      `;
		if (this.div !== null) this.div.innerHTML = innerHTML;

	}

	update(interferencia) {

		// Demanda de abril, que está sempre preenchida
		let aprilDem = interferencia?.demandas.find(dem => dem.tipoFinalidade.id === 2 && dem.mes === 4);
		
		let _items = document.getElementsByClassName('dem-l-dia');
		// Vazão (Litro/Hora)
		Array.from(_items).forEach(item => {
			item.innerHTML = new DemandaModel().formatNumber(aprilDem?.vazao) || 'XXX';
		});

		let __items = document.getElementsByClassName('dem-h-dia');
		// Tempo (Horas/Dia)
		Array.from(__items).forEach(item => {
			item.innerHTML = aprilDem?.tempo || 'XXX';
		});

		let ___items = document.getElementsByClassName('dem-p-dia');
		// Periodo (Dias/Mês)
		Array.from(___items).forEach(item => {
			item.innerHTML = aprilDem?.periodo || 'XXX';

		});

		let vazaoOutorgavel = interferencia?.vazaoOutorgavel || 'XXX'

		let ____items = document.getElementsByClassName('inter-vazao-outorgavel');
		// Converte o resultado para array e atualiza
		Array.from(____items).forEach(item => {
			item.innerHTML = new DemandaModel().formatNumber(vazaoOutorgavel) || 'XXX';

		});

		let _____items = document.getElementsByClassName('inter-sistema');

		// Converte o resultado para array e atualiza
		Array.from(_____items).forEach(__el => {
			__el.innerHTML = new InterferenciaModel().getSistemaSubsistema(interferencia) || 'XXX';

		});

	}
}