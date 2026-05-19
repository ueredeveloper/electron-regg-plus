/**
 * @file coord-converter.js
 * @description Orquestrador do conversor de coordenadas. Monta os painéis
 * CcUtm, CcGms e CcResult e gerencia a troca de abas.
 */
const CoordConverter = (() => {
  let _mounted = false
  let _container = null

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

  function _render() {
    _container.innerHTML = `
      <div class="cc-wrapper">
        <div class="cc-tabbar">
          <span class="cc-title">Conversor de Coordenadas</span>
          <div class="cc-tabs">
            <button class="cc-tab active" data-tab="utm">UTM</button>
            <button class="cc-tab" data-tab="gms">GMS</button>
          </div>
        </div>
        <div id="ccUtmPanel" class="cc-panel"></div>
        <div id="ccGmsPanel" class="cc-panel" hidden></div>
      </div>
    `
    CcUtm.mount(_container.querySelector('#ccUtmPanel'))
    CcGms.mount(_container.querySelector('#ccGmsPanel'))
  }

  function _bindEvents() {
    _container.querySelectorAll('.cc-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        _container.querySelectorAll('.cc-tab').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const tab = btn.dataset.tab
        _container.querySelector('#ccUtmPanel').hidden = (tab !== 'utm')
        _container.querySelector('#ccGmsPanel').hidden = (tab !== 'gms')
      })
    })
  }

  return { mount, isMounted }
})()
