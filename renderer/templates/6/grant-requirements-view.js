/**
 * @id
 * @nome Outorga Prévia - Poço Raso
 * @arquivo grant-requirements-view.js
 * @diretório 6
 * @descrição Obrigações do usuário

 */

class GrantRequirementsView {
    constructor() {
        this.div = document.getElementById('grant-requirements');
        this.render();
    }

    render() {
        let index = `
                   
        <p>Art. 3&ordm; Ao t&eacute;rmino da perfura&ccedil;&atilde;o do po&ccedil;o e previamente &agrave; capta&ccedil;&atilde;o definitiva de &aacute;gua, o outorgado dever&aacute; requerer &agrave; Adasa a respectiva outorga de direito de uso de &aacute;gua subterr&acirc;nea, em formul&aacute;rio pr&oacute;prio, quando apresentar&aacute;:</p>

        <div style="margin-left: 2%">
        <p>a) Ensaio de bombeamento (contendo planilhas, gráficos e relatórios);</p>
		<p>b) Perfil construtivo litológico do poço;</p>
		<p>c) Perfilagem ótica (vídeo inspeção do poço, com início do vídeo mostrando parte da residência), com laudo, comprovando que se trata de um poço tubular raso;</p>
		<p>d) Registro fotográfico que comprove o cumprimento do disposto no art. 7º, incisos II, IV, V, VI e VII, desta outorga prévia;</p>
		<p>e) Anotação de responsabilidade técnica (ART); e</p>
		<p>f) Os dados do agente perfurador que executou as obras de perfuração do poço.</p>
        </div>
        <p>&nbsp;</p>

        <p>Art. 4&ordm; Esta outorga pr&eacute;via n&atilde;o substitui a outorga de direito de uso de recursos h&iacute;dricos, necess&aacute;ria para opera&ccedil;&atilde;o do po&ccedil;o e capta&ccedil;&atilde;o de &aacute;gua.</p>

        <p>&nbsp;</p>
        
        <p>Art. 5&ordm; A outorga pr&eacute;via ter&aacute; validade de <b>03 (tr&ecirc;s) anos</b>, a contar da data de publica&ccedil;&atilde;o do extrato no Di&aacute;rio Oficial do Distrito Federal, podendo ser renovada mediante solicita&ccedil;&atilde;o do outorgado, ou prorrogada, observada a legisla&ccedil;&atilde;o vigente.</p>
        <div style="margin-left: 2%">
        <p>&sect; 1&ordm; O pedido de renova&ccedil;&atilde;o desta outorga pr&eacute;via poder&aacute; ser requerido &agrave; Adasa com anteced&ecirc;ncia m&iacute;nima de 90 (noventa) dias do t&eacute;rmino do prazo de vig&ecirc;ncia fixado no <i>caput</i>.</p>

        <p>&sect; 2&ordm; Na an&aacute;lise do pedido para prorroga&ccedil;&atilde;o da presente outorga ser&atilde;o observadas as normas, os crit&eacute;rios e as prioridades de usos vigentes &agrave; &eacute;poca da renova&ccedil;&atilde;o.</p>

        <p>&sect; 3&ordm; A outorga pr&eacute;via ser&aacute; automaticamente prorrogada at&eacute; delibera&ccedil;&atilde;o da Adasa sobre o referido pedido de renova&ccedil;&atilde;o, se cumpridos os termos previstos no &sect;1&ordm;.</p>
        </div>
        <p>&nbsp;</p>

        <p>Art. 6&ordm; A outorga pr&eacute;via poder&aacute; ser suspensa, parcial ou totalmente, revogada ou revista, por prazo determinado, nos seguintes casos, previstos nos artigos 29 e 30 da Resolu&ccedil;&atilde;o n&ordm; 350, de 23 de junho de 2006:</p>

        <div style="margin-left: 2%">
        <p>I &ndash; quando o outorgado descumprir quaisquer condi&ccedil;&otilde;es e termos fixados no presente ato de outorga;</p>

        <p>II &ndash; &nbsp;diante da necessidade de:</p>

        <p>a) &aacute;gua para atender situa&ccedil;&otilde;es de calamidade, inclusive decorrentes de condi&ccedil;&otilde;es clim&aacute;ticas adversas;</p>

        <p>b) prevenir ou reverter grave degrada&ccedil;&atilde;o ambiental; e</p>

        <p>c) atender usos priorit&aacute;rios, de interesse coletivo, para os quais n&atilde;o se disponha de fontes alternativas.</p>

        <p>III &ndash; racionamento de recursos h&iacute;dricos, conforme regulamento espec&iacute;fico; e</p>

        <p>IV &ndash; indeferimento ou cassa&ccedil;&atilde;o da licen&ccedil;a ambiental, se for o caso.</p>

        <p>&sect; 1&ordm; A suspens&atilde;o total ou parcial da outorga pr&eacute;via n&atilde;o implica em indeniza&ccedil;&atilde;o a qualquer t&iacute;tulo.</p>

        <p>&sect; 2&ordm; A outorga pr&eacute;via para abastecimento humano ser&aacute; revogada ou modificada quando ocorrer a liga&ccedil;&atilde;o da rede de abastecimento de &aacute;gua pela concession&aacute;ria de saneamento b&aacute;sico.</p>
        </div>
        <p>&nbsp;</p>

        <p>Art. 7&ordm; Constituem obriga&ccedil;&otilde;es do outorgado:</p>
        <div style="margin-left: 2%">
        <p>I - observar os limites estabelecidos no art. 2&ordm; deste ato de outorga;</p>

        <p>II - proteger a por&ccedil;&atilde;o do po&ccedil;o perfurado executada sobre material inconsolidado e com possibilidade de desmoronamento, para preven&ccedil;&atilde;o de contamina&ccedil;&atilde;o dos aqu&iacute;feros por meio de percola&ccedil;&atilde;o de &aacute;guas superficiais indesej&aacute;veis;</p>

        <p>III - construir uma laje de concreto envolvendo o tubo de revestimento, com declividade do centro para a borda, com espessura m&iacute;nima de 10 cm (dez cent&iacute;metros) e &aacute;rea n&atilde;o inferior a 1 m&sup2; (um metro quadrado);</p>

        <p>IV - manter a parte externa do po&ccedil;o com 30 cm (trinta cent&iacute;metros), no m&iacute;nimo, acima da laje de concreto, a qual dever&aacute; ter prote&ccedil;&atilde;o de alvenaria e cobertura remov&iacute;vel;</p>

        <p>V -&nbsp; manter &aacute;rea de prote&ccedil;&atilde;o com raio de, pelo menos, 5 m (cinco metros), a partir dos limites do po&ccedil;o, que dever&aacute; ser cercado e mantido limpo;</p>

        <p>VI - desativar e tamponar as fossas posicionadas no raio de 30 m (trinta metros) do po&ccedil;o, a fim de evitar a contamina&ccedil;&atilde;o do aqu&iacute;fero;</p>

        <p>VII - instalar hidr&ocirc;metro na sa&iacute;da do po&ccedil;o, num prazo m&aacute;ximo de 90 (noventa) dias a partir da perfura&ccedil;&atilde;o ou da publica&ccedil;&atilde;o do extrato de outorga;</p>

        <p>VIII - ap&oacute;s a instala&ccedil;&atilde;o do dispositivo de medi&ccedil;&atilde;o dos volumes extra&iacute;dos, o outorgado dever&aacute; enviar &agrave; Adasa o resultado de sua leitura, bem como a respectiva planilha com os volumes mensais extra&iacute;dos;</p>

        <p>IX - responsabilizar-se pelo controle e vigil&acirc;ncia da qualidade da &aacute;gua e seu padr&atilde;o de potabilidade, conforme estabelece a Portaria do Minist&eacute;rio da Sa&uacute;de n&ordm; 2.914, de 12 de dezembro de 2011 e obter junto &agrave; Diretoria de Vigil&acirc;ncia Ambiental da Secretaria de Sa&uacute;de do Distrito Federal as autoriza&ccedil;&otilde;es cab&iacute;veis; e</p>

        <p>X - construir e manter sistema de adu&ccedil;&atilde;o, reserva&ccedil;&atilde;o e distribui&ccedil;&atilde;o, completamente independente do sistema de abastecimento da concession&aacute;ria de &aacute;gua, caso o uso de &aacute;gua de po&ccedil;o ocorra em &aacute;rea atendida pela rede de abastecimento de &aacute;gua.</p>

        <p>Par&aacute;grafo &uacute;nico. Em situa&ccedil;&otilde;es especiais, a Adasa poder&aacute; reduzir o tamanho do raio de que trata o inciso V deste artigo, n&atilde;o podendo ser o raio inferior a 1 m (um metro).</p>

        </div>
        <p>&nbsp;</p>

        <p>Art. 8&ordm; Fica o outorgado sujeito &agrave; fiscaliza&ccedil;&atilde;o da Adasa, por interm&eacute;dio de seus agentes ou prepostos indicados, devendo franquear-lhes o acesso ao empreendimento e &agrave; documenta&ccedil;&atilde;o respectiva, como projetos, contratos, relat&oacute;rios, registros e quaisquer outros documentos referentes &agrave; presente outorga.</p>

        <p>&nbsp;</p>

        <p>Art. 9&ordm; Fica o outorgado sujeito &agrave;s penalidades previstas na legisla&ccedil;&atilde;o em vigor em caso de descumprimento das disposi&ccedil;&otilde;es legais e regulamentares decorrentes da reserva do direito de uso da &aacute;gua subterr&acirc;nea e pelo n&atilde;o atendimento das solicita&ccedil;&otilde;es, recomenda&ccedil;&otilde;es e determina&ccedil;&otilde;es da fiscaliza&ccedil;&atilde;o.</p>

        <p>&nbsp;</p>

        <p>Art. 10. A transfer&ecirc;ncia do direito previsto neste ato, bem como qualquer altera&ccedil;&atilde;o nas caracter&iacute;sticas do empreendimento sujeito &agrave; esta outorga pr&eacute;via, dever&aacute; ser precedida de anu&ecirc;ncia formal da Adasa.</p>

        <p>&nbsp;</p>

        <p>Art. 11. A presente outorga n&atilde;o dispensa ou substitui a obten&ccedil;&atilde;o, pelo outorgado, de certid&otilde;es, alvar&aacute;s ou licen&ccedil;as de qualquer natureza, exigidos pela legisla&ccedil;&atilde;o vigente.</p>

        <div style="margin-left: 2%">
        <p>Par&aacute;grafo &uacute;nico. O outorgado dever&aacute; respeitar a legisla&ccedil;&atilde;o ambiental e articular-se com o &oacute;rg&atilde;o competente, com vistas &agrave; obten&ccedil;&atilde;o de licen&ccedil;as ambientais, quando couber, cumprir as exig&ecirc;ncias nelas contidas e responder pelas consequ&ecirc;ncias do descumprimento das leis, regulamentos e licen&ccedil;as.</p>
        </div>
        <p>&nbsp;</p>

        <p>Art. 12. O outorgado responder&aacute; civil, penal e administrativamente, por danos causados &agrave; vida, &agrave; sa&uacute;de, ao meio ambiente, bem como a terceiros, pelo uso inadequado que vier a fazer da presente outorga, na forma da Lei.</p>

        <p>&nbsp;</p>

        <p>Art. 13. Esta outorga pr&eacute;via entra em vigor na data de sua publica&ccedil;&atilde;o.</p>

`;

        this.div.innerHTML = index;


    }


}