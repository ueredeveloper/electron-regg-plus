/**
 * @file document-list.js
 * @description Componente de pesquisa e listagem de documentos cadastrados.
 * Exibe uma barra de busca e uma tabela com os resultados.
 * Ao clicar em uma linha, dispara o evento `document-list:select` com os
 * dados do documento para que o renderer.js carregue o formulário em modo edição.
 *
 * Colunas exibidas: Tipo de Documento, Número, Número SEI, Processo, Endereço.
 *
 */
const DocumentList = (() => {
  let _mounted    = false
  let _selectedId = null
  let _rows       = []

  /**
   * @description Renderiza o componente e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <div class="doc-list-container">

        <div class="doc-list-header">
          <span class="doc-list-title">Buscar Documentos</span>
        </div>

        <div class="doc-search-bar">
          <div class="form-group grow">
            <input
              type="text"
              id="docListSearch"
              placeholder="Pesquisar por número, número SEI, processo e endereço..."
              autocomplete="off"
            >
          </div>
          <button type="button" id="docListBtn" class="btn btn-primary">
            Pesquisar
          </button>
        </div>

        <div class="doc-list-wrap">
          <table class="doc-list-table" style="table-layout:fixed" aria-label="Lista de documentos">
            <thead>
              <tr>
                <th style="width:100px">Tipo</th>
                <th style="width:80px">Número</th>
                <th style="width:80px">SEI</th>
                <th style="width:120px">Processo</th>
                <th style="width:320px">Endereço</th>
                <th style="width:100px;min-width:90px"></th>
              </tr>
            </thead>
            <tbody id="docListBody"></tbody>
          </table>
          <p class="doc-list-empty" id="docListEmpty" hidden>
            Nenhum documento encontrado.
          </p>
        </div>

      </div>
    `
    _bindEvents()
    _mounted = true
  }

  /**
   * @description Registra eventos do botão de pesquisa e da tecla Enter.
   */
  function _bindEvents() {
    _el('docListBtn').addEventListener('click', () =>
      _search(_el('docListSearch').value.trim())
    )
    _el('docListSearch').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') _search(_el('docListSearch').value.trim())
    })
  }

  /**
   * @description Executa a busca de documentos pelo termo informado.
   * Filtra por número, SEI, nome ou CPF/CNPJ do usuário vinculado.
   * @param {string} term - Texto digitado pelo usuário.
   */
  async function _search(term) {
    _el('docListBtn').disabled = true
    _el('docListBtn').textContent = 'Buscando…'
    try {
      const rows = await window.documentService.fetchByParam(term)
      _renderRows(rows)
    } catch (err) {
      console.error('[DocumentList] Erro na busca:', err)
      _renderRows([])
    } finally {
      _el('docListBtn').disabled = false
      _el('docListBtn').textContent = 'Pesquisar'
    }
  }

  /**
   * @description Gera o HTML de uma linha da tabela de documentos.
   * @param {Object} r - Documento normalizado.
   * @param {number} idx - Índice em `_rows`.
   * @returns {string}
   */
  function _rowHtml(r, idx) {
    return `
      <tr class="doc-list-row" data-idx="${idx}" data-id="${r.id}">
        <td>${r.tipoDocumentoNome || '—'}</td>
        <td>${r.numero           || '—'}</td>
        <td>${r.numeroSei        || '—'}</td>
        <td>${r.processoNumero   || '—'}</td>
        <td class="col-address" title="${r.logradouro || ''}">${r.logradouro || '—'}</td>
        <td class="doc-list-action-cell">
          <button type="button" class="doc-list-chart-btn" title="Visualizar Relacionamentos">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          <button type="button" class="doc-list-acts-btn" title="Atos Administrativos">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="12" y1="9" x2="8" y2="9"/>
            </svg>
          </button>
          <button type="button" class="doc-list-delete-btn" title="Excluir">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
        </td>
      </tr>`
  }

  /**
   * @description Popula a tabela com os documentos retornados pela busca.
   * Armazena os dados completos em `_rows` para uso no evento de seleção.
   * @param {Object[]} rows - Linhas retornadas por documentService.fetchByParam.
   */
  function _renderRows(rows) {
    const tbody = _el('docListBody')
    const empty = _el('docListEmpty')
    _selectedId = null
    _rows = rows

    if (!rows.length) {
      tbody.innerHTML = ''
      empty.removeAttribute('hidden')
      return
    }

    empty.setAttribute('hidden', '')
    tbody.innerHTML = rows.map((r, idx) => _rowHtml(r, idx)).join('')

    tbody.querySelectorAll('.doc-list-row').forEach(tr =>
      tr.addEventListener('click', () => _selectRow(tr))
    )
    tbody.querySelectorAll('.doc-list-chart-btn').forEach(btn =>
      btn.addEventListener('click', (e) => { e.stopPropagation(); _openChart(btn.closest('tr')) })
    )
    tbody.querySelectorAll('.doc-list-acts-btn').forEach(btn =>
      btn.addEventListener('click', (e) => { e.stopPropagation(); _openActs(btn.closest('tr')) })
    )
    tbody.querySelectorAll('.doc-list-delete-btn').forEach(btn =>
      btn.addEventListener('click', (e) => { e.stopPropagation(); _deleteRow(btn.closest('tr')) })
    )
  }

  /**
   * @description Insere um documento no topo da lista com animação de destaque.
   * Chamado após salvar ou atualizar um documento para feedback visual imediato.
   * @param {Object} doc - Documento normalizado (mesmo formato de `_rows`).
   */
  function prependRow(doc) {
    if (!_mounted) return

    const tbody = _el('docListBody')

    // Remove linha existente com o mesmo ID para evitar duplicata na edição
    const existingTr = tbody.querySelector(`tr[data-id="${doc.id}"]`)
    if (existingTr) {
      const removedIdx = parseInt(existingTr.dataset.idx, 10)
      _rows.splice(removedIdx, 1)
      existingTr.remove()
      tbody.querySelectorAll('.doc-list-row').forEach(tr => {
        const i = parseInt(tr.dataset.idx, 10)
        if (i > removedIdx) tr.dataset.idx = String(i - 1)
      })
    }

    _rows.unshift(doc)
    tbody.querySelectorAll('.doc-list-row').forEach(tr => {
      tr.dataset.idx = String(parseInt(tr.dataset.idx, 10) + 1)
    })

    _el('docListEmpty').setAttribute('hidden', '')

    const tmp = document.createElement('tbody')
    tmp.innerHTML = _rowHtml(doc, 0)
    const tr = tmp.firstElementChild
    tbody.prepend(tr)

    tr.classList.add('doc-list-row--flash')
    tr.addEventListener('click', () => _selectRow(tr))
    tr.querySelector('.doc-list-chart-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      _openChart(tr)
    })
    tr.querySelector('.doc-list-acts-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      _openActs(tr)
    })
    tr.querySelector('.doc-list-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      _deleteRow(tr)
    })
  }

  /**
   * @description Seleciona o documento da linha e abre a visualização de relacionamentos.
   * @param {HTMLTableRowElement} tr
   */
  function _openChart(tr) {
    _selectRow(tr)
    const row = _rows[parseInt(tr.dataset.idx, 10)]
    DocumentChartView.open(row)
  }

  /**
   * @description Seleciona o documento da linha e abre os Atos Administrativos.
   * @param {HTMLTableRowElement} tr
   */
  function _openActs(tr) {
    _selectRow(tr)
    AdministrativeActsView.open()
  }

  /**
   * @description Remove um documento pelo id.
   * @param {HTMLTableRowElement} tr
   */
  async function _deleteRow(tr) {
    const id   = tr.dataset.id
    const cell = tr.querySelector('.doc-list-action-cell')

    const origHTML = cell.innerHTML
    const restore  = () => {
      cell.innerHTML = origHTML
      cell.querySelector('.doc-list-chart-btn')
          ?.addEventListener('click', e => { e.stopPropagation(); _openChart(tr) })
      cell.querySelector('.doc-list-acts-btn')
          ?.addEventListener('click', e => { e.stopPropagation(); _openActs(tr) })
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
        await window.documentService.deleteById(id)
        document.dispatchEvent(new CustomEvent('document-list:deleted', { detail: { id } }))
        if (_selectedId === id) _selectedId = null
        tr.remove()
      } catch (err) {
        console.error('[DocumentList] Erro ao excluir:', err)
        window.showToast?.('Não foi possível excluir o documento.', 'error')
        restore()
      }
    })
  }

  /**
   * @description Destaca a linha selecionada e dispara o evento de seleção
   * com todos os dados do documento para que o renderer.js preencha o formulário.
   * @param {HTMLTableRowElement} tr
   */
  function _selectRow(tr) {
    _el('docListBody').querySelectorAll('.doc-list-row')
      .forEach(r => r.classList.remove('selected'))

    tr.classList.add('selected')
    const row = _rows[parseInt(tr.dataset.idx, 10)]
    _selectedId = String(row.id)

    document.dispatchEvent(
      new CustomEvent('document-list:select', { detail: row })
    )
  }

  /**
   * @description Remove o destaque da linha selecionada.
   */
  function clearSelection() {
    _selectedId = null
    _el('docListBody')?.querySelectorAll('.doc-list-row')
      .forEach(r => r.classList.remove('selected'))
  }

  /** @returns {{ selectedDocumentId: string|null }} */
  function getValue() { return { selectedDocumentId: _selectedId } }

  /**
   * @description Limpa o campo de busca e a tabela de resultados.
   */
  function reset() {
    if (!_mounted) return
    _selectedId = null
    _rows = []
    _el('docListSearch').value = ''
    _el('docListBody').innerHTML = ''
    _el('docListEmpty').setAttribute('hidden', '')
  }

  /** @returns {boolean} */
  function validate() { return true }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, getValue, clearSelection, prependRow, reset, validate, isMounted }
})()
