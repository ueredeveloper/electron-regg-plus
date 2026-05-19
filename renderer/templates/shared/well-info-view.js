/**
 * @nome Informações do Poço
 * @descricao Informações como nível estático, nível dinâmico e coordenada
 * @diretorio shared
 * @arquivo well-info-view.js
 * @id 
 *
 *
 */


class WellInfoView {

    constructor() {
        this.div = document.getElementById('well-info-view');
        this.render();
    }

    render() {
        let innerHtml = `
    	<h3>II. Dados do poço:</h3>
        <ul>
            <li>Coordenadas SIRGAS 2000: 
            <span class="inter-latitude"></span>, 
            <span class="inter-longitude"></span>
            </li>
            <li>Tipo de Poço: <span class="inter-tipo-poco"></span></li>
            <!-- Cálculos do poço em metros -->
            <li>Profundidade: <span class="inter-profundidade"></span></li>
            <li>Nível Estático N.E: <span class="inter-nivel-estatico"></span></li>
            <li>Nível Dinâmico N.D: <span class="inter-nivel-dinamico"></span></li>
            <!-- Vazões --> 
            <li>Vazão média do Subsistema (L/h): <span class="inter-vazao-sistema"></span></li>
            <li>Vazão teste (L/h): <span class="inter-vazao-teste"></span></li>
            <li>Vazão autorizada (L/h): <span class="inter-vazao-outorgavel"></span></li>
        </ul>
        <br>`;

        if (this.div !== null) this.div.innerHTML = innerHtml;

    }

    update(interferencia) {
        // Latitude
        let _items = document.getElementsByClassName('inter-latitude');
        Array.from(_items).forEach(element => {
            element.textContent = interferencia.latitude?.toFixed(6) || 'XXX';
        });

        // Longitude
        let __items = document.getElementsByClassName('inter-longitude');
        Array.from(__items).forEach(element => {
            element.textContent = interferencia.longitude?.toFixed(6) || 'XXX';
        });

        // Tipo de Poço
        let ___items = document.getElementsByClassName('inter-tipo-poco');
        Array.from(___items).forEach(element => {
            element.textContent = new InterferenciaModel().getTipoPoco(interferencia)
        });

        // Profundidade do Poço
        let ____items = document.getElementsByClassName('inter-profundidade');
        Array.from(____items).forEach(element => {
            element.textContent = new InterferenciaModel().parseOrDefault(interferencia?.profundidade);
        });

        // Profundidade do Poço
        let _____items = document.getElementsByClassName('inter-nivel-estatico');
        Array.from(_____items).forEach(element => {
            element.textContent = new InterferenciaModel().parseOrDefault(interferencia?.nivelEstatico);
        });

        // Profundidade do Poço
        let ______items = document.getElementsByClassName('inter-nivel-dinamico');
        Array.from(______items).forEach(element => {
            element.textContent = new InterferenciaModel().parseOrDefault(interferencia?.nivelDinamico);
        });

        // Vazões
        let vazoes = [
            { className: 'inter-vazao-sistema', value: interferencia.vazaoSistema },
            { className: 'inter-vazao-teste', value: interferencia.vazaoTeste },
            { className: 'inter-vazao-outorgavel', value: interferencia.vazaoOutorgavel }
        ];

        vazoes.forEach(vazao => {
            let elements = document.getElementsByClassName(vazao.className);
            Array.from(elements).forEach(element => {
                element.textContent = new InterferenciaModel().parseOrDefault(vazao.value)
            });
        });


    }

}