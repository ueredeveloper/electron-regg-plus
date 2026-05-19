/**
 * @file document-chart-view.js
 * @description Overlay de visualização de relacionamentos do documento via ECharts.
 * Sobrepõe o painel direito (igual ao AdministrativeActsView) e carrega
 * relations-charts/document-chart.html num iframe, injetando os dados via contentWindow.
 */
const DocumentChartView = (() => {
  let _mounted   = false
  let _container = null

  /**
   * @description Renderiza a estrutura do overlay e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    _container = container

    container.innerHTML = `
      <div class="aa-overlay" id="dcOverlay" hidden>

        <div class="aa-header av-header">
          <button type="button" class="av-back-btn" id="dcClose">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Fechar
          </button>
          <span class="av-title">Documento - Visão Geral</span>
        </div>

        <iframe id="dcFrame" class="dc-frame" src="" frameborder="0"></iframe>

      </div>
    `

    _el('dcClose').addEventListener('click', close)
    _mounted = true
  }

  /**
   * @description Abre o overlay, busca usuários e interferências em paralelo com o
   * carregamento do iframe e injeta tudo via updateChart(doc, users, interferences).
   * @param {Object} doc - Documento normalizado (flat).
   */
  function open(doc) {
    if (!_mounted) return
    _el('dcOverlay').removeAttribute('hidden')

    const dataPromise = Promise.all([
      doc.id
        ? window.userService.fetchByDocumentId(doc.id).catch(() => [])
        : Promise.resolve([]),
      doc.logradouro
        ? window.interferenceService.fetchByKeyword(doc.logradouro).catch(() => [])
        : Promise.resolve([])
    ])

    const frame = _el('dcFrame')
    frame.src = 'relations-charts/document-chart.html'
    frame.onload = async () => {
      try {
        const [users, interferences] = await dataPromise

        frame.contentWindow._services = {
          deleteUser:         id => window.userService.deleteById(id),
          deleteAddress:      id => window.addressService.deleteById(id),
          deleteInterference: id => window.interferenceService.deleteById(id),
          deleteProcess:      id => window.processService.deleteById(id),
          deleteAnnex:        id => window.annexService.deleteById(id),
          deleteDocument:     id => window.documentService.deleteById(id),
          closeView:          ()  => close()
        }

        if (typeof frame.contentWindow.updateChart === 'function') {
          frame.contentWindow.updateChart(doc, users, interferences)
        }
      } catch (err) {
        console.error('DocumentChartView: erro ao injetar dados no chart', err)
      }
    }
  }

  /** @description Fecha o overlay e descarrega o iframe. */
  function close() {
    if (!_mounted) return
    _el('dcOverlay').setAttribute('hidden', '')
    _el('dcFrame').src = ''
  }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, open, close, isMounted }
})()
