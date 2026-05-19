/**
 * @file estado-service.js
 * @description Serviço HTTP para a entidade Estado.
 * Espelha EstadoService.java: fetchAll chama GET /states/fetch-all-states.
 */

const path          = require('path')
const { writeJson } = require('../utils/write-json')

const BASE_URL  = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_FETCH = path.join(__dirname, 'json', 'estado-fetch-all.json')

class EstadoService {
  /**
   * @description Retorna todos os estados cadastrados.
   * @returns {Promise<Array<{id: number, descricao: string}>>}
   */
  async fetchAll() {
    const res = await fetch(`${BASE_URL}/states/fetch-all-states`)
    if (!res.ok) throw new Error(`fetchAll: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (Array.isArray(data) && data.length) writeJson(OUT_FETCH, data)
    return Array.isArray(data) ? data : []
  }
}

module.exports = EstadoService
