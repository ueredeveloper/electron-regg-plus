/**
 * @file interference-view.js
 * @description Drawer de cadastro de interferências hídricas.
 * A seção de pesquisa/lista é delegada ao componente InterferenceList.
 *
 * Eventos disparados:
 *  - `interference-view:select` → interferência selecionada via InterferenceList.
 *  - `interference-view:saved`  → interferência salva com sucesso.
 *
 * Escuta:
 *  - `interference-list:select` → preenche formulário e notifica SelectInterference.
 */
const InterferenceView = (() => {
  let _mounted        = false
  let _container      = null
  let _domainsLoaded  = false
  let _addrSelectedId = null
  let _selectedId     = null
  let _lastSelected   = null

  /**
   * @description Renderiza o drawer no container e monta InterferenceList abaixo do formulário.
   * @param {HTMLElement} container
   */
  function mount(container) {
    _container = container
    _container.className = 'side-drawer'

    _container.innerHTML = `
      <div class="av-header">
        <button type="button" class="av-back-btn" id="ivBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar
        </button>
        <span class="av-title">Cadastro de Interferência</span>
        <button type="button" class="btn btn-secondary av-new-btn" id="ivNew">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Novo
        </button>
        <button type="button" class="btn btn-primary" id="ivSave">Salvar</button>
      </div>

      <div class="av-content">

        <form id="ivForm" autocomplete="off">
          <fieldset class="form-section">
            <legend class="section-title">
              <span class="section-icon">📍</span> Interferência
            </legend>

            <div class="form-row">
              <div class="form-group grow autocomplete-wrap" id="ivAddrWrap">
                <label for="ivAddrSearch">Endereço <span class="required">*</span></label>
                <div class="search-input-wrap">
                  <input type="text" id="ivAddrSearch" name="ivAddrSearch"
                    placeholder="Digite o logradouro para pesquisar..."
                    autocomplete="off" aria-autocomplete="list"
                    aria-controls="ivAddrDropdown" aria-expanded="false">
                  <button type="button" id="ivAddrClear" class="search-clear" title="Limpar" hidden>×</button>
                </div>
                <ul class="autocomplete-dropdown" id="ivAddrDropdown" role="listbox" hidden></ul>
                <input type="hidden" id="ivAddrId">
              </div>
            </div>

            <div class="form-row iv-coords-row">
              <div class="form-group">
                <label for="ivLat">Latitude <span class="required">*</span></label>
                <input type="number" id="ivLat" name="ivLat"
                  placeholder="-15.780000" step="any" required>
              </div>
              <div class="form-group">
                <label for="ivLon">Longitude <span class="required">*</span></label>
                <input type="number" id="ivLon" name="ivLon"
                  placeholder="-47.930000" step="any" required>
              </div>
              <button type="button" id="ivGotoMap" class="btn-drawer iv-goto-map-btn" title="Ver no mapa">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </button>
              <button type="button" id="ivFindHidro" class="btn-drawer iv-goto-map-btn iv-find-hidro-btn"
                      title="Identificar Bacia e Unidade Hidrográfica pelas coordenadas">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="22" y1="12" x2="18" y2="12"/>
                  <line x1="6"  y1="12" x2="2"  y2="12"/>
                  <line x1="12" y1="6"  x2="12" y2="2"/>
                  <line x1="12" y1="22" x2="12" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="form-row">
              <div class="form-group grow">
                <label for="ivTipoInterf">Tipo de Interferência <span class="required">*</span></label>
                <select id="ivTipoInterf" name="ivTipoInterf" required>
                  <option value="">Selecione...</option>
                </select>
              </div>
              <div class="form-group grow">
                <label for="ivTipoOut">Tipo de Outorga <span class="required">*</span></label>
                <select id="ivTipoOut" name="ivTipoOut" required>
                  <option value="">Selecione...</option>
                </select>
              </div>
              <div class="form-group grow">
                <label for="ivSubtipoOut">Subtipo de Outorga</label>
                <select id="ivSubtipoOut" name="ivSubtipoOut">
                  <option value="">Selecione...</option>
                </select>
              </div>
              <div class="form-group grow">
                <label for="ivSituacao">Situação <span class="required">*</span></label>
                <select id="ivSituacao" name="ivSituacao" required>
                  <option value="">Selecione...</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group grow">
                <label for="ivTipoAto">Tipo de Ato</label>
                <select id="ivTipoAto" name="ivTipoAto">
                  <option value="">Selecione...</option>
                </select>
              </div>
              <div class="form-group grow">
                <label for="ivBacia">Bacia Hidrográfica</label>
                <select id="ivBacia" name="ivBacia">
                  <option value="">Selecione...</option>
                </select>
              </div>
              <div class="form-group grow">
                <label for="ivUnidade">Unidade Hidrográfica</label>
                <select id="ivUnidade" name="ivUnidade">
                  <option value="">Selecione...</option>
                </select>
              </div>
            </div>

          </fieldset>
        </form>

        <div id="ivListMount"></div>

        <!-- Montado por InterferenceDetails.mount() -->
        <div id="ivDetailsContainer"></div>

      </div>
    `

    InterferenceDetails.mount(_el('ivDetailsContainer'))
    InterferenceList.mount(_el('ivListMount'))
    _bindEvents()
    _mounted = true
  }

  /**
   * @description Registra todos os eventos do drawer.
   */
  function _bindEvents() {
    _el('ivBack').addEventListener('click', close)
    _el('ivNew').addEventListener('click', _new)
    _el('ivSave').addEventListener('click', _save)

    _el('ivTipoInterf').addEventListener('change', () => {
      if (_selectedId) return
      const sel  = _el('ivTipoInterf')
      const text = sel.options[sel.selectedIndex]?.text ?? ''
      if (text === 'Subterrânea') {
        InterferenceDetails.fillEmpty()
        InterferenceDetails.show()
      } else {
        InterferenceDetails.hide()
      }
    })

    _bindAddressSearch()

    _el('ivGotoMap').addEventListener('click', _gotoMap)
    _el('ivFindHidro').addEventListener('click', _updateHidroSelects)
    _el('ivLat').addEventListener('change', () => { _updateHidroSelects(); _gotoMap() })
    _el('ivLon').addEventListener('change', () => { _updateHidroSelects(); _gotoMap() })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _container?.classList.contains('open')) close()
    })

    document.addEventListener('interference-list:deleted', () => {
      if (!_mounted) return
      _selectedId     = null
      _addrSelectedId = null
      _el('ivForm').reset()
      _el('ivAddrSearch').value = ''
      _el('ivAddrClear').hidden = true
      _closeAddrDropdown()
      InterferenceDetails.hide()
      _el('ivSave').textContent = 'Salvar'
      if (_domainsLoaded) _applyDefaults()
    })

    document.addEventListener('interference-list:select', (e) => {
      const r = e.detail
      _selectedId     = r.id
      _addrSelectedId = r.enderecoId || null
      _el('ivAddrId').value     = r.enderecoId    || ''
      _el('ivAddrSearch').value = r.enderecoLabel || r.logradouro || ''
      _el('ivAddrClear').hidden = !r.logradouro
      _el('ivLat').value = r.latitude  ?? ''
      _el('ivLon').value = r.longitude ?? ''
      _setSelectValue('ivTipoInterf', r.tipoInterferenciaId)
      _setSelectValue('ivTipoOut',    r.tipoOutorgaId)
      _setSelectValue('ivSubtipoOut', r.subtipoOutorgaId)
      _setSelectValue('ivSituacao',   r.situacaoProcessoId)
      _setSelectValue('ivTipoAto',    r.tipoAtoId)
      _setSelectValue('ivBacia',      r.baciaHidrograficaId)
      _setSelectValue('ivUnidade',    r.unidadeHidrograficaId)
      _el('ivSave').textContent = 'Editar'
      if (r.tipoInterferencia === 'Subterrânea') {
        InterferenceDetails.show()
        InterferenceDetails.fill(r)
      } else {
        InterferenceDetails.hide()
      }
      _lastSelected = { latitude: String(r.latitude ?? ''), longitude: String(r.longitude ?? '') }
      document.dispatchEvent(new CustomEvent('interference-view:select', {
        detail: {
          id:        r.id,
          latitude:  r.latitude,
          longitude: r.longitude,
          label:     r.enderecoLabel || r.logradouro || ''
        }
      }))
    })
  }

  /**
   * @description Busca a bacia e unidade hidrográfica pelas coordenadas digitadas.
   */
  async function _updateHidroSelects() {
    const lat = parseFloat(_el('ivLat').value)
    const lng = parseFloat(_el('ivLon').value)
    if (isNaN(lat) || isNaN(lng)) return
    const btn = _el('ivFindHidro')
    btn.disabled = true
    try {
      const [bacias, unidades] = await Promise.all([
        window.baciaService.findByPoint(lat, lng),
        window.unidadeService.findByPoint(lat, lng)
      ])
      if (bacias.length)   _setSelectValue('ivBacia',   bacias[0].id)
      if (unidades.length) _setSelectValue('ivUnidade', unidades[0].id)
    } catch (err) {
      console.error('InterferenceView: erro ao identificar bacias/unidades', err)
    } finally {
      btn.disabled = false
    }
  }

  /**
   * @description Despacha o evento `interference:goto` com as coordenadas atuais dos inputs.
   */
  function _gotoMap() {
    const lat = parseFloat(_el('ivLat').value)
    const lng = parseFloat(_el('ivLon').value)
    if (isNaN(lat) || isNaN(lng)) return
    document.dispatchEvent(new CustomEvent('interference:goto', { detail: { lat, lng } }))
  }

  /**
   * @description Configura o autocomplete de endereço no formulário.
   */
  function _bindAddressSearch() {
    const input = _el('ivAddrSearch')
    const clear = _el('ivAddrClear')

    input.addEventListener('input', (e) => {
      const term = e.target.value.trim()
      _addrSelectedId = null
      _el('ivAddrId').value = ''
      clear.hidden = term.length === 0
      if (term.length < 2) { _closeAddrDropdown(); return }
      _searchAddr(term)
    })

    clear.addEventListener('click', () => {
      input.value = ''
      _el('ivAddrId').value = ''
      _addrSelectedId = null
      clear.hidden = true
      _closeAddrDropdown()
    })

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#ivAddrWrap')) _closeAddrDropdown()
    })
  }

  /**
   * @description Busca endereços via API pelo termo digitado.
   * @param {string} term
   */
  async function _searchAddr(term) {
    try {
      const rows = await window.addressService.fetchByKeyword(term)
      _renderAddrDropdown(rows)
    } catch (err) {
      console.error('InterferenceView: erro ao buscar endereços', err)
      _renderAddrDropdown([])
    }
  }

  /**
   * @description Renderiza o dropdown de sugestões de endereço.
   * @param {Array<{id, logradouro, cidade, estado}>} rows
   */
  function _renderAddrDropdown(rows) {
    const list = _el('ivAddrDropdown')
    list.innerHTML = rows.length
      ? rows.map(r => `
          <li class="autocomplete-item" role="option"
              data-id="${r.id}"
              data-label="${r.logradouro}">
            <span class="autocomplete-item__main">${r.logradouro}</span>
          </li>`).join('')
      : '<li class="autocomplete-empty">Nenhum endereço encontrado</li>'

    list.removeAttribute('hidden')
    _el('ivAddrSearch').setAttribute('aria-expanded', 'true')

    list.querySelectorAll('.autocomplete-item').forEach(li => {
      li.addEventListener('click', () => {
        _addrSelectedId = li.dataset.id
        _el('ivAddrSearch').value = li.dataset.label
        _el('ivAddrId').value     = li.dataset.id
        _el('ivAddrClear').hidden = false
        _closeAddrDropdown()
      })
    })
  }

  /**
   * @description Fecha o dropdown de sugestões de endereço.
   */
  function _closeAddrDropdown() {
    _el('ivAddrDropdown')?.setAttribute('hidden', '')
    _el('ivAddrSearch')?.setAttribute('aria-expanded', 'false')
  }

  /**
   * @description Valida, monta o payload aninhado e envia a interferência à API.
   * Captura os dados do formulário antes do reset para montar a linha na lista.
   */
  async function _save() {
    const form = _el('ivForm')
    if (!form.checkValidity()) { form.reportValidity(); return }

    const tipoText       = (_el('ivTipoInterf').selectedOptions[0]?.text ?? '').trim()
    const isSubterranea  = tipoText === 'Subterrânea'

    const payload = {
      latitude:            parseFloat(_el('ivLat').value)  || null,
      longitude:           parseFloat(_el('ivLon').value)  || null,
      endereco:            _addrSelectedId ? { id: parseInt(_addrSelectedId) } : null,
      tipoInterferencia:   _idObj(_el('ivTipoInterf').value),
      tipoOutorga:         _idObj(_el('ivTipoOut').value),
      subtipoOutorga:      _idObj(_el('ivSubtipoOut').value),
      situacaoProcesso:    _idObj(_el('ivSituacao').value),
      tipoAto:             _idObj(_el('ivTipoAto').value),
      baciaHidrografica:   _el('ivBacia').value   ? { objectid: parseInt(_el('ivBacia').value) }   : null,
      unidadeHidrografica: _el('ivUnidade').value ? { objectid: parseInt(_el('ivUnidade').value) } : null
    }

    if (_selectedId) payload.id = _selectedId

    const det = isSubterranea ? InterferenceDetails.getValue() : null
    if (det) {
      payload.tipoPoco        = det.tipoPoco != null ? { id: det.tipoPoco } : null
      payload.caesb           = det.caesb
      payload.sistema         = det.sistema
      payload.subsistema      = det.subsistema
      payload.codPlan         = det.codPlan
      payload.vazaoSistema    = det.vazaoSistema
      payload.vazaoOutorgavel = det.vazaoOutorgavel
      payload.vazaoTeste      = det.vazaoTeste
      payload.nivelEstatico   = det.nivelEstatico
      payload.nivelDinamico   = det.nivelDinamico
      payload.profundidade    = det.profundidade
      payload.finalidades     = det.finalidades
      payload.demandas        = det.demandas
    }

    // captura antes do reset para montar a linha na lista
    const rowSnapshot = {
      logradouro:            _el('ivAddrSearch').value || null,
      enderecoId:            _addrSelectedId ? parseInt(_addrSelectedId) : null,
      enderecoLabel:         _el('ivAddrSearch').value || null,
      latitude:              parseFloat(_el('ivLat').value)  || null,
      longitude:             parseFloat(_el('ivLon').value)  || null,
      tipoInterferenciaId:   parseInt(_el('ivTipoInterf').value) || null,
      tipoInterferencia:     tipoText || null,
      tipoOutorgaId:         parseInt(_el('ivTipoOut').value) || null,
      subtipoOutorgaId:      parseInt(_el('ivSubtipoOut').value) || null,
      situacaoProcessoId:    parseInt(_el('ivSituacao').value) || null,
      tipoAtoId:             parseInt(_el('ivTipoAto').value) || null,
      baciaHidrograficaId:   parseInt(_el('ivBacia').value) || null,
      unidadeHidrograficaId: parseInt(_el('ivUnidade').value) || null,
      tipoPoco:        det?.tipoPoco        ?? null,
      caesb:           det?.caesb           ?? null,
      sistema:         det?.sistema         ?? null,
      subsistema:      det?.subsistema      ?? null,
      codPlan:         det?.codPlan         ?? null,
      vazaoSistema:    det?.vazaoSistema    ?? null,
      vazaoOutorgavel: det?.vazaoOutorgavel ?? null,
      vazaoTeste:      det?.vazaoTeste      ?? null,
      nivelEstatico:   det?.nivelEstatico   ?? null,
      nivelDinamico:   det?.nivelDinamico   ?? null,
      profundidade:    det?.profundidade    ?? null,
      finalidades:     det?.finalidades     ?? [],
      demandas:        det?.demandas        ?? []
    }

    const btn = _el('ivSave')
    btn.disabled = true
    try {
      let result
      if (_selectedId) {
        result = await window.interferenceService.update(payload)
      } else {
        result = await window.interferenceService.save(payload)
      }
      const saved    = result?.object ?? result
      const savedId  = saved?.id ?? _selectedId ?? null
      _lastSelected = {
        latitude:  String(rowSnapshot.latitude  ?? ''),
        longitude: String(rowSnapshot.longitude ?? '')
      }
      document.dispatchEvent(new CustomEvent('interference-view:saved', { detail: payload }))
      _selectedId     = null
      _addrSelectedId = null
      form.reset()
      InterferenceDetails.hide()
      btn.textContent = 'Salvar'
      InterferenceList.prependRow({ id: savedId, ...rowSnapshot })
    } catch (err) {
      console.error('InterferenceView: erro ao salvar interferência', err)
      window.showToast?.('Erro ao salvar interferência. Tente novamente.', 'error')
    } finally {
      btn.disabled = false
    }
  }

  /**
   * @description Retorna {id: N} para campos de domínio aninhados, ou null se vazio.
   * @param {string} val
   * @returns {{id: number}|null}
   */
  function _idObj(val) {
    const n = parseInt(val)
    return isNaN(n) ? null : { id: n }
  }

  /**
   * @description Popula um select com itens de domínio { id, descricao }.
   * @param {string} selectId
   * @param {Array<{id, descricao}>} items
   */
  function _fillSelect(selectId, items) {
    const sel = _el(selectId)
    if (!sel || !Array.isArray(items)) return
    const opts = items.map(i => `<option value="${i.id}">${i.descricao}</option>`).join('')
    sel.innerHTML = `<option value="">Selecione...</option>${opts}`
  }

  /**
   * @description Carrega todas as tabelas de domínio na primeira abertura.
   */
  async function _loadDomains() {
    if (_domainsLoaded) return
    try {
      const d = await window.domainService.fetchAll()
      _fillSelect('ivTipoInterf', Object.values(d.tipoInterferencia ?? {}))
      _fillSelect('ivTipoOut',    Object.values(d.tipoOutorga       ?? {}))
      _fillSelect('ivSubtipoOut', Object.values(d.subtipoOutorga    ?? {}))
      _fillSelect('ivSituacao',   Object.values(d.situacaoProcesso  ?? {}))
      _fillSelect('ivTipoAto',    Object.values(d.tipoAto           ?? {}))
      InterferenceDetails.fillDomains(d)
      const bacias   = await window.baciaService.listAll()
      const unidades = await window.unidadeService.listAll()
      _fillSelect('ivBacia',   bacias)
      _fillSelect('ivUnidade', unidades)
      _domainsLoaded = true
      if (!_selectedId) _applyDefaults()
    } catch (err) {
      console.error('InterferenceView: erro ao carregar domínios', err)
    }
  }

  /**
   * @description Define o valor de um select pelo ID da opção.
   * @param {string} selectId
   * @param {number|null} value
   */
  function _setSelectValue(selectId, value) {
    const sel = _el(selectId)
    if (sel && value != null) sel.value = String(value)
  }

  /**
   * @description Aplica os valores padrão de Situação e Tipo de Ato para novo cadastro.
   */
  function _applyDefaults() {
    _setSelectByText('ivSituacao', 'Em Análise')
    _setSelectByText('ivTipoAto',  'Despacho')
  }

  /**
   * @description Seleciona uma opção pelo texto visível.
   * @param {string} selectId
   * @param {string} text
   */
  function _setSelectByText(selectId, text) {
    const sel = _el(selectId)
    if (!sel) return
    const opt = Array.from(sel.options).find(o => o.text.trim() === text.trim())
    if (opt) sel.value = opt.value
  }

  /**
   * @description Preenche os campos de latitude e longitude com as coordenadas do mapa.
   * @param {number} lat
   * @param {number} lng
   */
  function setCoords(lat, lng) {
    if (!_mounted) return
    const latEl = _el('ivLat')
    const lonEl = _el('ivLon')
    if (latEl) { latEl.value = lat.toFixed(6); latEl.classList.add('from-map') }
    if (lonEl) { lonEl.value = lng.toFixed(6); lonEl.classList.add('from-map') }
    _updateHidroSelects()
  }

  /**
   * @description Limpa o formulário e reseta para modo de criação.
   */
  function _new() {
    _selectedId     = null
    _addrSelectedId = null
    _el('ivForm').reset()
    _el('ivAddrClear').hidden = true
    _closeAddrDropdown()
    InterferenceDetails.hide()
    _el('ivSave').textContent = 'Salvar'
    if (_domainsLoaded) _applyDefaults()
  }

  /**
   * @description Abre o drawer e pré-preenche coordenadas do SelectInterference, se houver.
   * Se nenhum endereço estiver selecionado no formulário, pré-preenche o autocomplete de
   * endereço com o endereço selecionado no SelectAddress da tela principal.
   */
  function open() {
    if (!_mounted) return
    _lastSelected = null
    const { latitude, longitude } = SelectInterference.getValue()
    if (latitude && longitude) {
      _el('ivLat').value = latitude
      _el('ivLon').value = longitude
    }
    if (!_addrSelectedId) {
      const { addressId } = SelectAddress.getValue()
      if (addressId) {
        const label = SelectAddress.getLabel()
        _addrSelectedId           = String(addressId)
        _el('ivAddrId').value     = String(addressId)
        _el('ivAddrSearch').value = label
        _el('ivAddrClear').hidden = !label
      }
    }
    _loadDomains()
    _el('ivSave').textContent = _selectedId ? 'Editar' : 'Salvar'
    _container.classList.add('open')
    setTimeout(() => _el('iflSearch')?.focus(), 320)
  }

  /**
   * @description Fecha o drawer.
   */
  function close() {
    if (_lastSelected && SelectInterference.isMounted()) {
      SelectInterference.setValue(_lastSelected)
    }
    _container?.classList.remove('open')
  }

  /**
   * @description Limpa o formulário, o autocomplete de endereço e a lista.
   */
  function reset() {
    if (!_mounted) return
    _el('ivForm')?.reset()
    _addrSelectedId = null
    _el('ivAddrClear').hidden = true
    _closeAddrDropdown()
    InterferenceList.reset()
    close()
  }

  function validate()  { return true }
  function getValue()  { return {} }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, open, close, getValue, reset, validate, isMounted, setCoords }
})()
