/**
 * @nome Tabela de Dados Geográficos
 * @descricao Dados geográficos como coordenada, bacia e subbacia
 * @diretorio shared
 * @arquivo geographic-table-view.js
 * @id 
 *
 *
 */

class GeographicTableView {
    constructor() {
        this.div = document.getElementById('geographic-table-view');
        this.render();
    }


    render() {
        let innerHTML = `
            <div align="justify" style="margin-left: auto; margin-right: auto; overflow: auto;">
                <table border="1" cellspacing="0" style="margin-left: auto; margin-right: auto; ">
                    <tbody>
                        <tr>
                            <td rowspan="2" style="width: 104px; height: 30px; text-align: center;">Ponto de Captação</td>
                            <td rowspan="2" style="width: 135px; height: 30px; text-align: center;">Bacia Hidrográfica</td>
                            <td rowspan="2" style="width: 173px; height: 30px; text-align: center;">Unidade Hidrográfica</td>
                            <td colspan="2" style="width: 248px; height: 30px;">Ponto de Captação (SIRGAS 2000)</td>
                        </tr>
                        <tr>
                            <td style="width: 125px; height: 16px; text-align: center;">Latitude</td>
                            <td style="width: 123px; height: 16px; text-align: center;">Longitude</td>
                        </tr>
                        <tr>
                            <td style="width: 104px; height: 21px; text-align: center;" class="inter-nome"></td>
                            <td style="width: 135px; height: 21px; text-align: center;" class="inter-bh"></td>
                            <td style="width: 173px; height: 21px; text-align: center;" class="inter-uh"></td>
                            <td style="width: 125px; height: 21px; text-align: center;"><strong><span class="inter-latitude"></span></strong></td>
                            <td style="width: 123px; height: 21px; text-align: center;"><strong><span class="inter-longitude"></span></strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>`;

        if (this.div !== null) this.div.innerHTML = innerHTML;

    }

    update (interferencia){

        let ns = document.getElementsByClassName('inter-nome');

    	Array.from(ns).forEach(element => {
    		element.textContent = interferencia?.nome || 'XXX';
    	});

        let bhs = document.getElementsByClassName('inter-bh');

    	Array.from(bhs).forEach(element => {
    		element.textContent = interferencia.baciaHidrografica?.baciaNome || 'XXX';
    	});

        let uhs = document.getElementsByClassName('inter-uh');

    	Array.from(uhs).forEach(element => {
    		element.textContent =  interferencia.unidadeHidrografica?.uhNome || 'XXX';
    	});

        let lats = document.getElementsByClassName('inter-latitude');

    	Array.from(lats).forEach(element => {
    		element.textContent = interferencia.latitude?.toFixed(6) || 'XXX';
    	});

        let lngs = document.getElementsByClassName('inter-longitude');

    	Array.from(lngs).forEach(element => {
    		element.textContent = interferencia.longitude?.toFixed(6) || 'XXX';
    	});
     
    }
   
}