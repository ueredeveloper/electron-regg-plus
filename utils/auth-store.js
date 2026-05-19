/**
 * @file auth-store.js
 * @description Armazena o token JWT em memória no processo main.
 * Usado pelo interceptor de fetch em main.js para injetar o header
 * Authorization: Bearer <token> em todas as requisições de serviço.
 */

let _token = ''

module.exports = {
  /** @param {string} token */
  setToken: (token) => { _token = token || '' },
  /** @returns {string} */
  getToken: () => _token
}
