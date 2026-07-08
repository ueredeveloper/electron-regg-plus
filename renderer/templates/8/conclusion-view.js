/**
* @nome Parecer de Renovação de Outorga
* @descricao Conclusão do parecer
* @diretorio 8
* @arquivo conclusion-view.js
* @id
*
*
*/

class ConclusionView {
    constructor() {
        this.div = document.getElementById('conclusion-view');
        this.render();
    }

    render() {

        let innerHTML = `
			<p><strong>IV. DA CONCLUSÃO </strong></p>
			<p>
			15. Com base nas informações deste processo e análise do mesmo, recomendo o DEFERIMENTO do pedido, a emissão do ato de
			renovação de outorga de direito de uso, com prazo de validade de 10 (dez) anos, contados da publicação do extrato no
			Diário Oficial do Distrito Federal, conforme as especificações descritas neste Parecer.
			</p>

		`;
        if (this.div !== null) this.div.innerHTML = innerHTML;

    }

}
