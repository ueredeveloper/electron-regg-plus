/**
 * @descricao Assinatura compartilhada
 * @nome Assinatura do Técnico
 * @diretorio shared
 * @arquivo signature-view.js
 * @id 
 *
 *
 */


class SignatureView {

    constructor() {
        this.div = document.getElementById('signature-view');
        this.render();
    }

    render() {

        let innerHTML = `
            <div>
                <p style="text-align: center;"><strong>SAULO GREGORY LUZZI</strong></p>
                <p style="text-align: center;">Cordenador de Outorgas - COUT/SRH</p>
            </div>
            `;
        if (this.div !== null) this.div.innerHTML = innerHTML;
    }

}