/**
 * @file select-attachment.js
 * @description Componente de seleção pesquisável de processo principal (anexo).
 * A busca é feita pelo número na tabela `anexo`.
 * Campo opcional — não bloqueia o salvamento se não preenchido.
 * Mínimo de 2 caracteres para ativar a pesquisa.
 * TODO: conectar ao banco via `window.db.searchAnnex(term)`.
 */
const SelectAnnex = (() => {
  let _mounted      = false
  let _selectedId   = null
  let _selectedData = null
  let _activeIdx    = -1
  let _lastRows     = []

  /**
   * @description Renderiza o componente e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <fieldset class="form-section form-section--stretch">
        <legend class="section-title">
          <span class="section-icon">🗂️</span> Processo Principal
        </legend>
        <div class="form-row">
          <button
            type="button"
            id="sAnnOpenDrawer"
            class="btn-drawer"
            title="Cadastrar novo processo principal"
            aria-label="Cadastrar novo processo principal"
          >
            <!-- Lucide: bookmark-plus -->
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              <line x1="12" y1="7" x2="12" y2="13"/>
              <line x1="15" y1="10" x2="9" y2="10"/>
            </svg>
          </button>
          <div class="form-group grow autocomplete-wrap" id="sAnnWrap">
            <label for="sAnnSearch">Número</label>
            <div class="search-input-wrap">
              <input
                type="text"
                id="sAnnSearch"
                name="sAnnSearch"
                placeholder="Ex: 00197-00002342/2025-61"
                autocomplete="off"
                aria-autocomplete="list"
                aria-controls="sAnnDropdown"
                aria-expanded="false"
              >
              <button type="button" id="sAnnClear" class="search-clear" title="Limpar seleção" hidden>×</button>
            </div>
            <ul class="autocomplete-dropdown" id="sAnnDropdown" role="listbox" hidden></ul>
          </div>
        </div>
      </fieldset>
    `
    _bindEvents()
    _mounted = true
  }

  /**
   * @description Registra eventos de input, teclado e clique fora do componente.
   */
  function _bindEvents() {
    _el('sAnnSearch').addEventListener('input',   _onInput)
    _el('sAnnSearch').addEventListener('keydown', _onKeydown)
    _el('sAnnSearch').addEventListener('focus',   () => {
      if (_el('sAnnSearch').value.trim().length >= 2) _search(_el('sAnnSearch').value.trim())
    })
    _el('sAnnSearch').addEventListener('paste', () => {
      setTimeout(() => {
        const term = _el('sAnnSearch').value.trim()
        if (term.length >= 2) _search(term)
      }, 0)
    })
    _el('sAnnClear').addEventListener('click', reset)
    _el('sAnnOpenDrawer').addEventListener('click', () => AnnexView.open())

    /* Quando o usuário seleciona um registro dentro do AnnexView */
    document.addEventListener('annex-view:select', (e) => {
      if (!_mounted) return
      _select({ id: e.detail.id, label: e.detail.label })
    })

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#sAnnWrap')) _closeDropdown()
    })
  }

  /**
   * @description Aciona a busca após mínimo de 2 caracteres.
   * @param {Event} e
   */
  function _onInput(e) {
    const term = e.target.value.trim()
    _selectedId = null
    _el('sAnnClear').hidden = term.length === 0
    if (term.length < 2) { _closeDropdown(); return }
    _search(term)
  }

  /**
   * @description Navegação por teclado: setas, Enter e Escape.
   * @param {KeyboardEvent} e
   */
  function _onKeydown(e) {
    const items = _el('sAnnDropdown').querySelectorAll('.autocomplete-item')
    if (e.key === 'ArrowDown')  { e.preventDefault(); _activeIdx = Math.min(_activeIdx + 1, items.length - 1); _highlight(items) }
    else if (e.key === 'ArrowUp')    { e.preventDefault(); _activeIdx = Math.max(_activeIdx - 1, 0);               _highlight(items) }
    else if (e.key === 'Enter' && _activeIdx >= 0) { e.preventDefault(); items[_activeIdx]?.click() }
    else if (e.key === 'Enter' && _activeIdx < 0) {
      e.preventDefault()
      const term = _el('sAnnSearch').value.trim()
      if (_lastRows.length === 1) {
        const r = _lastRows[0]
        _select({ id: String(r.id), label: r.numero }, r)
        _closeDropdown()
      } else if (term.length >= 2) {
        _select(
          { id: term, label: term },
          { id: null, numero: term, processoNumero: '', usuarioNome: '' }
        )
        _closeDropdown()
      }
    }
    else if (e.key === 'Escape') _closeDropdown()
  }

  /**
   * @description Marca visualmente o item ativo.
   * @param {NodeList} items
   */
  function _highlight(items) {
    items.forEach((li, i) => li.classList.toggle('autocomplete-item--active', i === _activeIdx))
    items[_activeIdx]?.scrollIntoView({ block: 'nearest' })
  }

  /**
   * @description Busca anexos (processos principais) pelo número via API.
   * @param {string} term
   */
  async function _search(term) {
    try {
      const rows = await window.annexService.fetchByKeyword(term)
      _renderDropdown(rows, term)
    } catch (err) {
      console.error('SelectAnnex: erro ao buscar anexos', err)
      _renderDropdown([], term)
    }
  }

  /**
   * @description Popula o dropdown com os resultados da busca.
   * @param {Array<{id: number, numero: string}>} rows
   */
  /**
   * @description Popula o dropdown com os resultados e uma opção de uso livre do texto digitado.
   * @param {Array<{id: number, numero: string}>} rows
   * @param {string} [term]
   */
  /**
   * @description Popula o dropdown com os resultados e uma opção de uso livre do texto digitado.
   * @param {Array<{id: number, numero: string}>} rows
   * @param {string} [term]
   * @param {boolean} [highlightUse] - Se true, pré-destaca a opção "Usar".
   */
  function _renderDropdown(rows, term) {
    const list = _el('sAnnDropdown')
    _activeIdx = -1
    _lastRows  = rows

    list.innerHTML = rows.length
      ? rows.map(r => `
          <li class="autocomplete-item" role="option"
              data-id="${r.id}" data-label="${r.numero}">
            <span class="autocomplete-item__main">${r.numero}</span>
          </li>`).join('')
      : ''

    if (term) {
      const useLi = document.createElement('li')
      useLi.className = 'autocomplete-item autocomplete-item--use-typed'
      useLi.setAttribute('role', 'option')
      useLi.textContent = `Usar: ${term}`
      useLi.addEventListener('click', () => {
        _select(
          { id: term, label: term },
          { id: null, numero: term, processoNumero: '', usuarioNome: '' }
        )
      })
      useLi.addEventListener('mouseenter', () => {
        _activeIdx = [...list.children].indexOf(useLi)
        _highlight(list.querySelectorAll('.autocomplete-item'))
      })
      list.appendChild(useLi)
    }

    if (!list.children.length) list.innerHTML = '<li class="autocomplete-empty">Nenhum resultado</li>'

    list.removeAttribute('hidden')
    _el('sAnnSearch').setAttribute('aria-expanded', 'true')

    list.querySelectorAll('.autocomplete-item:not(.autocomplete-item--use-typed)').forEach(li => {
      li.addEventListener('click', () => {
        const data = _lastRows.find(r => String(r.id) === li.dataset.id) ?? null
        _select({ id: li.dataset.id, label: li.dataset.label }, data)
      })
      li.addEventListener('mouseenter', () => {
        _activeIdx = [...list.children].indexOf(li)
        _highlight(list.querySelectorAll('.autocomplete-item'))
      })
    })

  }

  /**
   * @description Confirma a seleção e fecha o dropdown.
   * @param {{ id: string, label: string }} item
   */
  function _select(item, data = null) {
    _selectedId   = item.id
    _selectedData = data
    _el('sAnnSearch').value = item.label
    _el('sAnnClear').hidden = false
    _closeDropdown()
  }

  /** @description Fecha e limpa o dropdown. */
  function _closeDropdown() {
    const list = _el('sAnnDropdown')
    if (list) { list.setAttribute('hidden', ''); list.innerHTML = '' }
    _el('sAnnSearch')?.setAttribute('aria-expanded', 'false')
    _activeIdx = -1
  }

  /** @returns {{ annexId: string|null }} */
  function getValue() { return { annexId: _selectedId } }

  /**
   * @param {{ annexId?: string, annexLabel?: string }} data
   */
  function setValue(data = {}) {
    _selectedId   = data.annexId ?? null
    _selectedData = data.annexId ? {
      id:             data.annexId,
      numero:         data.annexLabel    ?? '',
      processoNumero: data.processoNumero ?? '',
      usuarioNome:    data.usuarioNome   ?? ''
    } : null
    const input = _el('sAnnSearch')
    if (input) { input.value = data.annexLabel ?? ''; _el('sAnnClear').hidden = !data.annexLabel }
  }

  /** @description Limpa a seleção e o campo de busca. */
  function reset() {
    if (!_mounted) return
    _selectedId   = null
    _selectedData = null
    const input = _el('sAnnSearch')
    if (input) input.value = ''
    _el('sAnnClear').hidden = true
    _closeDropdown()
  }

  /** @returns {boolean} Sempre true — campo opcional. */
  function validate() { return true }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  /** @returns {string} Label do processo principal atualmente selecionado. */
  function getLabel() { return _el('sAnnSearch')?.value ?? '' }

  /** @returns {Object|null} Objeto completo do processo principal selecionado. */
  function getData() { return _selectedData }

  return { mount, getValue, getLabel, getData, setValue, reset, validate, isMounted }
})()
