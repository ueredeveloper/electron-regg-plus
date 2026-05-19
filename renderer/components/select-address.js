/**
 * @file select-address.js
 * @description Componente de seleção pesquisável de endereço.
 * O usuário digita parte do logradouro e recebe uma lista de sugestões do banco.
 * Tabela de origem: `endereco` (logradouro, cidade, estado).
 * Mínimo de 2 caracteres para ativar a busca.
 */
const SelectAddress = (() => {
  let _mounted       = false
  let _selectedId    = null
  let _selectedData  = null
  let _activeIdx     = -1
  let _lastRows      = []

  /**
   * @description Renderiza o componente no container e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    container.innerHTML = `
      <fieldset class="form-section">
        <legend class="section-title">
          <span class="section-icon">🏠</span> Endereço
        </legend>
        <div class="form-row">
          <button
            type="button"
            id="addressOpenDrawer"
            class="btn-drawer"
            title="Cadastrar novo endereço"
            aria-label="Cadastrar novo endereço"
          >
            <!-- Lucide: house-plus -->
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
              <line x1="19" y1="5" x2="19" y2="11"/>
              <line x1="16" y1="8" x2="22" y2="8"/>
            </svg>
          </button>
          <div class="form-group grow autocomplete-wrap" id="addressWrap">
            <label for="addressSearch">Logradouro <span class="required">*</span></label>
            <div class="search-input-wrap">
              <input
                type="text"
                id="addressSearch"
                name="addressSearch"
                placeholder="Pesquisar por logradouro..."
                autocomplete="off"
                aria-autocomplete="list"
                aria-controls="addressDropdown"
                aria-expanded="false"
              >
              <button
                type="button"
                id="addressClear"
                class="search-clear"
                title="Limpar seleção"
                hidden
              >×</button>
            </div>
            <ul
              class="autocomplete-dropdown"
              id="addressDropdown"
              role="listbox"
              hidden
            ></ul>
          </div>
        </div>
      </fieldset>
    `
    _bindEvents()
    _mounted = true
  }

  /**
   * @description Registra todos os eventos do componente.
   */
  function _bindEvents() {
    const input = _el('addressSearch')
    const clear = _el('addressClear')

    input.addEventListener('input',   _onInput)
    input.addEventListener('keydown', _onKeydown)
    input.addEventListener('focus',   () => { if (input.value.trim().length >= 2) _search(input.value.trim()) })
    clear.addEventListener('click',   reset)

    /* Botão que abre o AddressView drawer */
    _el('addressOpenDrawer').addEventListener('click', () => AddressView.open())

    /* Quando o usuário seleciona um endereço dentro do AddressView */
    document.addEventListener('address-view:select', (e) => {
      if (!_mounted) return
      _select({ id: e.detail.id, label: e.detail.label })
    })

    /* Fecha dropdown ao clicar fora do componente */
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#addressWrap')) _closeDropdown()
    })
  }

  /**
   * @description Disparado a cada tecla no campo de busca.
   * @param {Event} e
   */
  function _onInput(e) {
    const term = e.target.value.trim()
    _selectedId = null
    _el('addressClear').hidden = term.length === 0

    if (term.length < 2) { _closeDropdown(); return }
    _search(term)
  }

  /**
   * @description Navegação por teclado: setas, Enter e Escape.
   * @param {KeyboardEvent} e
   */
  function _onKeydown(e) {
    const list  = _el('addressDropdown')
    const items = list.querySelectorAll('.autocomplete-item')

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      _activeIdx = Math.min(_activeIdx + 1, items.length - 1)
      _highlightItem(items)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      _activeIdx = Math.max(_activeIdx - 1, 0)
      _highlightItem(items)
    } else if (e.key === 'Enter' && _activeIdx >= 0) {
      e.preventDefault()
      items[_activeIdx]?.click()
    } else if (e.key === 'Escape') {
      _closeDropdown()
    }
  }

  /**
   * @description Marca visualmente o item ativo na lista.
   * @param {NodeList} items
   */
  function _highlightItem(items) {
    items.forEach((li, i) => li.classList.toggle('autocomplete-item--active', i === _activeIdx))
    items[_activeIdx]?.scrollIntoView({ block: 'nearest' })
  }

  /**
   * @description Executa a busca de endereços pelo logradouro via API.
   * @param {string} term - Texto digitado pelo usuário.
   */
  async function _search(term) {
    try {
      const rows = await window.addressService.fetchByKeyword(term)
      _renderDropdown(rows)
    } catch (err) {
      console.error('SelectAddress: erro ao buscar endereços', err)
      _renderDropdown([])
    }
  }

  /**
   * @description Popula o dropdown com os resultados da busca.
   * @param {Array<{id: number, logradouro: string, cidade: string, estado: string}>} rows
   */
  function _renderDropdown(rows) {
    const list = _el('addressDropdown')
    _activeIdx = -1
    _lastRows  = rows

    list.innerHTML = rows.length
      ? rows.map(r => `
          <li
            class="autocomplete-item"
            role="option"
            data-id="${r.id}"
            data-label="${r.logradouro}"
          >
            <span class="autocomplete-item__main">${r.logradouro}</span>
          </li>
        `).join('')
      : '<li class="autocomplete-empty">Nenhum endereço encontrado</li>'

    list.removeAttribute('hidden')
    _el('addressSearch').setAttribute('aria-expanded', 'true')

    list.querySelectorAll('.autocomplete-item').forEach(li => {
      li.addEventListener('click', () => {
        const data = _lastRows.find(r => String(r.id) === li.dataset.id) ?? null
        _select({ id: li.dataset.id, label: li.dataset.label }, data)
      })
      li.addEventListener('mouseenter', () => {
        _activeIdx = Array.from(list.children).indexOf(li)
        _highlightItem(list.querySelectorAll('.autocomplete-item'))
      })
    })
  }

  /**
   * @description Confirma a seleção de um endereço e fecha o dropdown.
   * @param {{ id: string, label: string }} item
   * @param {Object|null} data - Objeto completo retornado pela API.
   */
  function _select(item, data = null) {
    _selectedId   = item.id
    _selectedData = data
    _el('addressSearch').value  = item.label
    _el('addressClear').hidden  = false
    _closeDropdown()
  }

  /**
   * @description Fecha o dropdown e reseta o índice ativo.
   */
  function _closeDropdown() {
    const list = _el('addressDropdown')
    if (list) {
      list.setAttribute('hidden', '')
      list.innerHTML = ''
    }
    const input = _el('addressSearch')
    if (input) input.setAttribute('aria-expanded', 'false')
    _activeIdx = -1
  }

  /**
   * @description Retorna o ID do endereço selecionado.
   * @returns {{ addressId: string|null }}
   */
  function getValue() {
    return { addressId: _selectedId }
  }

  /**
   * @description Preenche o componente com dados externos (ex.: ao editar um registro).
   * @param {{ addressId?: string, addressLabel?: string }} data
   */
  function setValue(data = {}) {
    _selectedId   = data.addressId ?? null
    _selectedData = data.addressId ? {
      id:         data.addressId,
      logradouro: data.addressLabel ?? '',
      cep:        data.cep      ?? '',
      bairro:     data.bairro   ?? '',
      cidade:     data.cidade   ?? '',
      estado:     data.estado   ?? '',
      estadoId:   data.estadoId ?? null
    } : null
    const input = _el('addressSearch')
    if (input) {
      input.value = data.addressLabel ?? ''
      _el('addressClear').hidden = !data.addressLabel
    }
  }

  /**
   * @description Limpa a seleção e o campo de texto.
   */
  function reset() {
    if (!_mounted) return
    _selectedId   = null
    _selectedData = null
    _activeIdx    = -1
    const input = _el('addressSearch')
    const clear = _el('addressClear')
    if (input) input.value = ''
    if (clear) clear.hidden = true
    _closeDropdown()
  }

  /**
   * @description Retorna true se um endereço foi selecionado.
   * @returns {boolean}
   */
  function validate() { return _selectedId !== null }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  /** @returns {string} Label do endereço atualmente selecionado. */
  function getLabel() { return _el('addressSearch')?.value ?? '' }

  /** @returns {Object|null} Objeto completo do endereço selecionado (se selecionado via dropdown). */
  function getData() { return _selectedData }

  return { mount, getValue, getLabel, getData, setValue, reset, validate, isMounted }
})()
