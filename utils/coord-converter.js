/**
 * @file coord-converter.js
 * @description Utilitário de conversão de coordenadas geográficas.
 * Suporta:
 *   - UTM (WGS84) → graus decimais
 *   - Grau, Minuto, Segundo (GMS) → graus decimais
 */

const { point } = require('@turf/helpers')

/**
 * @description Converte coordenadas UTM WGS84 para graus decimais.
 * Implementa a projeção Transverse Mercator inversa (série de Helmert).
 * @param {number} easting  - Leste em metros (ex: 188000)
 * @param {number} northing - Norte em metros (ex: 8261000)
 * @param {number} zone     - Número da zona UTM (1–60)
 * @param {string} hemisphere - 'N' para norte, 'S' para sul
 * @returns {{ lat: number, lon: number }}
 */
function utmToDecimal(easting, northing, zone, hemisphere) {
  const k0 = 0.9996
  const a  = 6378137.0
  const e2 = 0.00669438
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2))
  const ep2 = e2 / (1 - e2)

  const x = easting - 500000.0
  const y = hemisphere.toUpperCase() === 'S' ? northing - 10000000.0 : northing
  const lon0 = (zone - 1) * 6 - 180 + 3

  const M   = y / k0
  const mu  = M / (a * (1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256))

  const phi1 = mu
    + (3 * e1 / 2 - 27 * e1 ** 3 / 32)    * Math.sin(2 * mu)
    + (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu)
    + (151 * e1 ** 3 / 96)                 * Math.sin(6 * mu)
    + (1097 * e1 ** 4 / 512)               * Math.sin(8 * mu)

  const sp = Math.sin(phi1), cp = Math.cos(phi1), tp = Math.tan(phi1)

  const N1 = a / Math.sqrt(1 - e2 * sp * sp)
  const T1 = tp * tp
  const C1 = ep2 * cp * cp
  const R1 = a * (1 - e2) / (1 - e2 * sp * sp) ** 1.5
  const D  = x / (N1 * k0)

  const latRad = phi1 - (N1 * tp / R1) * (
    D ** 2 / 2
    - (5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * ep2) * D ** 4 / 24
    + (61 + 90 * T1 + 298 * C1 + 45 * T1 ** 2 - 252 * ep2 - 3 * C1 ** 2) * D ** 6 / 720
  )

  const lonRad = (
    D
    - (1 + 2 * T1 + C1) * D ** 3 / 6
    + (5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * ep2 + 24 * T1 ** 2) * D ** 5 / 120
  ) / cp

  const lat = latRad * 180 / Math.PI
  const lon = lon0 + lonRad * 180 / Math.PI

  point([lon, lat])

  return { lat: parseFloat(lat.toFixed(7)), lon: parseFloat(lon.toFixed(7)) }
}

/**
 * @description Converte Grau, Minuto e Segundo para graus decimais.
 * @param {number} latD   - Graus da latitude
 * @param {number} latM   - Minutos da latitude
 * @param {number} latS   - Segundos da latitude
 * @param {string} latDir - Direção da latitude ('N' ou 'S')
 * @param {number} lonD   - Graus da longitude
 * @param {number} lonM   - Minutos da longitude
 * @param {number} lonS   - Segundos da longitude
 * @param {string} lonDir - Direção da longitude ('E', 'W' ou 'O')
 * @returns {{ lat: number, lon: number }}
 */
function dmsToDecimal(latD, latM, latS, latDir, lonD, lonM, lonS, lonDir) {
  const _calc = (d, m, s, dir) => {
    const dec = Math.abs(Number(d)) + Number(m) / 60 + Number(s) / 3600
    return ['S', 'W', 'O'].includes(String(dir).toUpperCase()) ? -dec : dec
  }
  const lat = _calc(latD, latM, latS, latDir)
  const lon = _calc(lonD, lonM, lonS, lonDir)
  return { lat: parseFloat(lat.toFixed(7)), lon: parseFloat(lon.toFixed(7)) }
}

module.exports = { utmToDecimal, dmsToDecimal }
