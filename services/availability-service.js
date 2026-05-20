/**
 * @file availability-service.js
 * @description Busca pontos cadastrados dentro de um subsistema hidrogeológico
 * para análise de disponibilidade de outorga.
 */

const path = require('path')
const { writeJson } = require('../utils/write-json')
const { getAuthHeaders } = require('../utils/http-headers')

const BASE_URL  = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_FETCH = path.join(__dirname, 'json', 'availability-find-points.json')

class AvailabilityService {
  /**
   * @param {1|2|3} tpId  Tipo de poço: 1=Manual, 2=Tubular Raso, 3=Tubular Profundo.
   *                       Internamente mapeia 1 ou 2 → 1 e 3 → 2 conforme o backend.
   * @param {number} lat
   * @param {number} lng
   * @returns {Promise<{ _points: any[], _hg_info: object, _hg_shape: object }>}
   */
  async findPointsInSystem(tpId, lat, lng) {
    const _tpId = (tpId === 1 || tpId === 2) ? 1 : 2
    const res = await fetch(
      `${BASE_URL}/find-points-inside-subsystem?tp_id=${_tpId}&lat=${lat}&lng=${lng}`,
      { headers: getAuthHeaders() }
    )
    if (!res.ok) throw new Error(`availability/findPoints: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeJson(OUT_FETCH, data)
    return data
  }
}

module.exports = AvailabilityService
