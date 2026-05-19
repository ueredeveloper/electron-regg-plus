/**
 * 
 * @arquivo conclusion-view.js
 * @diretorio 2
 * @descricao Parecer de Outorga Prévia
 * @nome Parecer de Outorga Prévia
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
        <div>
            <h2>IV. DA CONCLUSÃO</h2>
            <p>11. A documentação solicitada foi atendida e sustenta a solicitação de outorga prévia de água subterrânea.</p>
            <br>
            <p>12. Com base nas informações deste processo e análise do mesmo, recomendo o DEFERIMENTO do pedido e a emissão do ato de outorga prévia, 
            com prazo de validade de 03 (três) anos, contados da publicação do extrato no Diário Oficial do Distrito Federal.
            </p>
            <br>
            <div style="display: flex; flex-direction: column;justify-content: center; align-items:center;">
                <p><strong>SAULO GREGORY LUZZI</strong></p>
                <p><strong>Coordenador de Outorga – SRH</strong></p>
            </div>
        </div>`;
        if (this.div !== null) this.div.innerHTML = innerHTML;
    }
}
