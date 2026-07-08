/**
 * @file jwt.js
 * @description Decodifica o payload de um JWT (sem validar assinatura) para
 * inspecionar a claim `exp`. Usado no processo main para detectar tokens
 * expirados antes/depois das requisições ao backend.
 */

/**
 * @param {string} token
 * @returns {object|null}
 */
function decode(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
  } catch {
    return null
  }
}

/**
 * @param {string} token
 * @returns {boolean} true se o token estiver ausente, malformado, ou expirado.
 */
function isExpired(token) {
  if (!token) return true
  const payload = decode(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

module.exports = { decode, isExpired }
