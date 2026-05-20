/**
 * @file hidrogeo-poroso-service.js
 * @description Serviço HTTP para a entidade Hidrogeo Poroso.
 */

const path     = require('path')
const { writeJson } = require('../utils/write-json')
const { getAuthHeaders } = require('../utils/http-headers')

const BASE_URL  = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const _JSON_DIR = path.join(__dirname, 'json')

class HidrogeoPorosoService {
  _map(p) {
    return {
      id:       p.objectid,
      codPlan:  p.codPlan  ?? null,
      descricao: p.sistema ?? p.codPlan ?? '',
      qMedia:   p.qMedia   ?? null
    }
  }

  async listAll() {
    const res = await fetch(`${BASE_URL}/hydrogeo-poroso/list-all`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`poroso/listAll: HTTP ${res.status} ${res.statusText}`)
    const data  = await res.json()
    const items = Array.isArray(data) ? data : Object.values(data)
    items.sort((a, b) => (a.sistema ?? '').localeCompare(b.sistema ?? '', 'pt'))
    return items.map(p => this._map(p))
  }

  async findByPoint(lat, lng) {
    const res = await fetch(
      `${BASE_URL}/hydrogeo-poroso/find-by-point?latitude=${lat}&longitude=${lng}`,
      { headers: getAuthHeaders() }
    )
    if (!res.ok) throw new Error(`poroso/findByPoint: HTTP ${res.status} ${res.statusText}`)
    const data   = await res.json()
    const items  = Array.isArray(data) ? data : Object.values(data)
    const result = items.map(p => this._map(p))
    writeJson(path.join(_JSON_DIR, 'poroso-find-by-point.json'), {
      timestamp: new Date().toISOString(), params: { lat, lng }, result
    })
    return result
  }

  async findByCodPlan(codPlan) {
    const res = await fetch(
      `${BASE_URL}/poroso/list-by-cod-plan?codPlan=${encodeURIComponent(codPlan)}`,
      { headers: getAuthHeaders() }
    )
    if (!res.ok) throw new Error(`poroso/findByCodPlan: HTTP ${res.status} ${res.statusText}`)
    const data   = await res.json()
    const items  = Array.isArray(data) ? data : Object.values(data)
    const result = items.map(p => this._map(p))
    writeJson(path.join(_JSON_DIR, 'poroso-find-by-cod-plan.json'), {
      timestamp: new Date().toISOString(), params: { codPlan }, result
    })
    return result
  }
}

module.exports = HidrogeoPorosoService
