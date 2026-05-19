/**
 * @file domain-service.js
 * @description Serviço HTTP para tabelas de domínio do sistema.
 * Espelha DominioService.java: fetchAllDomainsTables chama
 *   GET /domains/fetch-all-domain-tables
 * Retorna todas as tabelas de domínio em um único request, evitando
 * múltiplas chamadas para popular os selects de InterferenceView.
 */

const path          = require('path')
const { writeJson } = require('../utils/write-json')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const SAMPLE_OUT = path.join(__dirname, 'json', 'domain-fetch-all.json')

class DomainService {
  /**
   * @description Busca todas as tabelas de domínio do sistema em um único request.
   * Equivale a: GET /domains/fetch-all-domain-tables
   * Cada chave retorna um objeto indexado por ID, ex.: { "1": { id, descricao }, ... }.
   * @returns {Promise<Object>} Mapa de domínios indexado por nome da tabela.
   */
  async fetchAll() {
    const res = await fetch(`${BASE_URL}/domains/fetch-all-domain-tables`)
    if (!res.ok) throw new Error(`fetchAll: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeJson(SAMPLE_OUT, data)
    return data
  }

  /**
   * @description Lista todas as bacias hidrográficas cadastradas.
   * Equivale a: GET /hydrographic-basins/list-all
   * @returns {Promise<Object[]>} Lista de bacias { id, descricao }.
   */
  async listBacias() {
    const res = await fetch(`${BASE_URL}/hydrographic-basins/list-all`)
    if (!res.ok) throw new Error(`listBacias: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeJson(path.join(__dirname, 'json', 'domain-bacias.json'), data)
    return Array.isArray(data) ? data : Object.values(data)
  }

  /**
   * @description Lista todas as unidades hidrográficas cadastradas.
   * Equivale a: GET /hydrographic-units/list-all
   * @returns {Promise<Object[]>} Lista de unidades { id, descricao }.
   */
  async listUnidades() {
    const res = await fetch(`${BASE_URL}/hydrographic-units/list-all`)
    if (!res.ok) throw new Error(`listUnidades: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeJson(path.join(__dirname, 'json', 'domain-unidades.json'), data)
    return Array.isArray(data) ? data : Object.values(data)
  }
}

module.exports = DomainService
