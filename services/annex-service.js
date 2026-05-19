/**
 * @file annex-service.js
 * @description Serviço HTTP para a entidade Anexo (Processo Principal).
 * Espelha AnexoService.java: fecthByKeyword chama
 *   GET /attachments/search-attachments-by-param?param=<keyword>
 */


const path          = require('path')
const { appendJson, writeJson } = require('../utils/write-json')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_FETCH  = path.join(__dirname, 'json', 'annex-fetch-by-keyword.json')
const OUT_SAVE   = path.join(__dirname, 'json', 'annex-save-response.json')
const OUT_DELETE = path.join(__dirname, 'json', 'annex-delete-response.json')

class AnnexService {
  /**
   * @description Busca anexos pelo número do processo principal.
   * Equivale a: GET /attachments/search-attachments-by-param?param=<keyword>
   * @param {string} keyword - Termo de busca.
   * @returns {Promise<Object[]>} Lista de anexos.
   */
  async fetchByKeyword(keyword) {
    const url = `${BASE_URL}/attachments/search-attachments-by-param?param=${encodeURIComponent(keyword)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetchByKeyword: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) writeJson(OUT_FETCH, data[0])
    return Array.isArray(data) ? data : []
  }

  /**
   * @description Persiste ou atualiza um anexo.
   * @param {Object} annex
   * @returns {Promise<Object>}
   */
  async save(annex) {
    const res = await fetch(`${BASE_URL}/attachments/upsert-attachment`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(annex)
    })
    if (!res.ok) throw new Error(`save: HTTP ${res.status} ${res.statusText}`)
    const raw = await res.json()
    appendJson(OUT_SAVE, raw)
    return raw
  }

  /**
   * @description Remove um anexo pelo ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteById(id) {
    const res  = await fetch(`${BASE_URL}/attachments/delete-attachment?id=${id}`, { method: 'DELETE' })
    const text = await res.text().catch(() => '')
    const data = text ? JSON.parse(text) : null
    appendJson(OUT_DELETE, { timestamp: new Date().toISOString(), id: Number(id), status: res.status, body: data })
    if (!res.ok) throw new Error(`deleteById: HTTP ${res.status} ${res.statusText}`)
    if (data?.status === 'erro') throw new Error(data.mensagem ?? 'Erro ao excluir processo principal.')
  }
}

module.exports = AnnexService
