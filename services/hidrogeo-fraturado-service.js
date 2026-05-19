/**
 * @file hidrogeo-fraturado-service.js
 * @description Serviço HTTP para a entidade Hidrogeo Fraturado.
 * Espelha HidrogeoFraturadoService.java:
 *   GET /hydrogeo-fraturado/list-all
 *   GET /hydrogeo-fraturado/find-by-point?latitude=&longitude=
 *   GET /fraturado/list-by-cod-plan?codPlan=
 */

const path     = require('path')
const { writeJson } = require('../utils/write-json')

const BASE_URL  = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const _JSON_DIR = path.join(__dirname, 'json')

class HidrogeoFraturadoService {
  _map(f) {
    return {
      id:         f.objectid,
      codPlan:    f.codPlan    ?? null,
      sistema:    f.sistema    ?? '',
      subsistema: f.subsistema ?? '',
      vazao:      f.vazao      ?? null
    }
  }

  /**
   * @description Lista todos os sistemas fraturados cadastrados.
   * @returns {Promise<Array<{id, codPlan, sistema, subsistema, vazao}>>}
   */
  async listAll() {
    const res = await fetch(`${BASE_URL}/hydrogeo-fraturado/list-all`)
    if (!res.ok) throw new Error(`fraturado/listAll: HTTP ${res.status} ${res.statusText}`)
    const data  = await res.json()
    const items = Array.isArray(data) ? data : Object.values(data)
    items.sort((a, b) =>
      (a.sistema ?? '').localeCompare(b.sistema ?? '', 'pt') ||
      (a.subsistema ?? '').localeCompare(b.subsistema ?? '', 'pt')
    )
    return items.map(f => this._map(f))
  }

  /**
   * @description Busca o sistema fraturado que contém o ponto geográfico informado.
   * @param {number|string} lat
   * @param {number|string} lng
   * @returns {Promise<Array<{id, codPlan, sistema, subsistema, vazao}>>}
   */
  async findByPoint(lat, lng) {
    const res = await fetch(`${BASE_URL}/hydrogeo-fraturado/find-by-point?latitude=${lat}&longitude=${lng}`)
    if (!res.ok) throw new Error(`fraturado/findByPoint: HTTP ${res.status} ${res.statusText}`)
    const data   = await res.json()
    const items  = Array.isArray(data) ? data : Object.values(data)
    const result = items.map(f => this._map(f))
    writeJson(path.join(_JSON_DIR, 'fraturado-find-by-point.json'), {
      timestamp: new Date().toISOString(), params: { lat, lng }, result
    })
    return result
  }

  /**
   * @description Busca sistemas fraturados pelo código de planejamento.
   * @param {string} codPlan
   * @returns {Promise<Array<{id, codPlan, sistema, subsistema, vazao}>>}
   */
  async findByCodPlan(codPlan) {
    const res = await fetch(`${BASE_URL}/fraturado/list-by-cod-plan?codPlan=${encodeURIComponent(codPlan)}`)
    if (!res.ok) throw new Error(`fraturado/findByCodPlan: HTTP ${res.status} ${res.statusText}`)
    const data   = await res.json()
    const items  = Array.isArray(data) ? data : Object.values(data)
    const result = items.map(f => this._map(f))
    writeJson(path.join(_JSON_DIR, 'fraturado-find-by-cod-plan.json'), {
      timestamp: new Date().toISOString(), params: { codPlan }, result
    })
    return result
  }
}

module.exports = HidrogeoFraturadoService
