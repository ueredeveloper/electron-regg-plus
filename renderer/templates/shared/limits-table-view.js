/**
 * @nome Tabela com Limites Lutorgados
 * @descricao Limites de vazão como litros/dia e m³/dia, período e tempo de
 *            captação
 * @diretorio shared
 * @arquivo limits-table-view.js
 * @id 
 *
 *
 */

class LimitsTableView {
	constructor() {
		this.div = document.getElementById('limits-table-view');
		this.render();
	}
	render() {

		let innerHTML = `
        <div style="overflow:auto;margin-left:auto;margin-right:auto;">
            <table border="1" cellspacing="0" style="margin-left:auto;margin-right:auto;width:90%">
                <tbody>
                    <tr>
                        <td colspan="2" style="text-align:center;">
                        <span style="background-color:rgb(255, 255, 255);" id="limit-type"></span></td>
                        <td style="text-align:center;">Jan</td>
                        <td style="text-align:center;">Fev</td>
                        <td style="text-align:center;">Mar</td>
                        <td style="text-align:center;">Abr</td>
                        <td style="text-align:center;">Mai</td>
                        <td style="text-align:center;">Jun</td>
                        <td style="text-align:center;">Jul</td>
                        <td style="text-align:center;">Ago</td>
                        <td style="text-align:center;">Set</td>
                        <td style="text-align:center;">Out</td>
                        <td style="text-align:center;">Nov</td>
                        <td style="text-align:center;">Dez</td>
                    </tr>
                    <tr>
                        <td rowspan="2" style="text-align:center;">
                        <p style="text-align:center;"> Q Max</p>
                        </td>
                        <td style="text-align:center;">(L/h)</td>
                        <td style="text-align:center;"><span id="q-litros-hora-jan"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-fev"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-mar"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-abr"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-mai"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-jun"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-jul"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-ago"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-set"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-out"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-nov"></span></td>
                        <td style="text-align:center;"><span id="q-litros-hora-dez"></span></td>

                    </tr>
                    <tr>
                        <td style="text-align:center;">(m<sup>3</sup>/h)</td>
                        <td style="text-align:center;"><span id="q-m3-hora-jan"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-fev"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-mar"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-abr"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-mai"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-jun"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-jul"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-ago"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-set"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-out"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-nov"></span></td>
                        <td style="text-align:center;"><span id="q-m3-hora-dez"></span></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align:center;">T. max. (h/dia)</td>
                        <td style="text-align:center;"><span id="t-horas-dia-jan"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-fev"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-mar"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-abr"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-mai"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-jun"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-jul"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-ago"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-set"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-out"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-nov"></span></td>
                        <td style="text-align:center;"><span id="t-horas-dia-dez"></span></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align:center;">V. max. dia (m<sup>3</sup>/dia)</td>
                        <td style="text-align:center;"><span id="q-m3-dia-jan"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-fev"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-mar"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-abr"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-mai"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-jun"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-jul"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-ago"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-set"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-out"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-nov"></span></td>
                        <td style="text-align:center;"><span id="q-m3-dia-dez"></span></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align:center;">P. (dias/mês)</td>
                        <td style="text-align:center;"><span id="p-dias-mes-jan"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-fev"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-mar"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-abr"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-mai"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-jun"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-jul"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-ago"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-set"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-out"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-nov"></span></td>
                        <td style="text-align:center;"><span id="p-dias-mes-dez"></span></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align:center;">V. max. mês (m<sup>3</sup>/mês)</td>
                        <td style="text-align:center;"><span id="q-m3-mes-jan"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-fev"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-mar"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-abr"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-mai"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-jun"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-jul"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-ago"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-set"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-out"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-nov"></span></td>
                        <td style="text-align:center;"><span id="q-m3-mes-dez"></span></td>
                    </tr>
                </tbody>
            </table>

            <div border="0" style="font-size:12px; margin-left:5%">
            <em>Q. max:Vazão máxima em litros por hora e em metros cúbicos por hora;&nbsp;<br>
            T. max:Tempo máximo de captação em horas por dia;&nbsp;&nbsp;<br>
            V. max. dia:Volume máximo em metros cúbicos por dia;&nbsp;<br>
            P:Dias de captação por mês; e&nbsp;&nbsp;<br>
            V. max. mês:Volume máximo em metros cúbicos por mês.&nbsp;<br>
            * 1 m³ (um metro cúbico) corresponde a 1.000 L (mil litros)&nbsp;</em>
            </div>
        
        </div>   
        `;
		if (this.div !== null) this.div.innerHTML = innerHTML;

	}
	update(interferencia) {
		
		document.getElementById('limit-type').innerHTML = new InterferenciaModel().getLimitType(interferencia);

		// Atualizar vazão (l/h)
		const months = [
			"jan", "fev", "mar", "abr", "mai", "jun",
			"jul", "ago", "set", "out", "nov", "dez"
		];
		// Filtra as finalidades autorizadas e organiza por mês, do 1 ao 12.
		let authorizedDemands = interferencia.demandas
			.filter(dem => dem.tipoFinalidade.id === 2)  // Filtra por
			// tipoFinalidade
			// com id igual a 2
			.sort((a, b) => a.mes - b.mes);  // Ordena por mês (de 1 a 12)

		months.forEach((month, index) => {

			let vazaoOutorgavel;

			if (authorizedDemands[index].vazao === 0) {
				vazaoOutorgavel = 0;
			} else {
				vazaoOutorgavel = interferencia.vazaoOutorgavel;
			}
	
			// Atualização
			// Formatação. Ex: 1000,00 para 1.000,00
			document.getElementById(`q-litros-hora-${month}`).innerText = new DemandaModel().formatNumber(vazaoOutorgavel);
			document.getElementById(`q-m3-hora-${month}`).innerText = new DemandaModel().maskDoubleToFloat(new DemandaModel().convertLitersToCubicMeters(vazaoOutorgavel));
			// Printa também zero, por isso duas interrogações (??)
			document.getElementById(`t-horas-dia-${month}`).innerText = authorizedDemands[index]?.tempo ?? 'N/A'; // Adiciona
			// índice
			document.getElementById(`q-m3-dia-${month}`).innerText = new DemandaModel().maskDoubleToFloat(new DemandaModel().calculateCubicMetersPerDay(interferencia.vazaoOutorgavel, authorizedDemands[index].tempo));
			document.getElementById(`p-dias-mes-${month}`).innerText = authorizedDemands[index].periodo
			
			// Cálculo metros cúbicos por mês
			let cubicMetersPerMonth = new DemandaModel().maskDoubleToFloat(new DemandaModel().calculateCubicMetersPerMonth(interferencia.vazaoOutorgavel, authorizedDemands[index].tempo, authorizedDemands[index].periodo));
			// Formatação. Ex: 1000,00 para 1.000,00
			let cubicMetersPerMonthFormated = new DemandaModel().formatNumber(cubicMetersPerMonth)
			
			document.getElementById(`q-m3-mes-${month}`).innerText = cubicMetersPerMonthFormated;
		});

	}

}