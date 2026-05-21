/**
 * @file user-service.js
 * @description Serviço HTTP para a entidade Usuário.
 */

const path          = require('path')
const { writeJson } = require('../utils/write-json')
const { getAuthHeaders } = require('../utils/http-headers')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_FETCH  = path.join(__dirname, 'json', 'user-fetch-by-keyword.json')
const OUT_SAVE   = path.join(__dirname, 'json', 'user-save-response.json')
const OUT_DELETE = path.join(__dirname, 'json', 'user-delete-response.json')

class UserService {
  
  async fetchByKeyword(keyword) {
    const url = `${BASE_URL}/users/search-users-by-param?param=${encodeURIComponent(keyword)}`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`fetchByKeyword: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) writeJson(OUT_FETCH, data[0])
    return Array.isArray(data) ? data : []
  }

  async save(user) {
    const res = await fetch(`${BASE_URL}/users/upsert-user`, {
      method:  'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body:    JSON.stringify(user)
    })
    if (!res.ok) throw new Error(`save: HTTP ${res.status} ${res.statusText}`)
    const raw = await res.json()
    writeJson(OUT_SAVE, raw)
    return raw
  }

  async fetchByDocumentId(docId) {
    const url = `${BASE_URL}/users/search-users-by-document-id?docId=${encodeURIComponent(docId)}`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`fetchByDocumentId: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  }

  async deleteById(id) {
    const res  = await fetch(`${BASE_URL}/users/delete-user-by-id?id=${id}`, {
      method: 'DELETE', headers: getAuthHeaders()
    })
    const text = await res.text().catch(() => '')
    const data = text ? JSON.parse(text) : null
    writeJson(OUT_DELETE, { timestamp: new Date().toISOString(), id: Number(id), status: res.status, body: data })
    if (!res.ok) throw new Error(`deleteById: HTTP ${res.status} ${res.statusText}`)
    if (data?.status === 'erro') throw new Error(data.mensagem ?? 'Erro ao excluir usuário.')
  }
}

module.exports = UserService
