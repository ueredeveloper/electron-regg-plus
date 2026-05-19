/**
 * @file finalidade-service.js
 * @description Serviço HTTP para a entidade Finalidade.
 * Espelha FinalidadeService.java:
 *   DELETE /purposes/delete-purpose?id=
 */

const BASE_URL = 'https://app-sis-out-srh-backend-01-h3hkbcf5f8dubbdy.brazilsouth-01.azurewebsites.net'

class FinalidadeService {
  /**
   * @description Remove uma finalidade pelo ID.
   * @param {number|string} id
   * @returns {Promise<void>}
   */
  async deleteById(id) {
    const res = await fetch(`${BASE_URL}/purposes/delete-purpose?id=${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`finalidade/deleteById: HTTP ${res.status} ${res.statusText}`)
  }
}

module.exports = FinalidadeService
