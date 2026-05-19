/**
 * @file process-list.js
 * @description Componente de pesquisa e listagem de processos (drawer).
 * Eventos disparados:
 *  - `process-list:select`  → linha clicada { id, label, numero, usuarioNome, anexoNumero }.
 *  - `process-list:deleted` → processo excluído com sucesso { id }.
 */
const ProcessList = (() => {
  let _mounted = false

  /**
   * @description Renderiza o componente no container e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <div class="doc-list-container">
        <div class="doc-list-header">
          <span class="doc-list-title">Pesquisar Processos</span>
        </div>
        <div class="doc-search-bar">
          <div class="form-group grow">
            <input type="text" id="plvSearch"
              placeholder="Pesquisar por número ou nome de usuário..."
              autocomplete="off">
          </div>
          <button type="button" id="plvSearchBtn" class="btn btn-primary">Pesquisar</button>
        </div>
        <div class="doc-list-wrap">
          <table class="doc-list-table" aria-label="Lista de processos">
            <thead>
              <tr>
                <th style="width:41%">Número</th>
                <th style="width:27%">Usuário</th>
                <th style="width:22%">Processo Principal</th>
                <th style="width:44px"></th>
              </tr>
            </thead>
            <tbody id="plvListBody"></tbody>
          </table>
          <p class="doc-list-empty" id="plvListEmpty" hidden>Nenhum processo encontrado.</p>
        </div>
      </div>
    `
    _bindEvents()
    _mounted = true
  }

  function _bindEvents() {
    _el('plvSearchBtn').addEventListener('click', () => _search(_el('plvSearch').value.trim()))
    _el('plvSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') _search(_el('plvSearch').value.trim())
    })
  }

  async function _search(term) {
    try {
      const rows = await window.processService.fetchByKeyword(term)
      _renderRows(rows)
    } catch (err) {
      console.error('ProcessList: erro ao buscar processos', err)
      _renderRows([])
    }
  }

  /**
   * @description Popula a tabela com os resultados da busca.
   * @param {Array<Object>} rows
   */
  function _renderRows(rows) {
    const tbody = _el('plvListBody')
    const empty = _el('plvListEmpty')

    if (!rows.length) {
      tbody.innerHTML = ''
      empty.removeAttribute('hidden')
      return
    }

    empty.setAttribute('hidden', '')
    tbody.innerHTML = rows.map(r => `
      <tr class="doc-list-row"
          data-id="${r.id}"
          data-label="${r.numero}"
          data-numero="${r.numero || ''}"
          data-usuario-id="${r.usuarioId || ''}"
          data-usuario-nome="${r.usuarioNome || ''}"
          data-anexo-id="${r.anexoId || ''}"
          data-anexo-numero="${r.anexoNumero || ''}">
        <td title="${r.numero}">${r.numero}</td>
        <td>${r.usuarioNome || '—'}</td>
        <td>${r.anexoNumero || '—'}</td>
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

  function _pickRow(tr) {
    _el('plvListBody').querySelectorAll('.doc-list-row')
      .forEach(r => r.classList.remove('selected'))
    tr.classList.add('selected')
    document.dispatchEvent(new CustomEvent('process-list:select', {
      detail: {
        id:          tr.dataset.id,
        label:       tr.dataset.label,
        numero:      tr.dataset.numero,
        usuarioId:   tr.dataset.usuarioId,
        usuarioNome: tr.dataset.usuarioNome,
        anexoId:     tr.dataset.anexoId,
        anexoNumero: tr.dataset.anexoNumero
      }
    }))
  }

  /**
   * @description Remove um processo pelo id.
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
        await window.processService.deleteById(id)
        document.dispatchEvent(new CustomEvent('process-list:deleted', { detail: { id } }))
        tr.remove()
        if (!_el('plvListBody').children.length) _el('plvListEmpty').removeAttribute('hidden')
      } catch (err) {
        console.error('ProcessList: erro ao excluir processo', err)
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
    if (!msg) return 'Não foi possível excluir o processo.'
    const tableLabels = { documento: 'um documento', interferencia: 'uma interferência', usuario: 'um usuário' }
    const m = msg.match(/on table "([^"]+)"$/)
    if (m) {
      const label = tableLabels[m[1]] ?? `"${m[1]}"`
      return `Este processo não pode ser excluído pois está vinculado a ${label}.`
    }
    return `Não foi possível excluir o processo.\n${msg}`
  }

  /**
   * @description Insere ou move um processo para o topo da tabela com destaque.
   * @param {Object} r
   */
  function prependRow(r) {
    if (!r?.id) return
    const tbody = _el('plvListBody')
    const empty = _el('plvListEmpty')

    tbody.querySelector(`tr[data-id="${r.id}"]`)?.remove()

    const tr = document.createElement('tr')
    tr.className           = 'doc-list-row'
    tr.dataset.id          = String(r.id)
    tr.dataset.label       = r.numero      || ''
    tr.dataset.numero      = r.numero      || ''
    tr.dataset.usuarioId   = r.usuarioId   || ''
    tr.dataset.usuarioNome = r.usuarioNome || ''
    tr.dataset.anexoId     = r.anexoId     || ''
    tr.dataset.anexoNumero = r.anexoNumero || ''
    tr.innerHTML = `
      <td title="${r.numero}">${r.numero || '—'}</td>
      <td>${r.usuarioNome || '—'}</td>
      <td>${r.anexoNumero || '—'}</td>
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

  /** @description Limpa a busca e a tabela. */
  function reset() {
    if (!_mounted) return
    _el('plvSearch').value = ''
    _el('plvListBody').innerHTML = ''
    _el('plvListEmpty').setAttribute('hidden', '')
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
