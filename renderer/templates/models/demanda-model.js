/**
 * @nome Demanda
 * @diretorio models
 * @descricao Modelos de Tabelas
 * @arquivo demanda-model.js
 * @id 
 *
 *
 */
 
class DemandaModel {

    constructor() {}

    getSample() {}

    /**
    * Converte a vazão de litros por hora (L/h) para metros cúbicos por hora (m³/h).
    * 
    * @param {number} value - A vazão em litros por hora.
    * @returns {number} - A vazão em metros cúbicos por hora.
    */
    convertLitersToCubicMeters(value) {
        return value / 1000;
    }
    /**
    * Calcula a vazão em metros cúbicos por dia.
    * 
    * @param {number} litrosHora - A vazão em litros por hora.
    * @param {number} time - O número de horas por dia.
    * @returns {number} - A vazão em metros cúbicos por dia.
    */

    calculateCubicMetersPerDay(litrosHora, time) {
        // Converte a vazão de litros por hora para metros cúbicos por hora e multiplica pelas horas por dia
        return (litrosHora / 1000) * time;
    }

    /**
    * Calcula a vazão em metros cúbicos por mês.
    * 
    * @param {number} litrosHora - A vazão em litros por hora.
    * @param {number} time - O número de horas por dia.
    * @param {number} periodo - O número de dias no mês.
    * @returns {number} - A vazão em metros cúbicos por mês.
    */
    calculateCubicMetersPerMonth(litrosHora, time, periodo) {
        return ((litrosHora / 1000) * time) * periodo;
    }
    
    
    // Função para formatar o número com ponto separador de milhar
	formatNumber(value) {
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
	
	// Muda o ponto do valor double para vígula do float. Ex: 20.00 para 20,00
	maskDoubleToFloat(value) {
		return parseFloat(value).toFixed(2)?.toString().replace('.', ',');
	}

}