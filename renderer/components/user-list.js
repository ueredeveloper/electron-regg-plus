/**
 * @file user-list.js
 * @description Componente de pesquisa e listagem de usuários (drawer).
 * Eventos disparados:
 *  - `user-list:select`  → linha clicada { id, nome, cpfCnpj, label }.
 *  - `user-list:deleted` → usuário excluído com sucesso { id }.
 */

const UserList = (() => {
  let _mounted = false

  /**
   * @description Renderiza o componente no container e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <div class="doc-list-container">
        <div class="doc-list-header">
          <span class="doc-list-title">Pesquisar Usuários</span>
        </div>
        <div class="doc-search-bar">
          <div class="form-group grow">
            <input type="text" id="ulvSearch"
              placeholder="Pesquisar por nome e CPF/CNPJ..."
              autocomplete="off">
          </div>
          <button type="button" id="ulvSearchBtn" class="btn btn-primary">Pesquisar</button>
        </div>
        <div class="doc-list-wrap">
          <table class="doc-list-table" aria-label="Lista de usuários">
            <thead>
              <tr>
                <th style="width:52%">Nome</th>
                <th style="width:40%">CPF / CNPJ</th>
                <th style="width:44px"></th>
              </tr>
            </thead>
            <tbody id="ulvListBody"></tbody>
          </table>
          <p class="doc-list-empty" id="ulvListEmpty" hidden>Nenhum usuário encontrado.</p>
        </div>
      </div>
    `
    _bindEvents()
    _mounted = true
  }

  function _bindEvents() {
    _el('ulvSearchBtn').addEventListener('click', () => _search(_el('ulvSearch').value.trim()))
    _el('ulvSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') _search(_el('ulvSearch').value.trim())
    })
  }

  async function _search(term) {
    document.dispatchEvent(new CustomEvent('user-list:searched'))
    try {
      const rows = await window.userService.fetchByKeyword(term)
      _renderRows(rows)
    } catch (err) {
      console.error('UserList: erro ao buscar usuários', err)
      _renderRows([])
    }
  }

  /**
   * @description Popula a tabela com os resultados da busca.
   * @param {Array<{id, nome, cpfCnpj}>} rows
   */
  function _renderRows(rows) {
    const tbody = _el('ulvListBody')
    const empty = _el('ulvListEmpty')

    if (!rows.length) {
      tbody.innerHTML = ''
      empty.removeAttribute('hidden')
      return
    }

    empty.setAttribute('hidden', '')
    tbody.innerHTML = rows.map(r => {
      const cpf = _maskCpfCnpj(r.cpfCnpj || '')
      return `
        <tr class="doc-list-row"
            data-id="${r.id}"
            data-nome="${r.nome || ''}"
            data-cpfcnpj="${r.cpfCnpj || ''}"
            data-label="${r.nome || ''}">
          <td title="${r.nome}">${r.nome}</td>
          <td>${cpf || '—'}</td>
          <td class="doc-list-action-cell">
            <button type="button" class="doc-list-delete-btn" title="Excluir">${_trashSvg()}</button>
          </td>
        </tr>`
    }).join('')

    tbody.querySelectorAll('.doc-list-row').forEach(tr =>
      tr.addEventListener('click', () => _pickRow(tr))
    )
    tbody.querySelectorAll('.doc-list-delete-btn').forEach(btn =>
      btn.addEventListener('click', e => { e.stopPropagation(); _deleteRow(btn.closest('tr')) })
    )
  }

  function _pickRow(tr) {
    _el('ulvListBody').querySelectorAll('.doc-list-row')
      .forEach(r => r.classList.remove('selected'))
    tr.classList.add('selected')
    document.dispatchEvent(new CustomEvent('user-list:select', {
      detail: {
        id:      tr.dataset.id,
        nome:    tr.dataset.nome,
        cpfCnpj: tr.dataset.cpfcnpj,
        label:   tr.dataset.label
      }
    }))
  }

  /**
   * @description Remove um usuário pelo id.
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
        await window.userService.deleteById(id)
        document.dispatchEvent(new CustomEvent('user-list:deleted', { detail: { id } }))
        tr.remove()
        if (!_el('ulvListBody').children.length) _el('ulvListEmpty').removeAttribute('hidden')
      } catch (err) {
        console.error('UserList: erro ao excluir usuário', err)
        window.showToast?.(_deletionErrorMsg(err.message), 'error')
        restore()
      }
    })
  }

  /**
   * @description Converte mensagem de erro de FK do banco em texto amigável.
   * @param {string} msg
   * @returns {string}
   */
  function _deletionErrorMsg(msg) {
    if (!msg) return 'Não foi possível excluir o usuário.'
    const tableLabels = { processo: 'processo', interferencia: 'interferência', documento: 'documento', anexo: 'processo principal' }
    const m = msg.match(/on table "([^"]+)"$/)
    if (m) {
      const label = tableLabels[m[1]] ?? m[1]
      return `Este usuário não pode ser excluído pois está vinculado a um ${label}.`
    }
    return `Não foi possível excluir o usuário.\n${msg}`
  }

  /**
   * @description Insere ou move um usuário para o topo da tabela com destaque.
   * @param {Object} r
   */
  function prependRow(r) {
    if (!r?.id) return
    const tbody = _el('ulvListBody')
    const empty = _el('ulvListEmpty')

    tbody.querySelector(`tr[data-id="${r.id}"]`)?.remove()

    const cpf = _maskCpfCnpj(r.cpfCnpj || '')
    const tr  = document.createElement('tr')
    tr.className       = 'doc-list-row'
    tr.dataset.id      = String(r.id)
    tr.dataset.nome    = r.nome    || ''
    tr.dataset.cpfcnpj = r.cpfCnpj || ''
    tr.dataset.label   = r.nome    || ''
    tr.innerHTML = `
      <td title="${r.nome}">${r.nome || '—'}</td>
      <td>${cpf || '—'}</td>
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
    _el('ulvSearch').value = ''
    _el('ulvListBody').innerHTML = ''
    _el('ulvListEmpty').setAttribute('hidden', '')
  }

  function _maskCpfCnpj(raw) {
    let v = raw.replace(/\D/g, '')
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    } else {
      v = v.replace(/(\d{2})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1/$2')
           .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    }
    return v
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
