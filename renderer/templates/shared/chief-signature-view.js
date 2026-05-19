/**
 * @nome Assinatura da chefia
 * @arquivo chief-signature-view.js
 * @diretorio shared
 * @descricao Assinatura da chefia
 * @id 
 *
 *
 */


class ChiefSignatureView {

    constructor() {
        this.div = document.getElementById('chief-signature-view');
        this.render();
    }

    render() {

        let innerHTML = `
            <div>
                <p style="text-align: center;"><strong>GUSTAVO ANTONIO CARNEIRO</strong></p>
                <p style="text-align: center;">Superintendente de Recursos Hídricos</p>
            </div>
            `;
     	if (this.div !== null) this.div.innerHTML = innerHTML;
    }

}