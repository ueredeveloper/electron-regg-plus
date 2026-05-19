/**
 * @file select-interference.js
 * @description Componente de coordenadas da interferência hídrica.
 * Exibe campos de latitude e longitude lado a lado com o SelectAddress.
 * As coordenadas são preenchidas pelo clique no mapa (via setCoords)
 * ou digitadas manualmente. Emite o evento `interference:goto` para
 * que o renderer.js reposicione o marcador no mapa.
 */
const SelectInterference = (() => {
  let _mounted = false

  /**
   * @description Renderiza o componente e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <fieldset class="form-section form-section--stretch">
        <legend class="section-title">
          <span class="section-icon">📍</span> Interferência
        </legend>
        <div class="form-row">
          <button
            type="button"
            id="ifOpenDrawer"
            class="btn-drawer"
            title="Cadastrar nova interferência"
            aria-label="Cadastrar nova interferência"
          >
            <!-- Lucide: map-pin-plus -->
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 1 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0c.338-.293.964-.868 1.637-1.599"/>
              <circle cx="10" cy="10" r="3"/>
              <path d="M15 22v-6M12 19h6"/>
            </svg>
          </button>
          <div class="form-group grow">
            <label for="ifLat">Latitude <span class="required">*</span></label>
            <input
              type="number"
              id="ifLat"
              name="ifLat"
              placeholder="-15.780000"
              step="any"
            >
          </div>
          <div class="form-group grow">
            <label for="ifLon">Longitude <span class="required">*</span></label>
            <input
              type="number"
              id="ifLon"
              name="ifLon"
              placeholder="-47.930000"
              step="any"
            >
          </div>
          <div class="form-group-inline">
            <!-- Lucide: map-pin — ir ao mapa -->
            <button
              type="button"
              class="btn-map-icon"
              id="btnIfGoto"
              title="Ir ao mapa"
              aria-label="Ir ao mapa"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </button>
          </div>
        </div>
      </fieldset>
    `
    _bindEvents()
    _mounted = true
  }

  /**
   * @description Registra os eventos do botão e da tecla Enter nos inputs.
   */
  function _bindEvents() {
    _el('btnIfGoto').addEventListener('click', _dispatchGoto)
    _el('ifOpenDrawer').addEventListener('click', () => InterferenceView.open())

    const onEnter = (e) => { if (e.key === 'Enter') _dispatchGoto() }
    _el('ifLat').addEventListener('keydown', onEnter)
    _el('ifLon').addEventListener('keydown', onEnter)

    /* Quando o usuário seleciona uma interferência dentro do InterferenceView */
    document.addEventListener('interference-view:select', (e) => {
      if (!_mounted) return
      _el('ifLat').value = e.detail.latitude  ?? ''
      _el('ifLon').value = e.detail.longitude ?? ''
      _el('ifLat').classList.remove('from-map')
      _el('ifLon').classList.remove('from-map')
    })
  }

  /**
   * @description Emite o evento `interference:goto` com as coordenadas digitadas.
   * O renderer.js escuta e reposiciona o mapa e o marcador.
   */
  function _dispatchGoto() {
    const lat = parseFloat(_el('ifLat').value)
    const lng = parseFloat(_el('ifLon').value)
    if (!isNaN(lat) && !isNaN(lng)) {
      document.dispatchEvent(new CustomEvent('interference:goto', { detail: { lat, lng } }))
    }
  }

  /**
   * @description Chamado pelo renderer.js quando o usuário clica no mapa.
   * Preenche os campos e aplica destaque visual de origem-mapa.
   * @param {number} lat
   * @param {number} lng
   */
  function setCoords(lat, lng) {
    if (!_mounted) return
    _el('ifLat').value = lat.toFixed(6)
    _el('ifLon').value = lng.toFixed(6)
    _el('ifLat').classList.add('from-map')
    _el('ifLon').classList.add('from-map')
  }

  /**
   * @description Retorna as coordenadas atuais.
   * @returns {{ latitude: string, longitude: string }}
   */
  function getValue() {
    return {
      latitude:  _el('ifLat')?.value.trim() ?? '',
      longitude: _el('ifLon')?.value.trim() ?? ''
    }
  }

  /**
   * @description Preenche os campos com dados externos (ex.: ao editar um registro).
   * @param {{ latitude?: string, longitude?: string }} data
   */
  function setValue(data = {}) {
    if (!_mounted) return
    _el('ifLat').value = data.latitude  ?? ''
    _el('ifLon').value = data.longitude ?? ''
  }

  /**
   * @description Limpa os campos e remove o destaque de origem-mapa.
   */
  function reset() {
    if (!_mounted) return
    _el('ifLat').value = ''
    _el('ifLon').value = ''
    _el('ifLat').classList.remove('from-map')
    _el('ifLon').classList.remove('from-map')
  }

  /**
   * @description Valida se latitude e longitude foram preenchidas.
   * @returns {boolean}
   */
  function validate() {
    const v = getValue()
    return v.latitude !== '' && v.longitude !== ''
  }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, getValue, setValue, reset, validate, isMounted, setCoords }
})()
