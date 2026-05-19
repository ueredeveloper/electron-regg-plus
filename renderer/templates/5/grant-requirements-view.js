/**
 * @nome Registro de Uso Subterrâneo
 * @descricao Obrigrações do Usuário
 * @diretorio 5
 * @arquivo grants-requirement-view.js
 * @id 
 */

class GrantRequirementsView {
    constructor() {
        this.div = document.getElementById('grant-requirements');
        this.render();
    }

    render() {
        let index = `
        <div>
        <p> Art. 3º. Constituem obrigações do registrado: </p>
        <div style="margin-left: 2%">
        

        <p> I - observar as condições no art. 2º deste ato de registro;

        <p> II – proteger a porção do poço perfurado em material inconsolidado ou com possibilidade de desmoronamento, o espaço deverá ser manilhado, evitando possíveis contaminações dos aquíferos por meio de percolação de águas superficiais indesejáveis;

        <p> III - manter a parte externa do poço, no mínimo, 50 (cinquenta) centímetros acima do nível do solo com cobertura removível;

        <p> IV - manter área de proteção com raio de no mínimo 05 (cinco) metros a partir dos limites do poço, que deverá ser cercado e mantido limpo. Em situações especiais, desde que aprovado pela Adasa, o raio poderá ser diminuído, nunca inferior a 1(um) metro;

        <p> V – desativar e tamponar as fossas posicionadas no raio de 30 (trinta) metros do poço, a fim de evitar a contaminação do aquífero;

        <p> VI - responsabilizar-se pelo controle e vigilância da qualidade da água e seu padrão de potabilidade, conforme estabelece a Portaria do Ministério da Saúde nº 2.914, de 12 de dezembro de 2011 e obter junto à Diretoria de Vigilância Ambiental da Secretaria de Saúde do Distrito Federal as autorizações cabíveis; e

        <p> VII - construir e manter sistema de adução, reservação e distribuição, completamente independente do sistema de abastecimento da concessionária de água, caso o uso de água de poço ocorra em área atendida pela rede de abastecimento de água.

            </div>
        <div>
        <br/>

         <p> Art. 4º Fica o registrado sujeito à fiscalização da Adasa, por intermédio de seus agentes ou prepostos indicados, devendo franquear-lhes o acesso 
         ao empreendimento e à documentação respectiva, como projetos, contratos, relatórios, registros e quaisquer outros documentos referentes ao presente 
         registro. </p>
         <br/>

         <p> Art. 5º Fica o registrado sujeito às penalidades previstas na legislação em vigor em caso de descumprimento das disposições legais e 
         regulamentares decorrentes da reserva do direito de uso da água subterrânea e pelo não atendimento das solicitações, recomendações e determinações 
         da fiscalização.
         </p>
		 <br/>
         <p> Art. 6º. A transferência do direito previsto neste ato, bem como qualquer alteração nas características do empreendimento sujeito à este registro,
          deverá ser precedida de anuência formal da Adasa.
         </p>
         
		 <br/>
         <p> Art. 7º. O presente registro não dispensa ou substitui a obtenção, pelo registrado, de certidões, alvarás ou licenças de qualquer natureza, 
         exigidos pela legislação vigente.
         </p>

		 <div style="margin-left: 2%">	
         <p> Parágrafo único. O registrado deverá respeitar a legislação ambiental e articular-se com o órgão competente, com vistas à obtenção de licenças 
         ambientais, quando couber, cumprir as exigências nelas contidas e responder pelas consequências do descumprimento das leis, regulamentos e 
         licenças.
         </p>
         </div>
         <br/>
         <p> Art. 8º. O registrado responderá civil, penal e administrativamente, por danos causados à vida, à saúde, ao meio ambiente, bem como a terceiros, 
         pelo uso inadequado que vier a fazer do presente registro, na forma da Lei.
         </p>
		 <br/>
         <p> Art. 9º. Este registro entra em vigor na data de sua assinatura.</p>

         </div>
          
`;

        this.div.innerHTML = index;


    }


}