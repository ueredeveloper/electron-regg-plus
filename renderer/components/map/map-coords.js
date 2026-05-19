/**
 * @file map-coords.js
 * @description Barra de coordenadas do marcador no mapa. Oferece copiar coordenadas,
 * centralizar o mapa no ponto e remover o marcador.
 * Emite `map-coords:center` e `map-coords:remove` para o renderer.js.
 */
const MapCoordsBar = (() => {
  let _mounted = false
  let _container = null
  let _lat = null
  let _lng = null

  /**
   * @description Monta o componente no container informado.
   * @param {HTMLElement} container
   */
  function mount(container) {
    if (!container) return
    _container = container
    _mounted = true
    _render()
    _bindEvents()
  }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /**
   * @description Exibe a barra com as coordenadas do marcador.
   * @param {number} lat
   * @param {number} lng
   */
  function show(lat, lng) {
    _lat = lat
    _lng = lng
    _container.querySelector('#coordDisplay').textContent =
      `Lat: ${lat.toFixed(6)}  Lon: ${lng.toFixed(6)}`
    _container.querySelector('#mapCoordsBar').removeAttribute('hidden')
  }

  /** @description Oculta a barra e limpa as coordenadas armazenadas. */
  function hide() {
    _lat = null
    _lng = null
    _container.querySelector('#mapCoordsBar').setAttribute('hidden', '')
  }

  function _render() {
    _container.innerHTML = `
      <div class="map-coords" id="mapCoordsBar" hidden>
        <span id="coordDisplay"></span>
        <div class="mc-actions">
          <button class="mc-icon-btn" id="btnCopyCoords" title="Copiar coordenadas">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="8" height="4" x="8" y="2" rx="1"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            </svg>
          </button>
          <button class="mc-icon-btn" id="btnCenterMap" title="Mostrar no mapa">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="8"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
            </svg>
          </button>
          <button class="btn-link" id="btnRemoveMarker">Remover marcador</button>
        </div>
      </div>
    `
  }

  function _bindEvents() {
    _container.querySelector('#btnCopyCoords').addEventListener('click', () => {
      if (_lat == null) return
      const text = `${_lat.toFixed(6)}, ${_lng.toFixed(6)}`
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => showToast('Erro ao copiar.', 'error'))
      } else {
        showToast('Clipboard não disponível.', 'error')
      }
      showToast('Coordenadas copiadas!', 'success')
    })

    _container.querySelector('#btnCenterMap').addEventListener('click', () => {
      if (_lat == null) return
      document.dispatchEvent(new CustomEvent('map-coords:center', {
        detail: { lat: _lat, lng: _lng }
      }))
    })

    _container.querySelector('#btnRemoveMarker').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('map-coords:remove'))
    })
  }

  return { mount, isMounted, show, hide }
})()
