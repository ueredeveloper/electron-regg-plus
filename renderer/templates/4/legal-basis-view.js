/**
* @nome Parecer de Outorga De Direito de Uso
* @descricao Base legal do parecer
* @diretorio 4
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
			<p style="text-align: justify;"><strong>II. DO FUNDAMENTO LEGAL</strong></p>
			<p></p>
			<p>3. Este parecer tem amparo legal nos termos do art. 12 da Lei nº 2.725, 
            de 13 de junho de 2001, do inciso II do art. 8 da Lei nº 4.285, de 26 de dezembro de 2008, da 
            Resolução/Adasa nº 350, de 23 de junho de 2006 e suas alterações, Resolução nº 18, de 19 de outubro de 2020,
            Resolução/Adasa nº 15/2018, art. 5º, art. 6º da Resolução/Adasa nº 16, de 18 de julho de 2018, e 
            Nota Técnica nº 8/2018 - 
            Adasa/SRH, Resolução nº 02, de 25 de janeiro de 2019 e Portaria nº 64, de 21 de maio de 2019.
            </p>
		`
        this.div.innerHTML = innerHTML;

    }
    update(documento) {

        let usuario = documento.usuarios[0];
        let tipoPoco = documento.endereco.interferencias[0].tipoPoco;
        let finalidades = documento.endereco.interferencias[0].finalidades;


        document.getElementById('inter-tipo-poco').innerHTML = tipoPoco?.descricao?.toLowerCase() || 'XXX';
        let items = document.getElementsByClassName('inter-finalidades');

        Array.from(items).forEach(element => {
            let innerHTML = new FinalidadeModel().getPurpouseString(finalidades);
            element.innerHTML = innerHTML
        });

        let _items = document.getElementsByClassName('us-nome');
    	// Converte o resultado para array e atualiza
    	Array.from(_items).forEach(element => {
    		element.innerHTML = new UsuarioModel().getNome(usuario);
    	});
    	let __items = document.getElementsByClassName('us-cpf-cnpj');
    	// Converte o resultado para array e atualiza
    	Array.from(__items).forEach(element => {
    		element.innerHTML = new UsuarioModel().formatCpfCnpj(usuario.cpfCnpj);
    	});


    }
}