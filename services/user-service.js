/**
 * @file user-service.js
 * @description Serviço HTTP para a entidade Usuário.
 * Espelha UsuarioService.java: listByName chama
 *   GET /users/search-users-by-param?param=<keyword>
 */

const path          = require('path')
const { appendJson, writeJson } = require('../utils/write-json')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_FETCH  = path.join(__dirname, 'json', 'user-fetch-by-keyword.json')
const OUT_SAVE   = path.join(__dirname, 'json', 'user-save-response.json')
const OUT_DELETE = path.join(__dirname, 'json', 'user-delete-response.json')

class UserService {
  /**
   * @description Busca usuários por nome ou CPF/CNPJ.
   * Equivale a: GET /users/search-users-by-param?param=<keyword>
   * @param {string} keyword - Termo de busca.
   * @returns {Promise<Object[]>} Lista de usuários.
   */
  async fetchByKeyword(keyword) {
    const url = `${BASE_URL}/users/search-users-by-param?param=${encodeURIComponent(keyword)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetchByKeyword: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) writeJson(OUT_FETCH, data[0])
    return Array.isArray(data) ? data : []
  }

  /**
   * @description Persiste ou atualiza um usuário.
   * @param {Object} user
   * @returns {Promise<Object>}
   */
  async save(user) {
    const res = await fetch(`${BASE_URL}/users/upsert-user`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(user)
    })
    if (!res.ok) throw new Error(`save: HTTP ${res.status} ${res.statusText}`)
    const raw = await res.json()
    appendJson(OUT_SAVE, raw)
    return raw
  }

  /**
   * @description Remove um usuário pelo ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  /**
   * @description Busca usuários vinculados a um documento pelo seu ID.
   * Equivale a: GET /users/search-users-by-document-id?docId=<id>
   * @param {number|string} docId - ID do documento.
   * @returns {Promise<Object[]>} Lista de usuários.
   */
  async fetchByDocumentId(docId) {
    const url = `${BASE_URL}/users/search-users-by-document-id?docId=${encodeURIComponent(docId)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetchByDocumentId: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  }

  async deleteById(id) {
    const res  = await fetch(`${BASE_URL}/users/delete-user-by-id?id=${id}`, { method: 'DELETE' })
    const text = await res.text().catch(() => '')
    const data = text ? JSON.parse(text) : null
    appendJson(OUT_DELETE, { timestamp: new Date().toISOString(), id: Number(id), status: res.status, body: data })
    if (!res.ok) throw new Error(`deleteById: HTTP ${res.status} ${res.statusText}`)
    if (data?.status === 'erro') throw new Error(data.mensagem ?? 'Erro ao excluir usuário.')
  }
}

module.exports = UserService
