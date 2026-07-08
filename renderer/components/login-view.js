/**
 * @file login-view.js
 * @description Modal de autenticação: abas "Entrar" e "Cadastrar".
 * - Abre automaticamente na inicialização se não houver sessão ativa.
 * - Persiste sessão em localStorage (chave: `regg_session`).
 * - Salva credenciais (e-mail + senha) em localStorage (chave: `regg_credentials`).
 *   Suporta múltiplos e-mails; exibe dropdown ao focar o campo de e-mail.
 * - Sincroniza o token JWT com o processo main via `authService.setToken`.
 * - Atualiza o botão #btnLogin na topbar conforme estado de autenticação.
 */


const LoginView = (() => {
  const SESSION_KEY  = 'regg_session'
  const CREDS_KEY    = 'regg_credentials'
  let _canClose = false

  /* ── Sessão ────────────────────────────────────────────────────────────── */

  /** @returns {{ token: string, colaborador: { id: string, email: string } } | null} */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
  }

  /**
   * @description Verifica localmente (via claim `exp`) se um JWT já expirou,
   * sem precisar de uma chamada ao backend. Usado ao iniciar o app para não
   * mostrar a tela principal com uma sessão morta.
   * @param {string} token
   * @returns {boolean}
   */
  function _isTokenExpired(token) {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const { exp }  = JSON.parse(atob(payload))
      return !exp || Date.now() >= exp * 1000
    } catch {
      return true
    }
  }

  /** @param {{ token: string, colaborador: object } | null} data */
  function _setSession(data) {
    if (data) localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    else       localStorage.removeItem(SESSION_KEY)
    window.authService?.setToken(data?.token || '')
  }

  /* ── Credenciais salvas ─────────────────────────────────────────────────── */

  /** @returns {Array<{ email: string, password: string }>} */
  function _getCredentials() {
    try { return JSON.parse(localStorage.getItem(CREDS_KEY)) || [] } catch { return [] }
  }

  /**
   * @description Salva ou atualiza a credencial de um e-mail.
   * @param {string} email
   * @param {string} password
   */
  function _saveCredential(email, password) {
    if (!email) return
    const list = _getCredentials().filter(c => c.email !== email)
    list.unshift({ email, password })
    localStorage.setItem(CREDS_KEY, JSON.stringify(list))
  }

  /**
   * @description Remove a credencial de um e-mail específico.
   * @param {string} email
   */
  function _removeCredential(email) {
    const list = _getCredentials().filter(c => c.email !== email)
    localStorage.setItem(CREDS_KEY, JSON.stringify(list))
  }

  /** @description Remove todas as credenciais salvas. */
  function _clearCredentials() {
    localStorage.removeItem(CREDS_KEY)
  }

  /* ── Topbar ────────────────────────────────────────────────────────────── */

  function _syncTopbarBtn() {
    const btn   = document.getElementById('btnLogin')
    const label = btn?.querySelector('.lv-btn-label')
    const email = getSession()?.colaborador?.email
    if (label) label.textContent = email ? email.split('@')[0] : 'Login'
    if (btn)   btn.title = email ?? ''
  }

  /* ── Painel de sessão ativa ────────────────────────────────────────────── */

  function _refreshSessionPanel() {
    const session  = getSession()
    const info     = document.getElementById('lvSessionInfo')
    const form     = document.getElementById('lvLoginForm')
    const emailEl  = document.getElementById('lvSessionEmail')
    const closeBtn = document.getElementById('lvClose')
    if (!info || !form) return
    if (session?.colaborador?.email) {
      info.removeAttribute('hidden')
      form.setAttribute('hidden', '')
      if (emailEl)  emailEl.textContent = session.colaborador.email
      if (closeBtn) closeBtn.removeAttribute('hidden')
    } else {
      info.setAttribute('hidden', '')
      form.removeAttribute('hidden')
      if (closeBtn) closeBtn.setAttribute('hidden', '')
    }
    _updateClearBtn()
  }

  /* ── Dropdown de credenciais salvas ────────────────────────────────────── */

  /**
   * @description Renderiza o dropdown de credenciais salvas filtradas pelo termo.
   * @param {string} term
   */
  function _renderCredDropdown(term) {
    const dropdown = document.getElementById('lvCredDropdown')
    if (!dropdown) return
    const list = _getCredentials().filter(c =>
      !term || c.email.toLowerCase().includes(term.toLowerCase())
    )
    if (!list.length) { _hideCredDropdown(); return }

    dropdown.innerHTML = ''

    list.forEach(c => {
      const item = document.createElement('div')
      item.className = 'lv-cred-item'

      const emailSpan = document.createElement('span')
      emailSpan.className   = 'lv-cred-email'
      emailSpan.textContent = c.email

      const removeBtn = document.createElement('button')
      removeBtn.type      = 'button'
      removeBtn.className = 'lv-cred-remove'
      removeBtn.title     = 'Remover'
      removeBtn.textContent = '×'

      item.appendChild(emailSpan)
      item.appendChild(removeBtn)
      dropdown.appendChild(item)

      // Closure captura email e password sem expor no HTML
      item.addEventListener('mousedown', e => {
        if (e.target === removeBtn) return
        document.getElementById('lvLoginEmail').value    = c.email
        document.getElementById('lvLoginPassword').value = c.password
        _hideCredDropdown()
      })

      removeBtn.addEventListener('mousedown', e => {
        e.preventDefault()
        _removeCredential(c.email)
        _renderCredDropdown(document.getElementById('lvLoginEmail').value)
        _updateClearBtn()
      })
    })

    dropdown.removeAttribute('hidden')
  }

  function _hideCredDropdown() {
    document.getElementById('lvCredDropdown')?.setAttribute('hidden', '')
  }

  /** @description Mostra o botão de limpeza se houver credenciais salvas. */
  function _updateClearBtn() {
    const btn = document.getElementById('lvClearAll')
    if (!btn) return
    btn.toggleAttribute('hidden', _getCredentials().length === 0)
  }

  /* ── Mount ─────────────────────────────────────────────────────────────── */

  function mount() {
    const overlay = document.createElement('div')
    overlay.id        = 'lv-overlay'
    overlay.className = 'lv-overlay'
    overlay.setAttribute('hidden', '')
    overlay.innerHTML = `
      <div class="lv-modal" role="dialog" aria-modal="true" aria-label="Autenticação">
        <button type="button" class="lv-close" id="lvClose" title="Fechar">×</button>

        <div class="lv-brand">
          <span class="lv-brand-name">R E G G +</span>
          <span class="lv-brand-sub">Acesso ao sistema</span>
        </div>

        <div class="lv-tabs" role="tablist">
          <button type="button" class="lv-tab lv-tab--active" id="lvTabEntrar"
            role="tab" aria-selected="true" aria-controls="lvPanelEntrar">Entrar</button>
          <button type="button" class="lv-tab" id="lvTabCadastrar"
            role="tab" aria-selected="false" aria-controls="lvPanelCadastrar">Cadastrar</button>
        </div>

        <!-- Painel: Entrar -->
        <div id="lvPanelEntrar" class="lv-panel" role="tabpanel">
          <form id="lvLoginForm" autocomplete="off" novalidate>
            <div class="form-group">
              <label for="lvLoginEmail">E-mail <span class="required">*</span></label>
              <div class="lv-input-wrap">
                <input type="email" id="lvLoginEmail" placeholder="seu@email.com"
                  required autocomplete="off">
                <div class="lv-cred-dropdown" id="lvCredDropdown" hidden></div>
              </div>
            </div>
            <div class="form-group">
              <label for="lvLoginPassword">Senha <span class="required">*</span></label>
              <input type="password" id="lvLoginPassword" placeholder="•••"
                required minlength="3" maxlength="5" autocomplete="off">
            </div>
            <p class="lv-msg" id="lvLoginMsg" hidden></p>
            <button type="submit" class="btn btn-primary lv-submit" id="lvLoginBtn">Entrar</button>
          </form>

          <div class="lv-session-info" id="lvSessionInfo" hidden>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span id="lvSessionEmail"></span>
            <button type="button" class="btn btn-secondary lv-logout-btn" id="lvLogout">Sair</button>
          </div>

          <div class="lv-cache-actions">
            <button type="button" class="lv-clear-creds" id="lvClearAll" hidden>
              Limpar e-mails, senhas e cache
            </button>
          </div>
        </div>

        <!-- Painel: Cadastrar -->
        <div id="lvPanelCadastrar" class="lv-panel" role="tabpanel" hidden>
          <form id="lvRegForm" autocomplete="off" novalidate>
            <div class="form-group">
              <label for="lvRegEmail">E-mail <span class="required">*</span></label>
              <input type="email" id="lvRegEmail" placeholder="seu@email.com"
                required autocomplete="off">
            </div>
            <div class="form-group">
              <label for="lvRegPassword">Senha <span class="required">*</span></label>
              <input type="password" id="lvRegPassword" placeholder="•••"
                required minlength="3" maxlength="5" autocomplete="off">
              <small class="lv-field-hint">Entre 3 e 5 caracteres.</small>
            </div>
            <div class="lv-reg-msgs">
              <p class="lv-msg lv-msg--ok"    id="lvRegMsgOk"      hidden></p>
              <p class="lv-msg lv-msg--error" id="lvRegMsgPending" hidden></p>
              <p class="lv-msg lv-msg--error" id="lvRegMsgErr"     hidden></p>
            </div>
            <button type="submit" class="btn btn-primary lv-submit" id="lvRegBtn">Cadastrar</button>
          </form>
        </div>
      </div>
    `
    document.body.appendChild(overlay)
    _bindEvents(overlay)

    // Substitui texto fixo do botão da topbar por span controlável
    const topbarBtn = document.getElementById('btnLogin')
    if (topbarBtn) {
      const textNode = [...topbarBtn.childNodes]
        .find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      if (textNode) {
        const span = document.createElement('span')
        span.className    = 'lv-btn-label'
        span.textContent  = 'Login'
        textNode.replaceWith(span)
      }
    }

    const session = getSession()
    if (session?.token && !_isTokenExpired(session.token)) {
      window.authService?.setToken(session.token)
      _canClose = true
    } else {
      const hadExpiredSession = !!session?.token
      if (hadExpiredSession) _setSession(null)
      _canClose = false
      open()
      if (hadExpiredSession) window.showToast?.('Sua sessão expirou. Faça login novamente.', 'error')
    }
    _syncTopbarBtn()
    _refreshSessionPanel()

    window.authService?.onExpired(_onTokenExpired)
  }

  /* ── Eventos ────────────────────────────────────────────────────────────── */

  /** @param {HTMLElement} overlay */
  function _bindEvents(overlay) {
    document.getElementById('btnLogin')?.addEventListener('click', open)

document.getElementById('lvClose').addEventListener('click', () => {
      if (_canClose) close()
    })
    overlay.addEventListener('click', e => {
      if (e.target === overlay && _canClose) close()
      else _hideCredDropdown()
    })
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (document.getElementById('lvCredDropdown')?.hasAttribute('hidden') === false) {
          _hideCredDropdown()
        } else if (_canClose && !overlay.hasAttribute('hidden')) {
          close()
        }
      }
    })

    // Abas
    document.getElementById('lvTabEntrar').addEventListener('click',    () => _switchTab('Entrar'))
    document.getElementById('lvTabCadastrar').addEventListener('click', () => _switchTab('Cadastrar'))

    // Dropdown de e-mails salvos
    const emailInput = document.getElementById('lvLoginEmail')
    emailInput.addEventListener('focus', () => _renderCredDropdown(emailInput.value))
    emailInput.addEventListener('input', () => _renderCredDropdown(emailInput.value))
    emailInput.addEventListener('blur',  () => setTimeout(_hideCredDropdown, 150))

    // Limpar tudo: e-mails, senhas e cache de sessão
    document.getElementById('lvClearAll').addEventListener('click', () => {
      _clearCredentials()
      localStorage.removeItem(SESSION_KEY)
      window.authService?.setToken('')
      _hideCredDropdown()
      _canClose = false
      _syncTopbarBtn()
      _refreshSessionPanel()
      window.showToast?.('E-mails, senhas e cache removidos.', 'info')
    })

    // Login
    document.getElementById('lvLoginForm').addEventListener('submit', async e => {
      e.preventDefault()
      const btn   = document.getElementById('lvLoginBtn')
      const email = document.getElementById('lvLoginEmail').value.trim()
      const pass  = document.getElementById('lvLoginPassword').value
      _setMsg('lvLoginMsg', '')
      if (pass.length < 3 || pass.length > 5) {
        _setMsg('lvLoginMsg', 'A senha deve ter entre 3 e 5 caracteres.', true)
        return
      }
      btn.disabled    = true
      btn.textContent = 'Entrando…'
      try {
        const data = await window.colaboradorService.login(email, pass)
        if (data?.token) {
          _setSession(data)
          _saveCredential(email, pass)
          _canClose = true
          _syncTopbarBtn()
          _refreshSessionPanel()
          window.showToast?.(`Bem-vindo, ${data.colaborador?.email ?? email}!`, 'success')
          close()
        } else {
          _setMsg('lvLoginMsg', data?.mensagem ?? 'Credenciais inválidas.', true)
        }
      } catch (err) {
        _setMsg('lvLoginMsg', _ipcMsg(err) || 'Não foi possível fazer login.', true)
      } finally {
        btn.disabled    = false
        btn.textContent = 'Entrar'
      }
    })

    // Cadastro
    document.getElementById('lvRegForm').addEventListener('submit', async e => {
      e.preventDefault()
      const btn   = document.getElementById('lvRegBtn')
      const email = document.getElementById('lvRegEmail').value.trim()
      const pass  = document.getElementById('lvRegPassword').value
      if (pass.length < 3 || pass.length > 5) {
        _showEl('lvRegMsgOk',      '')
        _showEl('lvRegMsgPending', '')
        _showEl('lvRegMsgErr',     'A senha deve ter entre 3 e 5 caracteres.')
        return
      }
      btn.disabled    = true
      btn.textContent = 'Cadastrando…'
      try {
        await window.colaboradorService.upsert(email, pass)
        _showEl('lvRegMsgOk',      'Cadastro Realizado com Sucesso!')
        _showEl('lvRegMsgPending', 'Aprovação pendente!')
        _showEl('lvRegMsgErr',     '')
        document.getElementById('lvRegForm').reset()
      } catch (err) {
        _showEl('lvRegMsgOk',      '')
        _showEl('lvRegMsgPending', '')
        _showEl('lvRegMsgErr',     _ipcMsg(err) || 'Não foi possível cadastrar.')
      } finally {
        btn.disabled    = false
        btn.textContent = 'Cadastrar'
      }
    })

    // Logout dentro do modal
    document.getElementById('lvLogout').addEventListener('click', _logout)
  }

  /* ── Abas ──────────────────────────────────────────────────────────────── */

  /**
   * @description Alterna entre as abas Entrar e Cadastrar.
   * @param {'Entrar'|'Cadastrar'} tab
   */
  function _switchTab(tab) {
    const isEntrar = tab === 'Entrar'
    document.getElementById('lvTabEntrar').classList.toggle('lv-tab--active', isEntrar)
    document.getElementById('lvTabCadastrar').classList.toggle('lv-tab--active', !isEntrar)
    document.getElementById('lvTabEntrar').setAttribute('aria-selected', String(isEntrar))
    document.getElementById('lvTabCadastrar').setAttribute('aria-selected', String(!isEntrar))
    document.getElementById('lvPanelEntrar').toggleAttribute('hidden', !isEntrar)
    document.getElementById('lvPanelCadastrar').toggleAttribute('hidden', isEntrar)
    _setMsg('lvLoginMsg', '')
    _showEl('lvRegMsgOk', '')
    _showEl('lvRegMsgPending', '')
    _showEl('lvRegMsgErr', '')
    _hideCredDropdown()
  }

  /* ── Erro IPC ──────────────────────────────────────────────────────────── */

  /**
   * @description Extrai a mensagem útil de erros Electron IPC.
   * O IPC envolve o erro em: "Error invoking remote method '...': Error: <msg>"
   * @param {unknown} err
   * @returns {string}
   */
  function _ipcMsg(err) {
    const raw   = err?.message || String(err)
    const match = raw.match(/Error:\s*(.+)$/)
    return match ? match[1].trim() : raw
  }

  /* ── Utilitários ───────────────────────────────────────────────────────── */

  /**
   * @description Exibe ou oculta um elemento de mensagem pelo id.
   * @param {string} id
   * @param {string} text
   */
  function _showEl(id, text) {
    const el = document.getElementById(id)
    if (!el) return
    el.textContent = text
    el.toggleAttribute('hidden', !text)
  }

  /**
   * @description Exibe uma mensagem no painel de login com cor dinâmica.
   * @param {string} id
   * @param {string} text
   * @param {boolean} [isError]
   */
  function _setMsg(id, text, isError = false) {
    const el = document.getElementById(id)
    if (!el) return
    el.textContent = text
    el.className   = `lv-msg${isError ? ' lv-msg--error' : ' lv-msg--ok'}`
    el.toggleAttribute('hidden', !text)
  }

  /* ── Logout ─────────────────────────────────────────────────────────────── */

  /**
   * @description Remove a sessão ativa e reabre o modal de login.
   * Mantém as credenciais salvas (e-mails/senhas) intactas.
   */
  function _endSession() {
    _setSession(null)
    _canClose = false
    _syncTopbarBtn()
    _refreshSessionPanel()
    open()
  }

  /** @description Logout manual (clique no botão "Sair"). */
  function _logout() {
    _endSession()
  }

  /**
   * @description Chamado quando o processo main detecta que o token JWT
   * expirou (claim `exp`) ou o backend respondeu 401. Encerra a sessão
   * local e reabre o modal para que o usuário faça login novamente.
   */
  function _onTokenExpired() {
    if (!getSession()) return
    _endSession()
    window.showToast?.('Sua sessão expirou. Faça login novamente.', 'error')
  }

  /* ── Público ────────────────────────────────────────────────────────────── */

  /** @description Abre o modal e pré-preenche com a credencial mais recente se não houver sessão. */
  function open() {
    _refreshSessionPanel()
    _updateClearBtn()
    if (!getSession()) {
      const last = _getCredentials()[0]
      if (last) {
        const elEmail = document.getElementById('lvLoginEmail')
        const elPass  = document.getElementById('lvLoginPassword')
        if (elEmail) elEmail.value = last.email
        if (elPass)  elPass.value  = last.password
      }
    }
    document.getElementById('lv-overlay')?.removeAttribute('hidden')
    setTimeout(() => document.getElementById('lvLoginEmail')?.focus(), 50)
  }

  /** @description Fecha o modal (só funciona se houver sessão ativa). */
  function close() {
    _hideCredDropdown()
    document.getElementById('lv-overlay')?.setAttribute('hidden', '')
  }

  return { mount, open, close, getSession }
})()
