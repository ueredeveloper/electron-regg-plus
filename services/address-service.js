/**
 * @file address-service.js
 * @description Serviço HTTP para a entidade Endereço.
 * Espelha EnderecoService.java: fetchAddressByKeyword chama
 *   GET /addresses/search-address-by-param?param=<keyword>
 * A resposta aninhada é normalizada para um objeto plano antes de retornar.
 */

const path          = require('path')
const { appendJson, writeJson } = require('../utils/write-json')
const { getAuthHeaders } = require('../utils/http-headers')

const BASE_URL   = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_FETCH  = path.join(__dirname, 'json', 'address-fetch-by-keyword.json')
const OUT_SAVE   = path.join(__dirname, 'json', 'address-save-response.json')
const OUT_DELETE = path.join(__dirname, 'json', 'address-delete-response.json')

class AddressService {
  /**
   * @description Busca endereços por logradouro, cidade ou bairro.
   * Equivale a: GET /addresses/search-address-by-param?param=<keyword>
   * @param {string} keyword - Termo de busca.
   * @returns {Promise<Object[]>} Lista de endereços normalizados.
   */
  async fetchByKeyword(keyword) {
    const url = `${BASE_URL}/addresses/search-address-by-param?param=${encodeURIComponent(keyword)}`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`fetchByKeyword: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) writeJson(OUT_FETCH, data[0])
    return Array.isArray(data) ? data.map(a => this._normalize(a)) : []
  }

  /**
   * @description Persiste ou atualiza um endereço.
   * O backend distingue create/update pela presença de `id`.
   * @param {Object} address - Dados do formulário (flat).
   * @returns {Promise<Object>} Endereço normalizado retornado pela API.
   */
  async save(address) {
    const payload = this._toPayload(address)

    const res = await fetch(`${BASE_URL}/addresses/upsert-address`, {
      method:  'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`save: HTTP ${res.status} ${res.statusText}`)
    const raw = await res.json()
    appendJson(OUT_SAVE, raw)
    if (raw?.status === 'erro') return raw
    return this._normalize(raw.object ?? raw)
  }

  /**
   * @description Remove um endereço pelo ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteById(id) {
    const res  = await fetch(`${BASE_URL}/addresses/delete-address?id=${id}`, { method: 'DELETE', headers: getAuthHeaders() })
    const text = await res.text().catch(() => '')
    const data = text ? JSON.parse(text) : null
    appendJson(OUT_DELETE, { timestamp: new Date().toISOString(), id: Number(id), status: res.status, body: data })
    if (!res.ok) throw new Error(`deleteById: HTTP ${res.status} ${res.statusText}`)
    if (data?.status === 'erro') throw new Error(data.mensagem ?? 'Erro ao excluir endereço.')
  }

  /**
   * @description Normaliza o objeto de endereço da API para um objeto plano.
   * Estrutura da API: { id, logradouro, bairro, cidade, cep, estado: { id, descricao/sigla } }
   * @param {Object} addr - Endereço bruto da API.
   * @returns {Object} Endereço com campos planos.
   */
  _normalize(addr) {
    const estado = addr.estado || {}
    return {
      id:         addr.id,
      logradouro: addr.logradouro ?? null,
      bairro:     addr.bairro     ?? null,
      cidade:     addr.cidade     ?? null,
      cep:        addr.cep        ?? null,
      estadoId:   estado.id       ?? null,
      estado:     estado.descricao ?? estado.sigla ?? null
    }
  }

  /**
   * @description Converte o objeto plano do formulário para o formato aninhado
   * esperado pelo backend no upsert.
   *
   * Campos de entrada: { id?, logradouro, bairro, cidade, cep, estado, estadoId? }
   *
   * @param {Object} data - Dados do formulário de endereço.
   * @returns {Object} Payload aninhado para a API.
   */
  _toPayload(data) {
    const payload = {
      documentos:    [],
      interferencias: []
    }

    if (data.id) payload.id = Number(data.id)

    if (data.logradouro) payload.logradouro = data.logradouro
    if (data.cidade)     payload.cidade     = data.cidade
    if (data.bairro)     payload.bairro     = data.bairro
    if (data.cep)        payload.cep        = data.cep

    if (data.estado) {
      payload.estado = { descricao: data.estado }
      if (data.estadoId) payload.estado.id = Number(data.estadoId)
    }

    return payload
  }
}


module.exports = AddressService
