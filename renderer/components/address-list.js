/**
 * @file address-list.js
 * @description Componente de pesquisa e listagem de endereços (drawer).
 * Eventos disparados:
 *  - `address-list:select`  → linha clicada { id, logradouro, bairro, cidade, cep, estado, estadoId, label }.
 *  - `address-list:deleted` → endereço excluído com sucesso { id }.
 */
const AddressList = (() => {
  let _mounted = false

  /**
   * @description Renderiza o componente no container e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <div class="doc-list-container">
        <div class="doc-list-header">
          <span class="doc-list-title">Pesquisar Endereços</span>
        </div>
        <div class="doc-search-bar">
          <div class="form-group grow">
            <input type="text" id="alvSearch"
              placeholder="Pesquisar por logradouro ou cidade..."
              autocomplete="off">
          </div>
          <button type="button" id="alvSearchBtn" class="btn btn-primary">Pesquisar</button>
        </div>
        <div class="doc-list-wrap">
          <table class="doc-list-table" style="table-layout:fixed" aria-label="Lista de endereços">
            <thead>
              <tr>
                <th style="width:38%">Logradouro</th>
                <th style="width:19%">Bairro</th>
                <th style="width:22%">Cidade</th>
                <th style="width:12%">UF</th>
                <th style="width:44px"></th>
              </tr>
            </thead>
            <tbody id="alvListBody"></tbody>
          </table>
          <p class="doc-list-empty" id="alvListEmpty" hidden>Nenhum endereço encontrado.</p>
        </div>
      </div>
    `
    _bindEvents()
    _mounted = true
  }

  function _bindEvents() {
    _el('alvSearchBtn').addEventListener('click', () => _search(_el('alvSearch').value.trim()))
    _el('alvSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') _search(_el('alvSearch').value.trim())
    })
  }

  async function _search(term) {
    try {
      const rows = await window.addressService.fetchByKeyword(term)
      _renderRows(rows)
    } catch (err) {
      console.error('AddressList: erro ao buscar endereços', err)
      _renderRows([])
    }
  }

  /**
   * @description Popula a tabela com os resultados da busca.
   * @param {Array<Object>} rows
   */
  function _renderRows(rows) {
    const tbody = _el('alvListBody')
    const empty = _el('alvListEmpty')

    if (!rows.length) {
      tbody.innerHTML = ''
      empty.removeAttribute('hidden')
      return
    }

    empty.setAttribute('hidden', '')
    tbody.innerHTML = rows.map(r => `
      <tr class="doc-list-row"
          data-id="${r.id}"
          data-logradouro="${r.logradouro || ''}"
          data-bairro="${r.bairro || ''}"
          data-cidade="${r.cidade || ''}"
          data-cep="${r.cep || ''}"
          data-estado="${r.estado || ''}"
          data-estado-id="${r.estadoId || ''}">
        <td title="${r.logradouro}">${r.logradouro || '—'}</td>
        <td>${r.bairro || '—'}</td>
        <td>${r.cidade || '—'}</td>
        <td>${r.estado || '—'}</td>
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
    _el('alvListBody').querySelectorAll('.doc-list-row')
      .forEach(r => r.classList.remove('selected'))
    tr.classList.add('selected')
    document.dispatchEvent(new CustomEvent('address-list:select', {
      detail: {
        id:         tr.dataset.id,
        logradouro: tr.dataset.logradouro,
        bairro:     tr.dataset.bairro,
        cidade:     tr.dataset.cidade,
        cep:        tr.dataset.cep,
        estado:     tr.dataset.estado,
        estadoId:   tr.dataset.estadoId,
        label:      `${tr.dataset.logradouro} — ${tr.dataset.cidade}/${tr.dataset.estado}`
      }
    }))
  }

  /**
   * @description Remove um endereço pelo id.
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
        await window.addressService.deleteById(id)
        document.dispatchEvent(new CustomEvent('address-list:deleted', { detail: { id } }))
        tr.remove()
        if (!_el('alvListBody').children.length) _el('alvListEmpty').removeAttribute('hidden')
      } catch (err) {
        console.error('AddressList: erro ao excluir endereço', err)
        window.showToast?.(_deletionErrorMsg(err.message), 'error')
        restore()
      }
    })
  }

  /**
   * @description Converte mensagem de erro de FK em texto amigável.
   * O backend retorna cascata: endereco → interferencia → demanda.
   * @param {string} msg
   * @returns {string}
   */
  function _deletionErrorMsg(msg) {
    if (!msg) return 'Não foi possível excluir o endereço.'
    if (/interferencia/i.test(msg)) return 'Este endereço não pode ser excluído pois está vinculado a uma interferência.'
    // Captura a tabela que possui a FK (após "foreign key constraint ... on table"),
    // não a tabela que está sendo deletada (primeiro "on table" da mensagem).
    const m = msg.match(/foreign key constraint "[^"]+" on table "([^"]+)"/)
    if (m) {
      const tableLabels = { documento: 'um documento', processo: 'um processo' }
      const label = tableLabels[m[1]] ?? `"${m[1]}"`
      return `Este endereço não pode ser excluído pois está vinculado a ${label}.`
    }
    return `Não foi possível excluir o endereço.\n${msg}`
  }

  /**
   * @description Insere ou move um endereço para o topo da tabela com destaque.
   * @param {Object} r
   */
  function prependRow(r) {
    if (!r?.id) return
    const tbody = _el('alvListBody')
    const empty = _el('alvListEmpty')

    tbody.querySelector(`tr[data-id="${r.id}"]`)?.remove()

    const tr = document.createElement('tr')
    tr.className          = 'doc-list-row'
    tr.dataset.id         = String(r.id)
    tr.dataset.logradouro = r.logradouro || ''
    tr.dataset.bairro     = r.bairro     || ''
    tr.dataset.cidade     = r.cidade     || ''
    tr.dataset.cep        = r.cep        || ''
    tr.dataset.estado     = r.estado     || ''
    tr.dataset.estadoId   = String(r.estadoId || '')
    tr.innerHTML = `
      <td title="${r.logradouro}">${r.logradouro || '—'}</td>
      <td>${r.bairro || '—'}</td>
      <td>${r.cidade || '—'}</td>
      <td>${r.estado || '—'}</td>
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
    _el('alvSearch').value = ''
    _el('alvListBody').innerHTML = ''
    _el('alvListEmpty').setAttribute('hidden', '')
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
