/**
 * @file interference-service.js
 * @description Serviço HTTP para a entidade Interferência.
 * Espelha InterferenciaService.java: fetchByKeyword chama
 *   GET /interferences/search-interferences-by-param?param=<keyword>
 * A resposta aninhada é normalizada para um objeto plano antes de retornar.
 */

const path           = require('path')
const { writeJson } = require('../utils/write-json')
const { getAuthHeaders } = require('../utils/http-headers')

const BASE_URL          = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const SAMPLE_OUT        = path.join(__dirname, 'json', 'interference-fetch-by-keyword.json')
const FETCH_BY_ADDR_OUT = path.join(__dirname, 'json', 'interference-fetch-by-address-id.json')
const SAVE_OUT          = path.join(__dirname, 'json', 'interference-save-response.json')
const UPDATE_OUT        = path.join(__dirname, 'json', 'interference-update-response.json')
const DELETE_OUT        = path.join(__dirname, 'json', 'interference-delete-response.json')

class InterferenceService {
  /**
   * @description Busca interferências por logradouro ou coordenadas.
   * Equivale a: GET /interferences/search-interferences-by-param?param=<keyword>
   * @param {string} keyword - Termo de busca.
   * @returns {Promise<Object[]>} Lista de interferências normalizadas.
   */
  async fetchByKeyword(keyword) {
    const url = `${BASE_URL}/interferences/search-interferences-by-param?param=${encodeURIComponent(keyword)}`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`fetchByKeyword: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) writeJson(SAMPLE_OUT, data[0])

    return Array.isArray(data) ? data.map(i => this._normalize(i)) : []
  }

  /**
   * @description Persiste ou atualiza uma interferência.
   * @param {Object} interference
   * @returns {Promise<Object>}
   */
  async save(interference) {
    const res = await fetch(`${BASE_URL}/interferences/upsert-interference`, {
      method:  'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body:    JSON.stringify(interference)
    })
    const data = await res.json().catch(() => null)
    writeJson(SAVE_OUT, { timestamp: new Date().toISOString(), status: res.status, body: data })
    if (!res.ok) throw new Error(`save: HTTP ${res.status} ${res.statusText}`)
    return data
  }

  /**
   * @description Atualiza uma interferência existente (mesmo endpoint upsert, inclui id).
   * @param {Object} interference - Payload com o campo id preenchido.
   * @returns {Promise<Object>}
   */
  async update(interference) {
    const res = await fetch(`${BASE_URL}/interferences/upsert-interference`, {
      method:  'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body:    JSON.stringify(interference)
    })
    const data = await res.json().catch(() => null)
    writeJson(UPDATE_OUT, { timestamp: new Date().toISOString(), status: res.status, body: data })
    if (!res.ok) throw new Error(`update: HTTP ${res.status} ${res.statusText}`)
    return data
  }

  /**
   * @description Remove uma interferência pelo ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  /**
   * @description Busca interferências sem normalizar — retorna o objeto aninhado bruto da API.
   * Usado pelos templates para acessar campos como tipoPoco.descricao, finalidades etc.
   * @param {string} keyword - Termo de busca.
   * @returns {Promise<Object[]>} Lista de interferências brutas.
   */
  async fetchRawByKeyword(keyword) {

    const url = `${BASE_URL}/interferences/search-interferences-by-param?param=${encodeURIComponent(keyword)}`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`fetchRawByKeyword: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  }

  /**
   * @description Busca interferências com demandas pelo ID do endereço.
   * Equivale a: GET /interferences/search-interferences-by-address-id?addId=<id>
   * Retorna os objetos brutos da API incluindo dt_demanda.vol_anual_ma.
   * @param {number|string} addId - ID do endereço.
   * @returns {Promise<Object[]>} Lista de interferências brutas com demandas.
   */
  async fetchRawByAddressId(addId) {

    const res = await fetch(
      `${BASE_URL}/interferences/search-interferences-by-address-id?addId=${addId}`,
      { headers: getAuthHeaders() }
    )
    if (!res.ok) throw new Error(`fetchRawByAddressId: HTTP ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) writeJson(FETCH_BY_ADDR_OUT, data[0])
    return Array.isArray(data) ? data : []
  }

  async deleteById(id) {
    const res  = await fetch(`${BASE_URL}/interferences/delete-interference?id=${id}`, { method: 'DELETE', headers: getAuthHeaders() })
    const text = await res.text().catch(() => '')
    let data = null
    try { data = text ? JSON.parse(text) : null } catch { data = null }
    writeJson(DELETE_OUT, { timestamp: new Date().toISOString(), id, status: res.status, body: data })
    if (!res.ok) throw new Error(`deleteById: HTTP ${res.status} ${res.statusText}`)
    if (data?.status === 'erro') throw new Error(data.mensagem ?? 'Erro ao excluir interferência.')
  }

  /**
   * @description Normaliza o objeto de interferência da API para campos planos.
   * Estrutura da API: { id, latitude, longitude,
   *   endereco: { id, logradouro, cidade, estado: { sigla } },
   *   tipoInterferencia: { id, descricao }, tipoOutorga: { id, descricao },
   *   subtipoOutorga: { id, descricao }, situacaoProcesso: { id, descricao },
   *   tipoAto: { id, descricao }, baciaHidrografica: { id, descricao },
   *   unidadeHidrografica: { id, descricao } }
   * @param {Object} obj
   * @returns {Object}
   */
  _normalize(obj) {
    const end  = obj.endereco             || {}
    const est  = end.estado               || {}
    const ti   = obj.tipoInterferencia    || {}
    const to   = obj.tipoOutorga          || {}
    const sto  = obj.subtipoOutorga       || {}
    const sp   = obj.situacaoProcesso     || {}
    const ta   = obj.tipoAto              || {}
    const bh   = obj.baciaHidrografica    || {}
    const uh   = obj.unidadeHidrografica  || {}
    const tp   = obj.tipoPoco             || {}

    return {
      id:                    obj.id,
      latitude:              obj.latitude  ?? null,
      longitude:             obj.longitude ?? null,
      enderecoId:            end.id        ?? null,
      logradouro:            end.logradouro ?? null,
      enderecoLabel:         end.logradouro
        ? (end.cidade || est.sigla
            ? `${end.logradouro} — ${[end.cidade, est.sigla].filter(Boolean).join('/')}`
            : end.logradouro)
        : null,
      tipoInterferenciaId:   ti.id         ?? null,
      tipoInterferencia:     ti.descricao  ?? null,
      tipoOutorgaId:         to.id         ?? null,
      tipoOutorga:           to.descricao  ?? null,
      subtipoOutorgaId:      sto.id        ?? null,
      subtipoOutorga:        sto.descricao ?? null,
      situacaoProcessoId:    sp.id         ?? null,
      situacaoProcesso:      sp.descricao  ?? null,
      tipoAtoId:             ta.id         ?? null,
      tipoAto:               ta.descricao  ?? null,
      baciaHidrograficaId:   bh.objectid   ?? null,
      baciaHidrografica:     bh.baciaNome  ?? bh.descricao  ?? null,
      unidadeHidrograficaId: uh.objectid   ?? null,
      unidadeHidrografica:   uh.uhNome     ?? uh.descricao  ?? null,
      tipoPoco:              tp.id         ?? null,
      caesb:                 obj.caesb     ?? null,
      sistema:               obj.sistema   ?? null,
      subsistema:            obj.subsistema ?? null,
      codPlan:               obj.codPlan   ?? obj.codigoSubsistema ?? null,
      vazaoSistema:          obj.vazaoSistema     ?? null,
      vazaoOutorgavel:       obj.vazaoOutorgavel  ?? null,
      vazaoTeste:            obj.vazaoTeste       ?? null,
      nivelEstatico:         obj.nivelEstatico    ?? null,
      nivelDinamico:         obj.nivelDinamico    ?? null,
      profundidade:          obj.profundidade     ?? null,
      finalidades:           Array.isArray(obj.finalidades) ? obj.finalidades : [],
      demandas:              Array.isArray(obj.demandas)    ? obj.demandas    : []
    }
  }
}

module.exports = InterferenceService
