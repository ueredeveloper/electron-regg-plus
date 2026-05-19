/**
 * 
 * @nome Parecer de Outorga Prévia
 * @descricao Base legal
 * @diretorio 2
 * @arquivo legal-basis-view.js
 * @id 
 *
 *
 */

class LegalBasisView {
	
    constructor() {
        this.div = document.getElementById('legal-basis-view');
    	this.render();
    }
    render() {
        let innerHTML = `
        <h2>II. DO FUNDAMENTO LEGAL</h2>
        <p>2. Este parecer tem amparo legal nos termos do art. 12 da Lei nº 2.725, de 13 de junho de 2001, do inciso II do art. 8 
        da Lei nº 4.285, de 26 de dezembro de 2008, da Resolução/Adasa nº 350, de 23 de junho de 2006 e suas alterações, 
        Resolução nº 18, de 19 de outubro de 2020, Resolução/Adasa nº 15/2018, art. 5º, art. 6º da Resolução/Adasa nº 16, de 
        18 de julho de 2018, e Nota Técnica nº 8/2018 - Adasa/SRH, Resolução nº 02, de 25 de janeiro de 2019 e Portaria nº 64, 
        de 21 de maio de 2019.
        </p>
        `;
        if (this.div !== null) this.div.innerHTML = innerHTML;

    }
}