/**
 * @file interference-list.js
 * @description Componente de pesquisa e listagem de interferências (drawer).
 * Mantém cache interno _ifRows com os dados normalizados para preencher o formulário ao selecionar.
 *
 * Eventos disparados:
 *  - `interference-list:select`  → linha clicada; detalha o objeto normalizado completo.
 *  - `interference-list:deleted` → interferência excluída com sucesso { id }.
 */

const InterferenceList = (() => {
  let _mounted = false
  let _ifRows  = []

  /**
   * @description Renderiza o componente no container e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <div class="doc-list-container">
        <div class="doc-list-header">
          <span class="doc-list-title">Pesquisar Interferências</span>
        </div>
        <div class="doc-search-bar">
          <div class="form-group grow">
            <input type="text" id="iflSearch"
              placeholder="Pesquisar por endereço..."
              autocomplete="off">
          </div>
          <button type="button" id="iflSearchBtn" class="btn btn-primary">Pesquisar</button>
        </div>
        <div class="doc-list-wrap">
          <table class="doc-list-table" aria-label="Lista de interferências">
            <thead>
              <tr>
                <th style="width:32%">Logradouro</th>
                <th style="width:18%">Latitude</th>
                <th style="width:18%">Longitude</th>
                <th style="width:22%">Tipo</th>
                <th style="width:44px"></th>
              </tr>
            </thead>
            <tbody id="iflListBody"></tbody>
          </table>
          <p class="doc-list-empty" id="iflListEmpty" hidden>Nenhuma interferência encontrada.</p>
        </div>
      </div>
    `
    _bindEvents()
    _mounted = true
  }

  function _bindEvents() {
    _el('iflSearchBtn').addEventListener('click', () => _search(_el('iflSearch').value.trim()))
    _el('iflSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') _search(_el('iflSearch').value.trim())
    })
  }

  async function _search(term) {
    try {
      const rows = await window.interferenceService.fetchByKeyword(term)
      _ifRows = rows
      _renderRows(rows)
    } catch (err) {
      console.error('InterferenceList: erro ao buscar interferências', err)
      _renderRows([])
    }
  }

  /**
   * @description Popula a tabela com os resultados da busca.
   * @param {Array<Object>} rows - Interferências normalizadas pelo serviço.
   */
  function _renderRows(rows) {
    const tbody = _el('iflListBody')
    const empty = _el('iflListEmpty')

    if (!rows.length) {
      tbody.innerHTML = ''
      empty.removeAttribute('hidden')
      return
    }

    empty.setAttribute('hidden', '')
    tbody.innerHTML = rows.map(r => `
      <tr class="doc-list-row" data-id="${r.id}">
        <td title="${r.logradouro || ''}">${r.logradouro || '—'}</td>
        <td>${r.latitude  ?? '—'}</td>
        <td>${r.longitude ?? '—'}</td>
        <td>${r.tipoInterferencia || '—'}</td>
        <td class="doc-list-action-cell">
          <button type="button" class="doc-list-delete-btn" title="Excluir">${_trashSvg()}</button>
        </td>
      </tr>`).join('')

    tbody.querySelectorAll('.doc-list-row').forEach(tr =>
      tr.addEventListener('click', () => _pickRow(tr))
    )
    tbody.querySelectorAll('.doc-list-delete-btn').forEach(btn =>
      btn.addEventListener('click', e => { e.stopPropagation(); _deleteRow(btn.closest('tr')) })
    )
  }

  /**
   * @description Despacha evento com o objeto normalizado completo da linha selecionada.
   * @param {HTMLTableRowElement} tr
   */
  function _pickRow(tr) {
    const r = _ifRows.find(row => String(row.id) === tr.dataset.id)
    if (!r) return
    _el('iflListBody').querySelectorAll('.doc-list-row')
      .forEach(row => row.classList.remove('selected'))
    tr.classList.add('selected')
    document.dispatchEvent(new CustomEvent('interference-list:select', { detail: r }))
  }

  /**
   * @description Remove uma interferência pelo id.
   * @param {HTMLTableRowElement} tr
   */
  async function _deleteRow(tr) {
    const id   = tr.dataset.id
    const cell = tr.querySelector('.doc-list-action-cell')

    const origHTML = cell.innerHTML
    const restore  = () => {
      cell.innerHTML = origHTML
      cell.querySelector('.doc-list-delete-btn')
          ?.addEventListener('click', e => { e.stopPropagation(); _deleteRow(tr) })
    }

    cell.innerHTML = `
      <button type="button" class="doc-list-confirm-yes" title="Confirmar exclusão">Sim</button>
      <button type="button" class="doc-list-confirm-no"  title="Cancelar">Não</button>`

    cell.querySelector('.doc-list-confirm-no').addEventListener('click', e => { e.stopPropagation(); restore() })
    cell.querySelector('.doc-list-confirm-yes').addEventListener('click', async e => {
      e.stopPropagation()
      try {
        await window.interferenceService.deleteById(id)
        document.dispatchEvent(new CustomEvent('interference-list:deleted', { detail: { id } }))
        _ifRows = _ifRows.filter(r => String(r.id) !== id)
        tr.remove()
        if (!_el('iflListBody').children.length) _el('iflListEmpty').removeAttribute('hidden')
      } catch (err) {
        console.error('InterferenceList: erro ao excluir interferência', err)
        window.showToast?.(_deletionErrorMsg(err.message), 'error')
        restore()
      }
    })
  }

  /**
   * @description Converte mensagem de erro de FK em texto amigável.
   * @param {string} msg
   * @returns {string}
   */
  function _deletionErrorMsg(msg) {
    if (!msg) return 'Não foi possível excluir a interferência.'
    const tableLabels = { demanda: 'uma demanda' }
    const m = msg.match(/on table "([^"]+)"$/)
    if (m) {
      const label = tableLabels[m[1]] ?? `"${m[1]}"`
      return `Esta interferência não pode ser excluída pois está vinculada a ${label}.`
    }
    return `Não foi possível excluir a interferência.\n${msg}`
  }

  /**
   * @description Insere ou move uma interferência para o topo da tabela com destaque.
   * Aceita o objeto normalizado completo para permitir re-preenchimento do formulário ao clicar.
   * @param {Object} r - Objeto normalizado (mesmo formato de fetchByKeyword).
   */
  function prependRow(r) {
    if (!r?.id) return
    const tbody = _el('iflListBody')
    const empty = _el('iflListEmpty')

    const idx = _ifRows.findIndex(row => String(row.id) === String(r.id))
    if (idx >= 0) _ifRows.splice(idx, 1)
    _ifRows.unshift(r)

    tbody.querySelector(`tr[data-id="${r.id}"]`)?.remove()

    const tr = document.createElement('tr')
    tr.className  = 'doc-list-row'
    tr.dataset.id = String(r.id)
    tr.innerHTML  = `
      <td title="${r.logradouro || ''}">${r.logradouro || '—'}</td>
      <td>${r.latitude  ?? '—'}</td>
      <td>${r.longitude ?? '—'}</td>
      <td>${r.tipoInterferencia || '—'}</td>
      <td class="doc-list-action-cell">
        <button type="button" class="doc-list-delete-btn" title="Excluir">${_trashSvg()}</button>
      </td>
    `
    tbody.prepend(tr)
    empty.setAttribute('hidden', '')

    tr.addEventListener('click', () => _pickRow(tr))
    tr.querySelector('.doc-list-delete-btn').addEventListener('click', e => {
      e.stopPropagation(); _deleteRow(tr)
    })

    void tr.offsetWidth
    tr.classList.add('doc-list-row--flash')
  }

  /** @description Limpa a busca, a tabela e o cache de linhas. */
  function reset() {
    if (!_mounted) return
    _el('iflSearch').value = ''
    _el('iflListBody').innerHTML = ''
    _el('iflListEmpty').setAttribute('hidden', '')
    _ifRows = []
  }

  function _trashSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>`
  }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, prependRow, reset, isMounted }
})()
