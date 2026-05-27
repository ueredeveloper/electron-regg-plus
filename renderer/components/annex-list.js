/**
 * @file annex-list.js
 * @description Componente de pesquisa e listagem de processos principais / anexos (drawer).
 * A API retorna { id, numero, processos: [{numero, usuario}] }; cada processo gera uma linha.
 * Eventos disparados:
 *  - `annex-list:select`  → linha clicada { id, label, numero, procNumero, usuarioNome }.
 *  - `annex-list:deleted` → anexo excluído com sucesso { id }.
 */

const AnnexList = (() => {
  let _mounted = false

  /**
   * @description Renderiza o componente no container e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <div class="doc-list-container">
        <div class="doc-list-header">
          <span class="doc-list-title">Pesquisar Processos Principais</span>
        </div>
        <div class="doc-search-bar">
          <div class="form-group grow">
            <input type="text" id="axlSearch"
              placeholder="Pesquisar por número do processo principal..."
              autocomplete="off">
          </div>
          <button type="button" id="axlSearchBtn" class="btn btn-primary">Pesquisar</button>
        </div>
        <div class="doc-list-wrap">
          <table class="doc-list-table" aria-label="Lista de processos principais">
            <thead>
              <tr>
                <th style="width:46%">Processo Principal</th>
                <th style="width:27%">Processo</th>
                <th style="width:17%">Usuário</th>
                <th style="width:44px"></th>
              </tr>
            </thead>
            <tbody id="axlListBody"></tbody>
          </table>
          <p class="doc-list-empty" id="axlListEmpty" hidden>Nenhum processo principal encontrado.</p>
        </div>
      </div>
    `
    _bindEvents()
    _mounted = true
  }

  function _bindEvents() {
    _el('axlSearchBtn').addEventListener('click', () => _search(_el('axlSearch').value.trim()))
    _el('axlSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') _search(_el('axlSearch').value.trim())
    })
  }

  async function _search(term) {
    try {
      const rows = await window.annexService.fetchByKeyword(term)
      _renderRows(rows)
    } catch (err) {
      console.error('AnnexList: erro ao buscar processos principais', err)
      _renderRows([])
    }
  }

  /**
   * @description Popula a tabela. Cada anexo pode ter vários processos; gera uma linha por processo.
   * @param {Array<Object>} rows
   */
  function _renderRows(rows) {
    const tbody = _el('axlListBody')
    const empty = _el('axlListEmpty')

    const flat = rows.flatMap(r => {
      const lista = Array.isArray(r.processos) && r.processos.length
        ? r.processos
        : [{ id: null, numero: '', usuario: {} }]
      return lista.map(p => ({
        annexId:     r.id,
        numero:      r.numero          || '',
        procNumero:  p.numero          || '',
        userNome:    p.usuario?.nome   || '',
        userId:      p.usuario?.id     || '',
        userCpfCnpj: p.usuario?.cpfCnpj || ''
      }))
    })

    if (!flat.length) {
      tbody.innerHTML = ''
      empty.removeAttribute('hidden')
      return
    }

    empty.setAttribute('hidden', '')
    tbody.innerHTML = flat.map(f => `
      <tr class="doc-list-row"
          data-id="${f.annexId}"
          data-label="${f.numero}"
          data-numero="${f.numero}"
          data-proc-numero="${f.procNumero}"
          data-usuario-nome="${f.userNome}"
          data-usuario-id="${f.userId}"
          data-usuario-cpf-cnpj="${f.userCpfCnpj}">
        <td title="${f.numero}">${f.numero || '—'}</td>
        <td>${f.procNumero || '—'}</td>
        <td>${f.userNome   || '—'}</td>
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
    _el('axlListBody').querySelectorAll('.doc-list-row')
      .forEach(r => r.classList.remove('selected'))
    tr.classList.add('selected')
    document.dispatchEvent(new CustomEvent('annex-list:select', {
      detail: {
        id:             tr.dataset.id,
        label:          tr.dataset.label,
        numero:         tr.dataset.numero,
        procNumero:     tr.dataset.procNumero,
        usuarioId:      tr.dataset.usuarioId,
        usuarioNome:    tr.dataset.usuarioNome,
        usuarioCpfCnpj: tr.dataset.usuarioCpfCnpj
      }
    }))
  }

  /**
   * @description Remove um processo principal pelo id.
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
        await window.annexService.deleteById(id)
        document.dispatchEvent(new CustomEvent('annex-list:deleted', { detail: { id } }))
        tr.remove()
        if (!_el('axlListBody').children.length) _el('axlListEmpty').removeAttribute('hidden')
      } catch (err) {
        console.error('AnnexList: erro ao excluir processo principal', err)
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
    if (!msg) return 'Não foi possível excluir o processo principal.'
    const tableLabels = { processo: 'um processo', documento: 'um documento', interferencia: 'uma interferência' }
    const m = msg.match(/on table "([^"]+)"$/)
    if (m) {
      const label = tableLabels[m[1]] ?? `"${m[1]}"`
      return `Este processo principal não pode ser excluído pois está vinculado a ${label}.`
    }
    return `Não foi possível excluir o processo principal.\n${msg}`
  }

  /**
   * @description Insere ou move um processo principal para o topo da tabela com destaque.
   * @param {Object} r - { id, numero, procNumero, userNome }
   */
  function prependRow(r) {
    if (!r?.id) return
    const tbody = _el('axlListBody')
    const empty = _el('axlListEmpty')

    tbody.querySelector(`tr[data-id="${r.id}"]`)?.remove()

    const tr = document.createElement('tr')
    tr.className              = 'doc-list-row'
    tr.dataset.id             = String(r.id)
    tr.dataset.label          = r.numero      || ''
    tr.dataset.numero         = r.numero      || ''
    tr.dataset.procNumero     = r.procNumero  || ''
    tr.dataset.usuarioNome    = r.userNome    || ''
    tr.dataset.usuarioId      = r.userId      || ''
    tr.dataset.usuarioCpfCnpj = r.userCpfCnpj || ''
    tr.innerHTML = `
      <td title="${r.numero}">${r.numero || '—'}</td>
      <td>${r.procNumero || '—'}</td>
      <td>${r.userNome   || '—'}</td>
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
    _el('axlSearch').value = ''
    _el('axlListBody').innerHTML = ''
    _el('axlListEmpty').setAttribute('hidden', '')
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
