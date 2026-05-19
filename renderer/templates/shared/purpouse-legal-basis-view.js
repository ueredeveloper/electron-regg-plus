/**
 * @nome Dados Legais e Finalidade
 * @descricao Limites legais por finalidade de uso
 * @diretorio shared
 * @arquivo purpouse-legal-basis-view.js
 * @id 
 *
 *
 */


class PurpouseLegalBasisView {
    constructor() {
        this.div = document.getElementById('purpouse-legal-basis-view');
        this.render();
    }

    render() {
        let innerHTML = `
        <p>
        7. As finalidades foram analisadas considerando as disposições da Resolução/Adasa nº 350/2006, 
        Resolução/Adasa nº 36/2018, Resolução/Adasa nº 16/2018 e da disponibilidade hídrica de água subterrânea na 
        reserva explotável do domínio poroso/fraturado conforme disposições a seguir:
        </p>

        <p><br></p>

        <p>Resolução/ADASA nº 350/2006</p>

        <p style="margin-left:30.0pt;">Art. 9º . Necessitam de prévio registro os seguintes usos de água subterrânea, 
        considerados como usos insignificantes:</p>

        <p style="margin-left:30.0pt;">I – Poços manuais com vazão de uso da água menor ou igual a 5 m³ /dia 
        (cinco metros cúbicos por dia); e,</p>

        <p style="margin-left:30.0pt;">II – Poços incluídos em pesquisas, com caráter exclusivo de estudo, sondagem 
        ou monitoramento.</p>

        <p style="margin-left:30.0pt;">Art. 17. Fica vedado o uso de águas superficial e subterrânea com a finalidade 
        de consumo humano, onde houver rede de abastecimento da concessionária.</p>

        <p style="margin-left:30.0pt;">Art. 18. O uso para consumo humano, onde não houver rede de abastecimento da 
        concessionária, constitui-se em solução provisória.</p>

        <p style="margin-left:30.0pt;">Art. 19. Para poços tubulares, em áreas atendidas com a rede pública de 
        abastecimento de água, a outorga prévia e a outorga de direitos de uso de água subterrânea somente poderão ser concedidas para os seguintes usos:</p>

        <p style="margin-left:30.0pt;">I – Irrigação de áreas com superfície superior a 5.000 m² (cinco mil metros 
        quadrados);</p>

        <p style="margin-left:30.0pt;">II – Usos comerciais;</p>

        <p style="margin-left:30.0pt;">III – Usos industriais.</p>

        <p style="margin-left:30.0pt;">&nbsp;</p>

        <p style="margin-left:6pt;">Resolução/ADASA nº 36/2018</p>

        <p style="margin-left:30.0pt;">Art. 3º Estabelecer que, a montante do reservatório do Descoberto, 
        outorgas de direito de uso de recursos hídricos somente poderão ser emitidas para as finalidades 
        de irrigação e piscicultura em áreas já utilizadas para essas atividades antes de 16 de setembro de 
        2016.</p>

        <p style="margin-left:30.0pt;">§1º É vedada a renovação ou alteração de outorgas de direito de uso de 
        recursos hídricos, a montante do reservatório do Descoberto, com o objetivo de ampliação das 
        atividades mencionadas no caput.</p>
      
		</br>
        <div style="text-align: justify;">
        <p style="margin-left:6pt;">Resolução/ADASA nº 16/2018</p>

        <p style="margin-left:30.0pt;">Art. 6º. Nas áreas atendidas pela concessionária, poderão ser concedidas outorgas e/ou 
        registros para captação de água subterrânea, com finalidade exclusiva de irrigação, e desde que 
        as propriedades possuam no mínimo 400 m² (quatrocentos metros quadrados) de área permeável, para 
        os poços manuais (cisternas) e poços tubulares rasos, e 5000 m² (cinco mil metros quadrados), 
        para os poços tubulares profundos.
        </p>

        <p style="margin-left:30.0pt;">§1º. Para efeito de contagem de área permeável para as concessões de 
        outorga em áreas atendidas pela concessionária de abastecimento público, poderão ser agrupadas áreas 
        permeáveis contíguas, obrigando-se os usuários deste agrupamento a construírem rede de distribuição 
        dissociada da rede de abastecimento da concessionária, que atenda a todas as propriedades, com a 
        finalidade exclusiva de irrigação.
        </p>
        </div>

        `;


        if (this.div !== null) this.div.innerHTML = innerHTML;
    }
}