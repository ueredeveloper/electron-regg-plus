/**
 * @file administrative-acts-view.js
 * @description Tela modal de geração de Atos Administrativos.
 * Sobrepõe toda a aplicação (position: fixed; top: var(--topbar-h); inset-inline: 0; bottom: 0).
 *
 * Aba "Documento":
 *  - Exibe Número, SEI e endereço do documento atual (somente leitura).
 *  - Select de interferência (busca por logradouro via fetchRawByKeyword).
 *  - Select de usuário (busca pelo ID do documento via fetchByDocumentId).
 *  - Select de modelo (6 templates fixos indexados por diretório).
 *  - <iframe> que renderiza o modelo e é alimentado via contentWindow após o carregamento.
 */
const AdministrativeActsView = (() => {
  let _mounted  = false
  let _container = null
  let _interferences = []
  let _users         = []
  let _selectedInterference = null

  const _TIPO_POCO_MAP = { 1: 'Manual', 2: 'Tubular Raso', 3: 'Tubular Profundo' }

  const _TEMPLATES = [
    { dir: 1, nome: 'Outorga Prévia' },
    { dir: 2, nome: 'Parecer de Outorga Prévia' },
    { dir: 3, nome: 'Outorga De Direito de Uso' },
    { dir: 4, nome: 'Parecer de Outorga De Direito de Uso' },
    { dir: 5, nome: 'Registro de Uso Subterrâneo' },
    { dir: 6, nome: 'Outorga Prévia - Poço Raso' },
  ]

  /**
   * @description Renderiza a estrutura do overlay e registra os eventos.
   * @param {HTMLElement} container
   */
  function mount(container) {
    _container = container

    container.innerHTML = `
      <div class="aa-overlay" id="aaOverlay" hidden>

        <div class="aa-header av-header">
          <button type="button" class="av-back-btn" id="aaClose">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Fechar
          </button>
          <span class="av-title">Atos Administrativos</span>
          <button type="button" class="btn av-new-btn aa-copy-btn" id="aaCopy">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copiar
          </button>
          <button type="button" class="btn av-new-btn aa-print-btn" id="aaPrint">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimir
          </button>
        </div>

        <div class="aa-controls">
          <div class="form-row">
            <div class="form-group">
              <label>Número</label>
              <input type="text" id="aaDocNum" class="aa-readonly" readonly tabindex="-1">
            </div>
            <div class="form-group">
              <label>SEI</label>
              <input type="text" id="aaDocSei" class="aa-readonly" readonly tabindex="-1">
            </div>
            <div class="form-group grow">
              <label>Endereço</label>
              <input type="text" id="aaDocAddr" class="aa-readonly" readonly tabindex="-1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group grow">
              <label for="aaInterf">Interferência</label>
              <select id="aaInterf">
                <option value="">Selecione a interferência...</option>
              </select>
            </div>
            <div class="form-group grow">
              <label for="aaUser">Usuário</label>
              <select id="aaUser">
                <option value="">Selecione o usuário...</option>
              </select>
            </div>
            <div class="form-group grow">
              <label for="aaTemplate">Modelo</label>
              <select id="aaTemplate">
                <option value="">Selecione o modelo...</option>
                ${_TEMPLATES.map(t => `<option value="${t.dir}">${t.nome}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <iframe id="aaFrame" class="aa-frame" src=""></iframe>

      </div>
    `

    _bindEvents()
    _mounted = true
  }

  /** @description Registra os eventos do overlay. */
  function _bindEvents() {
    _el('aaClose').addEventListener('click', close)
    _el('aaCopy').addEventListener('click', _copyHtml)
    _el('aaPrint').addEventListener('click', _print)

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !_el('aaOverlay').hidden) close()
    })

    _el('aaInterf').addEventListener('change', () => {
      const idx = _el('aaInterf').value
      if (idx !== '') {
        const raw = _interferences[Number(idx)]
        _selectedInterference = {
          ...raw,
          finalidades: raw.finalidades || [],
          demandas:    raw.demandas    || [],
          tipoPoco: raw.tipoPoco
            ? { ...raw.tipoPoco, descricao: raw.tipoPoco.descricao || _TIPO_POCO_MAP[raw.tipoPoco.id] || '' }
            : { id: null, descricao: '' }
        }
      } else {
        _selectedInterference = null
      }
      _updateFrame()
    })

    _el('aaUser').addEventListener('change', _updateFrame)
    _el('aaTemplate').addEventListener('change', _updateFrame)
  }

  /**
   * @description Abre o overlay, lê os dados da tela principal e carrega os selects.
   */
  async function open() {
    if (!_mounted) return

    const doc       = DocumentView.getValue()
    const addrData  = SelectAddress.getData()
    const addrLabel = addrData?.logradouro || SelectAddress.getLabel() || ''

    _el('aaDocNum').value  = doc.number    || ''
    _el('aaDocSei').value  = doc.numberSei || ''
    _el('aaDocAddr').value = addrLabel     || ''

    _interferences        = []
    _users                = []
    _selectedInterference = null

    _el('aaInterf').innerHTML  = '<option value="">Buscando interferências...</option>'
    _el('aaUser').innerHTML    = '<option value="">Buscando usuários...</option>'
    _el('aaTemplate').value    = ''
    _el('aaFrame').src         = ''

    _el('aaOverlay').removeAttribute('hidden')

    await Promise.all([
      _loadInterferences(addrLabel),
      doc.documentId ? _loadUsers(doc.documentId) : _setNoUsers()
    ])
  }

  /**
   * @description Busca interferências pelo logradouro e popula o select.
   * @param {string} logradouro
   */
  async function _loadInterferences(logradouro) {
    if (!logradouro) {
      _el('aaInterf').innerHTML = '<option value="">Endereço não informado</option>'
      return
    }
    try {
      const rows = await window.interferenceService.fetchRawByKeyword(logradouro)
      _interferences = rows
      const sel = _el('aaInterf')
      if (!rows.length) {
        sel.innerHTML = '<option value="">Nenhuma interferência encontrada</option>'
        return
      }
      sel.innerHTML = '<option value="">Selecione a interferência...</option>' +
        rows.map((r, i) => {
          const tipo  = r.tipoInterferencia?.descricao || ''
          const addr  = r.endereco?.logradouro || ''
          const lat   = r.latitude  != null ? Number(r.latitude).toFixed(4)  : ''
          const lng   = r.longitude != null ? Number(r.longitude).toFixed(4) : ''
          const coord = (lat && lng) ? `(${lat}, ${lng})` : ''
          const label = [tipo, addr, coord].filter(Boolean).join(' — ')
          return `<option value="${i}">${label || `Interferência ${r.id}`}</option>`
        }).join('')
    } catch (err) {
      console.error('AdministrativeActsView: erro ao buscar interferências', err)
      _el('aaInterf').innerHTML = '<option value="">Erro ao carregar interferências</option>'
    }
  }

  /**
   * @description Busca usuários vinculados ao documento e popula o select.
   * @param {string|number} documentId
   */
  async function _loadUsers(documentId) {
    try {
      const rows = await window.userService.fetchByDocumentId(documentId)
      _users = rows
      const sel = _el('aaUser')
      if (!rows.length) {
        sel.innerHTML = '<option value="">Nenhum usuário encontrado</option>'
        return
      }
      sel.innerHTML = '<option value="">Selecione o usuário...</option>' +
        rows.map(u => `<option value="${u.id}">${u.nome || u.cpfCnpj || u.id}</option>`).join('')
    } catch (err) {
      console.error('AdministrativeActsView: erro ao buscar usuários', err)
      _el('aaUser').innerHTML = '<option value="">Erro ao carregar usuários</option>'
    }
  }

  /** @description Fallback quando o documento não tem ID. */
  function _setNoUsers() {
    _el('aaUser').innerHTML = '<option value="">Documento sem ID</option>'
  }

  /**
   * @description Atualiza o src do iframe e injeta os dados após o carregamento.
   * Só executa quando interferência e modelo estão selecionados.
   */
  function _updateFrame() {
    const templateDir = _el('aaTemplate').value
    if (!templateDir || !_selectedInterference) return

    const frame = _el('aaFrame')
    frame.src = `templates/${templateDir}/index.html`

    frame.onload = () => {
      try {
        const documento = _buildDocumento(_el('aaUser').value)
        const win = frame.contentWindow
        if (win.utils && typeof win.utils.updateHtmlDocument === 'function') {
          win.utils.updateHtmlDocument(documento, _selectedInterference)
        }
        /* Oculta o painel de debug do diretório actions — não faz parte do documento */
        const actionsEl = win.document.getElementById('actions')
        if (actionsEl) actionsEl.style.display = 'none'
      } catch (err) {
        console.error('AdministrativeActsView: erro ao injetar dados no template', err)
      }
    }
  }

  /**
   * @description Monta o objeto documento no formato esperado pelos templates.
   * Combina dados da tela principal com a interferência e usuário selecionados.
   * @param {string|number} selectedUserId
   * @returns {Object}
   */
  function _buildDocumento(selectedUserId) {
    const doc  = DocumentView.getValue()
    const addr = SelectAddress.getData()
    const proc = SelectProcess.getData()
    const anx  = SelectAnnex.getData()
    const user = _users.find(u => String(u.id) === String(selectedUserId)) || null

    return {
      id:            doc.documentId ? Number(doc.documentId) : null,
      numero:        doc.number      || '',
      numeroSei:     doc.numberSei   || '',
      tipoDocumento: {
        id:        Number(doc.typeId) || null,
        descricao: doc.typeDescricao  || ''
      },
      endereco: {
        id:             addr?.id         ?? null,
        logradouro:     addr?.logradouro || SelectAddress.getLabel() || '',
        bairro:         addr?.bairro     || null,
        cidade:         addr?.cidade     || null,
        cep:            addr?.cep        || null,
        interferencias: [_selectedInterference]
      },
      processo: {
        id:     proc ? (Number(proc.id) || null) : null,
        numero: proc?.numero || '',
        anexo: {
          id:        anx ? (Number(anx.id) || null) : null,
          numero:    anx?.numero || '',
          processos: []
        }
      },
      usuarios: [user
        ? { id: user.id, nome: user.nome, cpfCnpj: user.cpfCnpj || '' }
        : { id: null, nome: '', cpfCnpj: '' }
      ]
    }
  }

  /**
   * @description Copia o HTML renderizado do iframe para a área de transferência.
   * Fornece feedback visual alterando o texto do botão por 2 segundos.
   */
  async function _copyHtml() {
    const frame = _el('aaFrame')
    if (!frame?.contentDocument) return
    const doc = frame.contentDocument
    const styles = Array.from(doc.querySelectorAll('style')).map(s => s.outerHTML).join('\n')
    const content = styles + doc.body.innerHTML
    const btn = _el('aaCopy')
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html':  new Blob([content], { type: 'text/html' }),
          'text/plain': new Blob([content], { type: 'text/plain' })
        })
      ])
      const orig = btn.innerHTML
      btn.textContent = 'Copiado!'
      setTimeout(() => { btn.innerHTML = orig }, 2000)
    } catch (err) {
      console.error('AdministrativeActsView: erro ao copiar conteúdo', err)
    }
  }

  /** @description Imprime o conteúdo do iframe. */
  function _print() {
    const frame = _el('aaFrame')
    if (frame?.src && frame.contentWindow) {
      frame.contentWindow.print()
    }
  }

  /** @description Fecha o overlay e limpa o iframe. */
  function close() {
    _el('aaOverlay')?.setAttribute('hidden', '')
    _el('aaFrame').src = ''
  }

  /** @returns {boolean} */
  function isMounted() { return _mounted }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, open, close, isMounted }
})()
