/**
 * @nome Endereco
 * @diretorio models
 * @descricao Modelos de Tabelas
 * @arquivo endereco-model.js
 * @id 
 *
 *
 */
class EnderecoModel {
    constructor() { }

    // Método para obter a interferência
    getSample() {
        return {
            id: 1,
            logradouro: "Rua Borges, 3, Lote 0"
        }
    }
    getLogradouro(endereco) {

        let logradouro = endereco?.logradouro || 'XXX';
        let bairro = endereco?.bairro || 'XXX';
        return logradouro + ', ' + bairro;
    }

}