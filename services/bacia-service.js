/**
 * @file bacia-service.js
 * @description Serviço HTTP para a entidade Bacia Hidrográfica.
 * Espelha BaciaHidrograficaService.java:
 *   GET /hydrographic-basins/list-all
 *   GET /hydrographic-basins/find-by-point?latitude=lat&longitude=lng
 */

const path          = require('path')
const { writeJson } = require('../utils/write-json')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const SAMPLE_OUT = path.join(__dirname, 'json', 'bacia-list-all.json')

class BaciaService {
  /**
   * @description Lista todas as bacias hidrográficas cadastradas.
   * @returns {Promise<Array<{id: number, descricao: string}>>}
   */
  async listAll() {
    const res = await fetch(`${BASE_URL}/hydrographic-basins/list-all`)
    if (!res.ok) throw new Error(`listAll: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    const items = Array.isArray(data) ? data : Object.values(data)
    if (items.length > 0) writeJson(SAMPLE_OUT, items[0])
    items.sort((a, b) => (a.baciaCod ?? 0) - (b.baciaCod ?? 0))
    return items.map(b => ({ id: b.objectid, descricao: `${b.baciaCod} - ${b.baciaNome}` }))
  }

  /**
   * @description Busca a bacia hidrográfica que contém o ponto geográfico informado.
   * Retorna o mesmo formato de listAll() — { id, descricao } — para uso direto nos selects.
   * @param {number|string} lat - Latitude.
   * @param {number|string} lng - Longitude.
   * @returns {Promise<Array<{id: number, descricao: string}>>}
   */
  async findByPoint(lat, lng) {
    const url = `${BASE_URL}/hydrographic-basins/find-by-point?latitude=${lat}&longitude=${lng}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`findByPoint: HTTP ${res.status} ${res.statusText}`)
    const data  = await res.json()
    const items = Array.isArray(data) ? data : Object.values(data)
    items.sort((a, b) => (a.baciaCod ?? 0) - (b.baciaCod ?? 0))
    return items.map(b => ({ id: b.objectid, descricao: `${b.baciaCod} - ${b.baciaNome}` }))
  }
}

module.exports = BaciaService
