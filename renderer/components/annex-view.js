/**
 * @file annex-view.js
 * @description Drawer de cadastro de processos principais (anexos). Apenas o formulário.
 * A seção de pesquisa/lista é delegada ao componente AnnexList.
 *
 * Eventos disparados:
 *  - `annex-view:select` → anexo selecionado via AnnexList.
 *  - `annex-view:saved`  → anexo salvo com sucesso.
 *
 * Escuta:
 *  - `annex-list:select` → preenche formulário e notifica SelectAnnex.
 */

const AnnexView = (() => {
  let _mounted          = false
  let _container        = null
  let _selectedId       = null
  let _lastSelected     = null
  let _fromPaste        = false
  let _selectedUserId   = null
  let _selectedUserCpfCnpj = null

  /**
   * @description Renderiza o drawer e monta AnnexList abaixo do formulário.
   * @param {HTMLElement} container
   */
  function mount(container) {
    _container = container
    _container.className = 'side-drawer'

    _container.innerHTML = `
      <div class="av-header">
        <button type="button" class="av-back-btn" id="axBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar
        </button>
        <span class="av-title">Cadastro de Processo Principal</span>
        <button type="button" class="btn btn-secondary av-new-btn" id="axNew">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Novo
        </button>
        <button type="button" class="btn btn-primary" id="axSave">Salvar</button>
      </div>

      <div class="av-content">

        <form id="axForm" autocomplete="off">
          <fieldset class="form-section">
            <legend class="section-title">
              <span class="section-icon">🗂️</span> Processo Principal
            </legend>

            <div class="form-row">
              <div class="form-group grow">
                <label for="axProcPrincipal">Número <span class="required">*</span></label>
                <input type="text" id="axProcPrincipal" name="axProcPrincipal"
                  placeholder="Ex: 00197-00002342/2025-61" required>
              </div>
              <div class="form-group grow autocomplete-wrap" id="axProcWrap">
                <label for="axProcSearch">Processo</label>
                <div class="search-input-wrap">
                  <input type="text" id="axProcSearch" name="axProcSearch"
                    placeholder="Número do processo..."
                    autocomplete="off" aria-autocomplete="list"
                    aria-controls="axProcDropdown" aria-expanded="false">
                  <button type="button" id="axProcClear" class="search-clear"
                    title="Limpar" hidden>×</button>
                </div>
                <ul class="autocomplete-dropdown" id="axProcDropdown" role="listbox" hidden></ul>
              </div>
              <div class="form-group grow autocomplete-wrap" id="axUserWrap">
                <label for="axUserSearch">Usuário</label>
                <div class="search-input-wrap">
                  <input type="text" id="axUserSearch" name="axUserSearch"
                    placeholder="Nome ou CPF/CNPJ..."
                    autocomplete="off" aria-autocomplete="list"
                    aria-controls="axUserDropdown" aria-expanded="false">
                  <button type="button" id="axUserClear" class="search-clear"
                    title="Limpar" hidden>×</button>
                </div>
                <ul class="autocomplete-dropdown" id="axUserDropdown" role="listbox" hidden></ul>
              </div>
            </div>

          </fieldset>
        </form>

        <div id="axListMount"></div>

      </div>
    `

    _bindEvents()
    AnnexList.mount(_el('axListMount'))
    _mounted = true
  }

  /**
   * @description Registra os eventos do formulário e escuta seleção da lista.
   */
  function _bindEvents() {
    _el('axBack').addEventListener('click', close)
    _el('axNew').addEventListener('click', _new)
    _el('axSave').addEventListener('click', _save)

    _bindInlineSearch('axProcSearch', 'axProcDropdown', 'axProcClear', _searchProc)
    _bindInlineSearch('axUserSearch', 'axUserDropdown', 'axUserClear', _searchUser,
      () => { _selectedUserId = null; _selectedUserCpfCnpj = null })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _container?.classList.contains('open')) close()
    })

    document.addEventListener('annex-list:select', (e) => {
      const { id, label, numero, procNumero, usuarioId, usuarioNome, usuarioCpfCnpj } = e.detail
      _selectedId          = id
      _selectedUserId      = usuarioId      || null
      _selectedUserCpfCnpj = usuarioCpfCnpj || null
      _el('axSave').textContent    = 'Editar'
      _el('axProcPrincipal').value = numero      || ''
      _el('axProcSearch').value    = procNumero  || ''
      _el('axProcClear').hidden    = !procNumero
      _el('axUserSearch').value    = usuarioNome || ''
      _el('axUserClear').hidden    = !usuarioNome
      _lastSelected = { annexId: id, annexLabel: numero || '', processoNumero: procNumero || '' }
      document.dispatchEvent(new CustomEvent('annex-view:select', { detail: { id, label } }))
    })
  }

  /**
   * @description Configura um campo de busca inline com dropdown.
   * @param {string} inputId
   * @param {string} dropdownId
   * @param {string} clearId
   * @param {Function} searchFn
   * @param {Function} [onClear] - Chamado quando o campo é limpo.
   */
  function _bindInlineSearch(inputId, dropdownId, clearId, searchFn, onClear) {
    const input = _el(inputId)
    const clear = _el(clearId)

    input.addEventListener('input', (e) => {
      const term = e.target.value.trim()
      clear.hidden = term.length === 0
      if (!term) onClear?.()
      if (term.length < 2) { _closeInlineDropdown(dropdownId, inputId); return }
      searchFn(term)
    })
    input.addEventListener('paste', () => {
      _fromPaste = true
      setTimeout(() => {
        const term = input.value.trim()
        if (term.length >= 2) searchFn(term)
      }, 0)
    })
    clear.addEventListener('click', () => {
      input.value = ''
      clear.hidden = true
      _closeInlineDropdown(dropdownId, inputId)
      onClear?.()
    })
    document.addEventListener('click', (e) => {
      if (!e.target.closest(`#${inputId}`) && !e.target.closest(`#${dropdownId}`))
        _closeInlineDropdown(dropdownId, inputId)
    })
  }

  /**
   * @description Fecha um dropdown inline.
   */
  function _closeInlineDropdown(dropdownId, inputId) {
    _el(dropdownId)?.setAttribute('hidden', '')
    _el(inputId)?.setAttribute('aria-expanded', 'false')
  }

  /**
   * @description Busca processos para o campo processo.
   * @param {string} term
   */
  async function _searchProc(term) {
    _fromPaste = false
    try {
      const rows = await window.processService.fetchByKeyword(term)
      _renderInlineDropdown('axProcDropdown', 'axProcSearch', 'axProcClear',
        rows.map(r => ({ id: r.id, label: r.numero })), term)
    } catch (err) {
      console.error('AnnexView: erro ao buscar processos', err)
      _renderInlineDropdown('axProcDropdown', 'axProcSearch', 'axProcClear', [], term)
    }
  }

  /**
   * @description Busca usuários para o campo usuário.
   * @param {string} term
   */
  async function _searchUser(term) {
    _fromPaste = false
    try {
      const rows = await window.userService.fetchByKeyword(term)
      const rowMap = new Map(rows.map(r => [String(r.id), r]))
      _renderInlineDropdown('axUserDropdown', 'axUserSearch', 'axUserClear',
        rows.map(r => ({ id: r.id, label: r.nome })), term,
        ({ id }) => {
          const r = rowMap.get(String(id)) || {}
          _selectedUserId      = id
          _selectedUserCpfCnpj = (r.cpfCnpj || '').replace(/\D/g, '')
        })
    } catch (err) {
      console.error('AnnexView: erro ao buscar usuários', err)
      _renderInlineDropdown('axUserDropdown', 'axUserSearch', 'axUserClear', [], term)
    }
  }

  /**
   * @description Renderiza itens em um dropdown inline.
   * @param {string} dropdownId
   * @param {string} inputId
   * @param {string} clearId
   * @param {Array<{id, label}>} rows
   */
  /**
   * @description Renderiza itens em um dropdown inline.
   * @param {string} dropdownId
   * @param {string} inputId
   * @param {string} clearId
   * @param {Array<{id, label}>} rows
   * @param {string} term
   * @param {Function} [onSelect] - Chamado com { id, label } ao selecionar um item.
   */
  function _renderInlineDropdown(dropdownId, inputId, clearId, rows, term, onSelect) {
    const list = _el(dropdownId)

    list.innerHTML = rows.length
      ? rows.map(r => `<li class="autocomplete-item" role="option"
            data-id="${r.id}" data-label="${r.label}">
          <span class="autocomplete-item__main">${r.label}</span>
        </li>`).join('')
      : ''

    if (term) {
      const useLi = document.createElement('li')
      useLi.className = 'autocomplete-item autocomplete-item--use-typed'
      useLi.setAttribute('role', 'option')
      useLi.textContent = `Usar: ${term}`
      useLi.addEventListener('click', () => {
        _el(inputId).value = term
        _el(clearId).hidden = false
        list.setAttribute('hidden', '')
        _el(inputId).setAttribute('aria-expanded', 'false')
      })
      list.appendChild(useLi)
    }

    if (!list.children.length) list.innerHTML = '<li class="autocomplete-empty">Nenhum resultado</li>'

    list.removeAttribute('hidden')
    _el(inputId).setAttribute('aria-expanded', 'true')

    list.querySelectorAll('.autocomplete-item:not(.autocomplete-item--use-typed)').forEach(li => {
      li.addEventListener('click', () => {
        _el(inputId).value = li.dataset.label
        _el(clearId).hidden = false
        list.setAttribute('hidden', '')
        _el(inputId).setAttribute('aria-expanded', 'false')
        onSelect?.({ id: li.dataset.id, label: li.dataset.label })
      })
    })
  }

  /**
   * @description Valida e salva um processo principal com o payload aninhado esperado pela API.
   */
  async function _save() {
    const form = _el('axForm')
    if (!form.checkValidity()) { form.reportValidity(); return }

    const numero      = _el('axProcPrincipal').value.trim()
    const procNumero  = _el('axProcSearch').value.trim()
    const usuarioNome = _el('axUserSearch').value.trim()

    const payload = {
      numero,
      processos: [{
        numero: procNumero,
        usuario: {
          id:        _selectedUserId   ? Number(_selectedUserId) : null,
          nome:      usuarioNome,
          cpfCnpj:   _selectedUserCpfCnpj || '',
          documentos: []
        }
      }]
    }
    if (_selectedId) payload.id = Number(_selectedId)

    try {
      const raw = await window.annexService.save(payload)
      if (raw?.status === 'erro') {
        const msg = (raw.mensagem ?? '').toLowerCase().includes('unique')
          ? 'Número de processo principal já cadastrado. O número deve ser único.'
          : (raw.mensagem ?? 'Erro ao salvar processo principal.')
        window.showToast?.(msg, 'error')
        return
      }
      const saved   = raw?.object ?? raw
      const savedId = saved?.id ?? _selectedId

      _lastSelected = { annexId: savedId, annexLabel: saved?.numero ?? numero, processoNumero: procNumero }
      document.dispatchEvent(new CustomEvent('annex-view:saved', { detail: saved }))

      _selectedId          = null
      _selectedUserId      = null
      _selectedUserCpfCnpj = null
      _el('axSave').textContent = 'Salvar'
      form.reset()
      _el('axProcSearch').value = ''
      _el('axProcClear').hidden = true
      _el('axUserSearch').value = ''
      _el('axUserClear').hidden = true

      AnnexList.prependRow({
        id:          saved?.id     ?? savedId,
        numero:      saved?.numero ?? numero,
        procNumero,
        userNome:    usuarioNome,
        userId:      _selectedUserId      || '',
        userCpfCnpj: _selectedUserCpfCnpj || ''
      })
    } catch (err) {
      console.error('AnnexView: erro ao salvar processo principal', err)
      window.showToast?.('Erro ao salvar processo principal. Tente novamente.', 'error')
    }
  }

  /**
   * @description Limpa o formulário e reseta para modo de criação.
   */
  function _new() {
    _selectedId          = null
    _selectedUserId      = null
    _selectedUserCpfCnpj = null
    _el('axSave').textContent = 'Salvar'
    _el('axForm').reset()
    _el('axProcSearch').value = ''
    _el('axProcClear').hidden = true
    _el('axUserSearch').value = ''
    _el('axUserClear').hidden = true
  }

  /**
   * @description Abre o drawer e pré-preenche com o anexo selecionado em SelectAnnex.
   */
  async function open() {
    if (!_mounted) return
    _lastSelected = null
    const { annexId } = SelectAnnex.getValue()
    if (annexId) {
      let r = SelectAnnex.getData()
      if (!r) {
        try { r = await window.annexService.fetchById(annexId) } catch { r = null }
      }
      if (r) {
        _selectedId          = annexId
        _selectedUserId      = r.usuarioId      ?? null
        _selectedUserCpfCnpj = r.usuarioCpfCnpj ?? null
        _el('axProcPrincipal').value = r.numero         || ''
        _el('axProcSearch').value    = r.processoNumero || ''
        _el('axProcClear').hidden    = !r.processoNumero
        _el('axUserSearch').value    = r.usuarioNome    || ''
        _el('axUserClear').hidden    = !r.usuarioNome
      }
    }
    _el('axSave').textContent = _selectedId ? 'Editar' : 'Salvar'
    _container.classList.add('open')
    setTimeout(() => _el('axlSearch')?.focus(), 320)
  }

  /**
   * @description Fecha o drawer.
   */
  function close() {
    if (_lastSelected && SelectAnnex.isMounted()) {
      SelectAnnex.setValue(_lastSelected)
    }
    _container?.classList.remove('open')
  }

  /**
   * @description Limpa o formulário e a lista.
   */
  function reset() {
    if (!_mounted) return
    _el('axForm')?.reset()
    AnnexList.reset()
    close()
  }

  function validate()  { return true }
  function getValue()  { return {} }
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, open, close, getValue, reset, validate, isMounted }
})()
