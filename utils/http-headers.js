/**
 * @file http-headers.js
 * @description Retorna os headers HTTP padrão com o token JWT do processo main.
 * Usado por todos os serviços para garantir que o Authorization seja sempre enviado.
 */
const authStore = require('./auth-store')

/**
 * @returns {{ Authorization: string } | {}} Header de autorização, ou objeto vazio se sem token.
 */
function getAuthHeaders() {
  const token = authStore.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

module.exports = { getAuthHeaders }
