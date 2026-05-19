/**
 * @nome Finalidade
 * @diretorio models
 * @descricao Modelos de Tabelas
 * @arquivo finalidade-model.js
 * @id 
 *
 *
 */

class FinalidadeModel {

	constructor() { }

	getSample() { return [] }

	/**
	 * Converte uma array de finalidades em um string
	 * Tag anterior: <finalidades_tag></finalidades_tag>
	 * @param {*} finalidades 
	 * @returns 
	 */
	getPurpouseString(finalidades) {
		// Filtra as finalidades autorizadas, transforma em string com a apenas o atributo finalidade e converte tudo em minúsculo
		let arrayToString = finalidades
			.filter((f) => f.tipoFinalidade.id === 2)
			.map((f) => f.finalidade)
			.toString()
			.toLowerCase();

		// converter para set e remover os ítems repetidos
		let arrayFromSet = new Set(arrayToString.split(","));

		// reverter para array
		let setFromArray = [...arrayFromSet];

		// Organiza, primeiro abastecimento humano, depois criação de animais e depois as outras
		setFromArray.sort((a, b) => {
			const aHasAba = a.includes("aba");
			const bHasAba = b.includes("aba");
			const aHasCri = a.includes("cri") || a.includes("des");
			const bHasCri = b.includes("cri") || b.includes("des");

			// Primary sort: prioritize strings with "a"
			if (aHasAba && !bHasAba) {
				return -1; // a comes first
			}
			if (!aHasAba && bHasAba) {
				return 1; // b comes first
			}

			// Secondary sort (only if both have "a" or neither has "a"): prioritize strings with "cri"
			if (aHasCri && !bHasCri) {
				return -1; // a comes first
			}
			if (!aHasCri && bHasCri) {
				return 1; // b comes first
			}

			// If both have the same criteria status (both have "a" and "cri", or neither, etc.), maintain original relative order or sort alphabetically if needed (not requested here)
			return 0;
		});

		// Substituir a última vírgula por 'e'
		let result = setFromArray.toString().replace(/,(?=[^,]*$)/, " e ");
		// Adicionar espaço após todas as vírgulas
		result = result.replace(/,/g, ", ");
		return result;
	}

	// Organiza por finalidade, primeiro abastecimento humano, depois criação de animais e depois as outras
	sortPurposes(purposes) {

		purposes = purposes.sort((a, b) => {
			const aHasAba = a.finalidade.toLowerCase().includes("aba");
			const bHasAba = b.finalidade.toLowerCase().includes("aba");
			const aHasCri = a.finalidade.toLowerCase().includes("cri") || a.finalidade.toLowerCase().includes("des");
			const bHasCri = b.finalidade.toLowerCase().includes("cri") || b.finalidade.toLowerCase().includes("des");


			// Primary sort: prioritize strings with "a"
			if (aHasAba && !bHasAba) {
				return -1; // a comes first
			}
			if (!aHasAba && bHasAba) {
				return 1; // b comes first
			}

			// Secondary sort (only if both have "a" or neither has "a"): prioritize strings with "cri"
			if (aHasCri && !bHasCri) {
				return -1; // a comes first
			}
			if (!aHasCri && bHasCri) {
				return 1; // b comes first
			}

			// If both have the same criteria status (both have "a" and "cri", or neither, etc.), maintain original relative order or sort alphabetically if needed (not requested here)
			return 0;
		});

		return purposes;

	}




}