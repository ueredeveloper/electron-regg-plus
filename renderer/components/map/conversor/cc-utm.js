/**
 * @file cc-utm.js
 * @description Painel UTM do conversor de coordenadas. Emite o evento `cc:converted`
 * com `{ lat, lon }` ao realizar a conversão.
 */
const CcUtm = (() => {
  let _container = null

  /**
   * @description Monta o painel UTM no container informado.
   * @param {HTMLElement} container
   */
  function mount(container) {
    if (!container) return
    _container = container
    _render()
    _bindEvents()
  }

  function _render() {
    _container.innerHTML = `
      <div class="cc-row">
        <div class="cc-field">
          <label>Zona</label>
          <input type="number" id="ccUtmZone" min="1" max="60" value="23">
        </div>
        <div class="cc-field narrow">
          <label>Hem.</label>
          <select id="ccUtmHem">
            <option value="S">S</option>
            <option value="N">N</option>
          </select>
        </div>
        <div class="cc-field grow">
          <label>Leste — E (m)</label>
          <input type="number" id="ccUtmE" value="184973">
        </div>
        <div class="cc-field grow">
          <label>Norte — N (m)</label>
          <input type="number" id="ccUtmN" value="8253357">
        </div>
        <button class="btn btn-primary cc-convert-btn" id="ccUtmBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/>
            <line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/>
            <circle cx="12" cy="12" r="7"/>
          </svg>
          Converter
        </button>
      </div>
    `
  }

  function _bindEvents() {

    _container.querySelector('#ccUtmBtn').addEventListener('click', async () => {
      const e = parseFloat(_container.querySelector('#ccUtmE').value)
      const n = parseFloat(_container.querySelector('#ccUtmN').value)
      const z = parseInt(_container.querySelector('#ccUtmZone').value)
      const h = _container.querySelector('#ccUtmHem').value
      if (isNaN(e) || isNaN(n) || isNaN(z)) {
        showToast('Preencha todos os campos UTM.', 'error')
        return
      }
      try {
        const result = await window.coordService.utmToDecimal(e, n, z, h)
        document.dispatchEvent(new CustomEvent('interference:goto', {
          detail: { lat: result.lat, lng: result.lon }
        }))
      } catch (err) {
        console.error('Erro na conversão UTM:', err)
        showToast('Erro na conversão UTM.', 'error')
      }
    })
  }

  return { mount }
})()
