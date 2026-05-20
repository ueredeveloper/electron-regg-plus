/**
 * @file domain-service.js
 * @description Serviço HTTP para tabelas de domínio do sistema.
 */

const path          = require('path')
const { writeJson } = require('../utils/write-json')
const { getAuthHeaders } = require('../utils/http-headers')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const SAMPLE_OUT = path.join(__dirname, 'json', 'domain-fetch-all.json')

class DomainService {
  async fetchAll() {
    const res = await fetch(`${BASE_URL}/domains/fetch-all-domain-tables`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`fetchAll: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeJson(SAMPLE_OUT, data)
    return data
  }

  async listBacias() {
    const res = await fetch(`${BASE_URL}/hydrographic-basins/list-all`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`listBacias: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeJson(path.join(__dirname, 'json', 'domain-bacias.json'), data)
    return Array.isArray(data) ? data : Object.values(data)
  }

  async listUnidades() {
    const res = await fetch(`${BASE_URL}/hydrographic-units/list-all`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`listUnidades: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeJson(path.join(__dirname, 'json', 'domain-unidades.json'), data)
    return Array.isArray(data) ? data : Object.values(data)
  }
}

module.exports = DomainService
