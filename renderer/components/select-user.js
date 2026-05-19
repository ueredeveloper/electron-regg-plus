/**
 * @file select-user.js
 * @description Componente de seleção pesquisável de usuário/requerente.
 * A busca é feita por nome ou CPF/CNPJ na tabela `usuario`.
 * Mínimo de 2 caracteres para ativar a pesquisa.
 * TODO: conectar ao banco via `window.db.searchUser(term)`.
 */
const SelectUser = (() => {
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
          <span class="section-icon">👤</span> Usuário
        </legend>
        <div class="form-row">
          <button
            type="button"
            id="sUserOpenDrawer"
            class="btn-drawer"
            title="Cadastrar novo usuário"
            aria-label="Cadastrar novo usuário"
          >
            <!-- Lucide: user-plus -->
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
          </button>
          <div class="form-group grow autocomplete-wrap" id="sUserWrap">
            <label for="sUserSearch">Nome <span class="required">*</span></label>
            <div class="search-input-wrap">
              <input
                type="text"
                id="sUserSearch"
                name="sUserSearch"
                placeholder="Digite para pesquisar..."
                autocomplete="off"
                aria-autocomplete="list"
                aria-controls="sUserDropdown"
                aria-expanded="false"
              >
              <button type="button" id="sUserClear" class="search-clear" title="Limpar seleção" hidden>×</button>
            </div>
            <ul class="autocomplete-dropdown" id="sUserDropdown" role="listbox" hidden></ul>
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
    _el('sUserSearch').addEventListener('input',   _onInput)
    _el('sUserSearch').addEventListener('keydown', _onKeydown)
    _el('sUserSearch').addEventListener('focus',   () => {
      if (_el('sUserSearch').value.trim().length >= 2) _search(_el('sUserSearch').value.trim())
    })
    _el('sUserClear').addEventListener('click', reset)
    _el('sUserOpenDrawer').addEventListener('click', () => UserView.open())

    /* Quando o usuário seleciona um registro dentro do UserView */
    document.addEventListener('user-view:select', (e) => {
      if (!_mounted) return
      _select({ id: e.detail.id, label: e.detail.label })
    })

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#sUserWrap')) _closeDropdown()
    })
  }

  /**
   * @description Aciona a busca após mínimo de 2 caracteres.
   * @param {Event} e
   */
  function _onInput(e) {
    const term = e.target.value.trim()
    _selectedId = null
    _el('sUserClear').hidden = term.length === 0
    if (term.length < 2) { _closeDropdown(); return }
    _search(term)
  }

  /**
   * @description Navegação por teclado: setas, Enter e Escape.
   * @param {KeyboardEvent} e
   */
  function _onKeydown(e) {
    const items = _el('sUserDropdown').querySelectorAll('.autocomplete-item')
    if (e.key === 'ArrowDown')  { e.preventDefault(); _activeIdx = Math.min(_activeIdx + 1, items.length - 1); _highlight(items) }
    else if (e.key === 'ArrowUp')    { e.preventDefault(); _activeIdx = Math.max(_activeIdx - 1, 0);               _highlight(items) }
    else if (e.key === 'Enter' && _activeIdx >= 0) { e.preventDefault(); items[_activeIdx]?.click() }
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
   * @description Busca usuários por nome ou CPF/CNPJ via API.
   * @param {string} term
   */
  async function _search(term) {
    try {
      const rows = await window.userService.fetchByKeyword(term)
      _renderDropdown(rows)
    } catch (err) {
      console.error('SelectUser: erro ao buscar usuários', err)
      _renderDropdown([])
    }
  }

  /**
   * @description Popula o dropdown com os resultados da busca.
   * @param {Array<{id: number, nome: string, cpfCnpj: string}>} rows
   */
  function _renderDropdown(rows) {
    const list = _el('sUserDropdown')
    _activeIdx = -1
    _lastRows  = rows
    list.innerHTML = rows.length
      ? rows.map(r => `
          <li class="autocomplete-item" role="option"
              data-id="${r.id}"
              data-label="${r.nome}">
            <span class="autocomplete-item__main">${r.nome}</span>
          </li>`).join('')
      : '<li class="autocomplete-empty">Nenhum resultado</li>'

    list.removeAttribute('hidden')
    _el('sUserSearch').setAttribute('aria-expanded', 'true')

    list.querySelectorAll('.autocomplete-item').forEach(li => {
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
    _selectedData = data ? { ...data, _fromSearch: true } : null
    _el('sUserSearch').value = item.label
    _el('sUserClear').hidden = false
    _closeDropdown()
  }

  /** @description Fecha e limpa o dropdown. */
  function _closeDropdown() {
    const list = _el('sUserDropdown')
    if (list) { list.setAttribute('hidden', ''); list.innerHTML = '' }
    _el('sUserSearch')?.setAttribute('aria-expanded', 'false')
    _activeIdx = -1
  }

  /**
   * @returns {{ userId: string|null, userLabel: string|null }}
   */
  function getValue() {
    return {
      userId:    _selectedId,
      userLabel: _el('sUserSearch')?.value?.trim() || null
    }
  }

  /**
   * @param {{ userId?: string, userLabel?: string }} data
   */
  function setValue(data = {}) {
    _selectedId   = data.userId ?? null
    _selectedData = data.userId ? {
      id:          data.userId,
      nome:        data.userLabel ?? '',
      cpfCnpj:     data.cpfCnpj  ?? '',
      _fromSearch: false   // carregado do documento, não de uma busca fresca
    } : null
    const input = _el('sUserSearch')
    if (input) { input.value = data.userLabel ?? ''; _el('sUserClear').hidden = !data.userLabel }
  }

  /** @description Limpa a seleção e o campo de busca. */
  function reset() {
    if (!_mounted) return
    _selectedId   = null
    _selectedData = null
    const input = _el('sUserSearch')
    if (input) input.value = ''
    _el('sUserClear').hidden = true
    _closeDropdown()
  }

  /** @returns {boolean} */
  function validate() { return _selectedId !== null }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  /** @returns {string} Label do usuário atualmente selecionado. */
  function getLabel() { return _el('sUserSearch')?.value ?? '' }

  /** @returns {Object|null} Objeto completo do usuário selecionado. */
  function getData() { return _selectedData }

  return { mount, getValue, getLabel, getData, setValue, reset, validate, isMounted }
})()
