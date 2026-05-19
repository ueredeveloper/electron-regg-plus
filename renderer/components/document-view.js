/**
 * @file document-view.js
 * @description Componente de cadastro de documento.
 * Exibe os campos: tipo de documento, número e número SEI em uma única linha.
 * Os tipos são carregados da tabela `documento_tipo`.
 */
const DocumentView = (() => {
  let _mounted    = false
  let _selectedId = null

  /** @type {Array<{id: number, name: string}>} Espelho da tabela documento_tipo */
  const TYPES = [
    { id: 1, name: 'Parecer' },
    { id: 2, name: 'Despacho' },
    { id: 3, name: 'Requerimento' },
    { id: 4, name: 'Ofício' }
  ]

  
  /**
   * @description Renderiza o componente dentro do container e ativa os eventos.
   * @param {HTMLElement} container - Elemento que receberá o HTML.
   */
  function mount(container) {
    container.innerHTML = `
      <div class="doc-view-toolbar">
        <button type="button" class="btn av-new-btn" id="btnNew">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Novo
        </button>
        <button type="button" class="btn btn-primary" id="btnSave">Salvar</button>
      </div>
      <fieldset class="form-section">
        <legend class="section-title">
          <span class="section-icon">📄</span> Documento
        </legend>
        <div class="form-row">
          <div class="form-group type-select">
            <label for="docType">Tipo <span class="required">*</span></label>
            <select id="docType" name="docType" required>
              <option value="">Selecione...</option>
              ${TYPES.map(t => `<option value="${t.id}">${t.name}</option>`).join('\n              ')}
            </select>
          </div>
          <div class="form-group grow">
            <label for="docNumber">Número <span class="required">*</span></label>
            <input
              type="text"
              id="docNumber"
              name="docNumber"
              placeholder="Ex: 155378018"
              required
            >
          </div>
          <div class="form-group grow">
            <label for="docNumberSei">Número SEI <span class="required">*</span></label>
            <input
              type="text"
              id="docNumberSei"
              name="docNumberSei"
              placeholder="Ex: 456852147"
              inputmode="numeric"
              required
            >
          </div>
        </div>
      </fieldset>
    `
    _bindEvents()
    _mounted = true
  }

  /** @description Registra eventos dos campos do documento. */
  function _bindEvents() {
    _el('btnNew').addEventListener('click', _new)
    _el('docNumberSei').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '')
    })
  }

  /** @description Limpa os campos e reseta para modo de criação. */
  function _new() {
    _selectedId = null
    _el('docType').value       = ''
    _el('docNumber').value     = ''
    _el('docNumberSei').value  = ''
    _el('btnSave').textContent = 'Salvar'
  }

  /**
   * @description Retorna os valores atuais dos campos do documento.
   * @returns {{ documentId: string|null, typeId: string, typeDescricao: string, number: string, numberSei: string }}
   */
  function getValue() {
    const typeId = _el('docType').value
    const typeDescricao = TYPES.find(t => String(t.id) === String(typeId))?.name ?? ''
    return {
      documentId:   _selectedId,
      typeId,
      typeDescricao,
      number:       _el('docNumber').value.trim(),
      numberSei:    _el('docNumberSei').value.trim()
    }
  }

  /**
   * @description Preenche os campos com os dados fornecidos.
   * @param {{ id?: string|null, typeId?: string, number?: string, numberSei?: string }} data
   */
  function setValue(data = {}) {
    _selectedId               = data.id        ?? null
    _el('docType').value      = data.typeId    ?? ''
    _el('docNumber').value    = data.number    ?? ''
    _el('docNumberSei').value = data.numberSei ?? ''
    const btn = _el('btnSave')
    if (btn) btn.textContent = _selectedId ? 'Editar' : 'Salvar'
  }

  /** @description Limpa todos os campos do componente. */
  function reset() {
    if (_mounted) { _selectedId = null; setValue({}) }
  }

  /**
   * @description Valida os campos obrigatórios.
   * @returns {boolean}
   */
  function validate() {
    const v = getValue()
    return v.typeId !== '' && v.number !== ''
  }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, getValue, setValue, reset, validate, isMounted }
})()
