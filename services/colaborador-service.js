/**
 * @file colaborador-service.js
 * @description Serviço HTTP para autenticação de colaboradores.
 * Base: http://localhost:3000
 * Registra tentativas de login e cadastro em JSON para inspeção em desenvolvimento.
 */

const path = require('path')
const { appendJson } = require('../utils/write-json')

const BASE_URL     = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'
const OUT_LOGIN    = path.join(__dirname, 'json', 'colaborador-login-log.json')
const OUT_UPSERT   = path.join(__dirname, 'json', 'colaborador-upsert-log.json')

class ColaboradorService {
  /**
   * @description Autentica um colaborador e retorna token + dados.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, colaborador: {id: string, email: string}}>}
   */
  async login(email, password) {
    const timestamp = new Date().toISOString()
    let res
    try {
      res = await fetch(`${BASE_URL}/colaboradores/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      })
    } catch (err) {
      appendJson(OUT_LOGIN, { timestamp, email, status: 'network_error', error: err.message })
      throw new Error('Sem conexão com o servidor. Verifique sua rede.')
    }

    let body
    try { body = await res.json() } catch { body = null }

    appendJson(OUT_LOGIN, {
      timestamp,
      email,
      httpStatus: res.status,
      ok:         res.ok,
      body
    })

    if (!res.ok) throw new Error(body?.error || body?.mensagem || `login: HTTP ${res.status} ${res.statusText}`)
    return body
  }

  /**
   * @description Cadastra ou atualiza um colaborador.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async upsert(email, password) {
    const timestamp = new Date().toISOString()
    let res
    try {
      res = await fetch(`${BASE_URL}/colaboradores/upsert-colaborador`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      })
    } catch (err) {
      appendJson(OUT_UPSERT, { timestamp, email, status: 'network_error', error: err.message })
      throw new Error('Sem conexão com o servidor. Verifique sua rede.')
    }

    let body
    try { body = await res.json() } catch { body = null }

    appendJson(OUT_UPSERT, {
      timestamp,
      email,
      httpStatus: res.status,
      ok:         res.ok,
      body
    })

    if (!res.ok) throw new Error(body?.error || body?.mensagem || `upsert: HTTP ${res.status} ${res.statusText}`)
    return body
  }
}

module.exports = ColaboradorService
