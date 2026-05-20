/**
 * @file process-service.js
 * @description Serviço HTTP para a entidade Processo.
 */

const path          = require('path')
const { appendJson, writeJson } = require('../utils/write-json')
const { getAuthHeaders } = require('../utils/http-headers')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_FETCH  = path.join(__dirname, 'json', 'process-fetch-by-keyword.json')
const OUT_SAVE   = path.join(__dirname, 'json', 'process-save-response.json')
const OUT_DELETE = path.join(__dirname, 'json', 'process-delete-response.json')

class ProcessService {
  async fetchByKeyword(keyword) {
    const url = `${BASE_URL}/processes/search-processes-by-param?param=${encodeURIComponent(keyword)}`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`fetchByKeyword: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) writeJson(OUT_FETCH, data[0])
    return Array.isArray(data) ? data.map(p => this._normalize(p)) : []
  }

  async save(process) {
    const res = await fetch(`${BASE_URL}/processes/upsert-process`, {
      method:  'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body:    JSON.stringify(process)
    })
    if (!res.ok) throw new Error(`save: HTTP ${res.status} ${res.statusText}`)
    const raw = await res.json()
    appendJson(OUT_SAVE, raw)
    return raw
  }

  async deleteById(id) {
    const res  = await fetch(`${BASE_URL}/processes/delete-process?id=${id}`, {
      method: 'DELETE', headers: getAuthHeaders()
    })
    const text = await res.text().catch(() => '')
    const data = text ? JSON.parse(text) : null
    appendJson(OUT_DELETE, { timestamp: new Date().toISOString(), id: Number(id), status: res.status, body: data })
    if (!res.ok) throw new Error(`deleteById: HTTP ${res.status} ${res.statusText}`)
    if (data?.status === 'erro') throw new Error(data.mensagem ?? 'Erro ao excluir processo.')
  }

  _normalize(proc) {
    const user = proc.usuario || {}
    const anx  = proc.anexo   || {}
    return {
      id:           proc.id,
      numero:       proc.numero ?? null,
      usuarioId:    user.id     ?? null,
      usuarioNome:  user.nome   ?? null,
      anexoId:      anx.id      ?? null,
      anexoNumero:  anx.numero  ?? null
    }
  }
}

module.exports = ProcessService
