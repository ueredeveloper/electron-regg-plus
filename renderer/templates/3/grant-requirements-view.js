/**
 * @diretorio 3
 * @nome Outorga De Direito de Uso
 * @descricao Obrigações do usuário
 * @arquivo grant-requirements-view.js
 * @id 
 *
 *
 */

class GrantRequirementsView {
    constructor() {
        this.div = document.getElementById('grant-requirements');
        this.render();
    }

    render() {
        let index = `
                   
        <p>
        Art. 3º A outorga terá validade de <b>10 (dez) anos</b>, a contar da data de publicação do extrato no 
        Diário Oficial do Distrito Federal, podendo ser renovada mediante solicitação do outorgado, ou 
        prorrogada, observada a legislação vigente.
        </p>
        <div style="margin-left: 2%">
        <p>
            § 1º O pedido de renovação desta outorga poderá ser requerido à Adasa com antecedência mínima de 
            90 (noventa) dias do término do prazo de vigência fixado no caput.
        </p>
        <p>
            § 2º Na análise do pedido para prorrogação da presente outorga serão observadas as normas, os 
            critérios e as prioridades de usos vigentes à época da renovação.
        </p>
        <p>
            § 3º A outorga será automaticamente prorrogada até deliberação da Adasa sobre o referido pedido de 
            renovação, se cumpridos os termos previstos no §1º.
        </p>
        </div>
        <p>&nbsp;</p>
        <p>
            Art. 4º A outorga poderá ser suspensa, parcial ou totalmente, revogada ou revista, por prazo 
            determinado, nos seguintes casos, previstos nos artigos 29 e 30 da Resolução nº 350, de 23 de 
            junho de 2006:
        </p>
        <div style="margin-left: 2%">
        <p>
            I – quando o outorgado descumprir quaisquer condições e termos fixados no presente ato de outorga;
        </p>
        <p>
            II – diante da necessidade de:
        </p>
        <p>
            a) água para atender situações de calamidade, inclusive decorrentes de condições climáticas 
            adversas;
        </p>
        <p>
            b) prevenir ou reverter grave degradação ambiental;
        </p>
        <p>
            c) atender usos prioritários, de interesse coletivo, para os quais não se disponha de fontes 
            alternativas.
        </p>
        <p>
            III – racionamento de recursos hídricos, conforme regulamento específico; e
        </p>
        <p>
            IV – indeferimento ou cassação da licença ambiental, se for o caso.
        </p>
        
        <p>
            § 1º A suspensão total ou parcial da outorga não implica em indenização a qualquer título.
        </p>
        <p>
            § 2º A outorga para abastecimento humano será revogada ou modificada quando ocorrer a ligação 
            da rede de abastecimento de água pela concessionária de saneamento básico.
        </p>
        </div>
        <p>&nbsp;</p>
        <p>
            Art. 5º Constituem obrigações do outorgado:
        </p>
        <div style="margin-left: 2%">
        <p>
            I - observar os limites estabelecidos no art. 2º deste ato de outorga;
        </p>
        <p>
            II - proteger a porção do poço perfurado executada sobre material inconsolidado e com possibilidade 
            de desmoronamento, para prevenção de contaminação dos aquíferos por meio de percolação de águas 
            superficiais indesejáveis;
        </p>
        <p>
            III - construir uma laje de concreto envolvendo o tubo de revestimento, com declividade do centro 
            para a borda, com espessura mínima de 10 cm (dez centímetros) e área não inferior a 1 m² (um metro 
            quadrado);
        </p>
        <p>
            IV - manter a parte externa do poço com 30 cm (trinta centímetros), no mínimo, acima da laje de 
            concreto, a qual deverá ter proteção de alvenaria e cobertura removível;
        </p>
        <p>
            V - manter área de proteção com raio de, pelo menos, 5 m (cinco metros), a partir dos limites do 
            poço, que deverá ser cercado e mantido limpo;
        </p>
        <p>
            VI - desativar e tamponar as fossas posicionadas no raio de 30 m (trinta metros) do poço, a fim 
            de evitar a contaminação do aquífero;
        </p>
        <p>
            VII - instalar hidrômetro na saída do poço, num prazo máximo de 90 (noventa) dias a partir da 
            perfuração ou da publicação do extrato de outorga;
        </p>
        <p>
            VIII - após a instalação do dispositivo de medição dos volumes extraídos, o outorgado deverá 
            enviar à Adasa o resultado de sua leitura, bem como a respectiva planilha com os volumes mensais 
            extraídos;
        </p>
        <p>
            IX - responsabilizar-se pelo controle e vigilância da qualidade da água e seu padrão de 
            potabilidade, conforme estabelece a Portaria do Ministério da Saúde nº 2.914, de 12 de dezembro de 
            2011, e obter junto à Diretoria de Vigilância Ambiental da Secretaria de Saúde do Distrito Federal 
            as autorizações cabíveis; e
        </p>
        <p>
            X - construir e manter sistema de adução, reservação e distribuição, completamente independente 
            do sistema de abastecimento da concessionária de água, caso o uso de água de poço ocorra em área 
            atendida pela rede de abastecimento de água.
        </p>
        <p>
            Parágrafo único. Em situações especiais, a Adasa poderá reduzir o tamanho do raio de que trata o 
            inciso V deste artigo, não podendo ser o raio inferior a 1 m (um metro).
        </p>
        </div>
        <p>&nbsp;</p>
        <p>
            Art. 6º Fica o outorgado sujeito à fiscalização da Adasa, por intermédio de seus agentes ou 
            prepostos indicados, devendo franquear-lhes o acesso ao empreendimento e à documentação respectiva, 
            como projetos, contratos, relatórios, registros e quaisquer outros documentos referentes à presente 
            outorga.
        </p>
        <p>&nbsp;</p>
        <p>
            Art. 7º Fica o outorgado sujeito às penalidades previstas na legislação em vigor em caso de 
            descumprimento das disposições legais e regulamentares decorrentes da reserva do direito de uso da 
            água subterrânea e pelo não atendimento das solicitações, recomendações e determinações da 
            fiscalização.
        </p>
        <p>&nbsp;</p>
        <p>
            Art. 8º A transferência do direito previsto neste ato, bem como qualquer alteração nas 
            características do empreendimento sujeito a esta outorga, deverá ser precedida de anuência formal 
            da Adasa.
        </p>
        <p>&nbsp;</p>
        <p>
            Art. 9º A presente outorga não dispensa ou substitui a obtenção, pelo outorgado, de certidões, 
            alvarás ou licenças de qualquer natureza, exigidos pela legislação vigente.
        </p>
        <div style="margin-left: 2%">
        <p>
            Parágrafo único. O outorgado deverá respeitar a legislação ambiental e articular-se com o órgão 
            competente, com vistas à obtenção de licenças ambientais, quando couber, cumprir as exigências 
            nelas contidas e responder pelas consequências do descumprimento das leis, regulamentos e licenças.
        </p>
        </div>
        <p>&nbsp;</p>
        <p>
            Art. 10. O outorgado responderá civil, penal e administrativamente, por danos causados à vida, à 
            saúde, ao meio ambiente, bem como a terceiros, pelo uso inadequado que vier a fazer da presente 
            outorga, na forma da Lei.
        </p>
        <p>&nbsp;</p>
        <p>
            Art. 11. Esta outorga entra em vigor na data de sua publicação.
        </p>


`;

        this.div.innerHTML = index;


    }


}