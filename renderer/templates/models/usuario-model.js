/**
 * @nome Usuario
 * @diretorio models
 * @descricao Modelos de Tabelas
 * @direitorio models
 * @arquivo usuario-model.js
 * @id 
 *
 *
 */

class UsuarioModel {

    constructor() {}

    getSample() {
        return {
            nome: "Carlos Drummond de Andrade", 
            cpfCnpj: 12345678955
        }
    }
    getNome (usuario){
         return usuario?.nome;
    }

    /**
     * Cria máscara para CPF e CPNJ
     * @param {*} value 
     * @returns 
    */
    formatCpfCnpj(value) {
    	
        value = value?.toString();

        // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
        if (value.length === 11) {
            // Formatar CPF: 123.456.789-12
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length === 14) {
            // Formatar CNPJ: 12.345.678/0001-00
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else {
            // Se não for CPF ou CNPJ válido, retorna o valor sem formatação
            return value;
        }
    }


}