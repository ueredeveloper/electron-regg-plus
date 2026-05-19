/**
 * @diretorio shared
 * @descricao Tabela de Finalidades
 * @nome Tabela de Finalidades
 * @arquivo purpouse-requested-table-view.js
 * @id 
 *
 *
 */

class PurpouseRequestedTableView {
	
	constructor(documento, tipoFinalidade, interferencia, cssId) {

	    this.div = document.getElementById(cssId);
	    this.documento = documento;
	    this.tipoFinalidade = tipoFinalidade;
	    this.interferencia = interferencia;

    this.render();
  }

  render() {

    let anexo = this.documento.processo.anexo;
    let usuario = this.documento.usuarios[0];
    let tipoOutorga = this.interferencia.tipoOutorga;
    let sutipoOutorga = this.interferencia.subtipoOutorga;
    let finalidades = new FinalidadeModel().sortPurposes(this.interferencia.finalidades);

    let _finalidades = finalidades.filter(f => f.tipoFinalidade.id === this.tipoFinalidade);

    let innerHTML = `
          <table border="1" cellspacing="0" style="align: center">
            <tbody>
              <tr>
                <td style="text-align: center;"><p>Processo</p></td>
                <td style="text-align: center;"><p>Requerente</p></td>
                <td style="text-align: center;"><p>Solicitação</p></td>
                <td style="text-align: center;"><p>Finalidades</p></td>
                <td style="text-align: center;"><p>Subfinalidades</p></td>
                <td style="text-align: center;"><p>Quantidade</p></td>
                <td style="text-align: center;"><p>Demanda (L/dia)</p></td>
                <td style="text-align: center;"><p>Demanda Total (L/dia)</p></td>
              </tr>
              <tr style="text-align: center;">
                <td style="text-align: center;">${anexo?.numero ?? 'N/A'}</td>
                <td style="text-align: center;">${usuario?.nome ?? 'N/A'}</td>
                <td>
                  ${tipoOutorga?.descricao ?? 'N/A'}
                  ${sutipoOutorga?.descricao ? ' - ' + sutipoOutorga.descricao : ''}
                </td>
                <td style="text-align: center;">${_finalidades.map(_fin => _fin.finalidade || 'Desconhecido').join('<br/><br/>')}</td>
                 <td style="text-align: center;">${_finalidades.map(_fin => _fin.subfinalidade || 'Desconhecido').join('<br/><br/>')}</td>
                <td style="text-align: center;">${_finalidades.map(_fin => _fin.quantidade.toString().replace('.', ',') || 'N/A').join('<br/><br/>')}</td>
                <td style="text-align: center;">${_finalidades.map(_fin => _fin.consumo || 'N/A').join('<br/><br/>')}</td>
                <td style="text-align: center;">${_finalidades.reduce((accumulator, currentValue) => accumulator + Number(currentValue.total || 0), 0)}</td>
              </tr>
            </tbody>
          </table>
      `;

    if (this.div !== null) this.div.innerHTML = innerHTML;
  }
}