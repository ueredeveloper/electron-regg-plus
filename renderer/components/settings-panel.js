/**
 * @file settings-panel.js
 * @description Painel lateral de configurações: seleção de paleta de cores
 * e verificação de atualização de versão. O tema escolhido é persistido
 * em localStorage e reaplicado automaticamente ao iniciar o app.
 */
const SettingsPanel = (() => {
  let _mounted = false

  /** @description Paletas disponíveis com cores de pré-visualização. */
  const _THEMES = [
    {
      id:     'padrao',
      label:  'Padrão',
      colors: { primary: '#1a5276', bg: '#f4f6f8', surface: '#ffffff', accent: '#2980b9' }
    },
    {
      id:     'escuro',
      label:  'Escuro',
      colors: { primary: '#1e293b', bg: '#0f172a', surface: '#1e293b', accent: '#60a5fa' }
    },
    {
      id:     'verde',
      label:  'Verde',
      colors: { primary: '#14532d', bg: '#f0fdf4', surface: '#ffffff', accent: '#16a34a' }
    },
    {
      id:     'roxo',
      label:  'Roxo',
      colors: { primary: '#3730a3', bg: '#f5f3ff', surface: '#ffffff', accent: '#818cf8' }
    },
    {
      id:     'ambar',
      label:  'Âmbar',
      colors: { primary: '#78350f', bg: '#fffbeb', surface: '#ffffff', accent: '#d97706' }
    }
  ]

  /**
   * @description Cria e insere o overlay e o painel no DOM.
   * Aplica o tema salvo em localStorage e registra todos os eventos.
   */
  function mount() {
    _createOverlay()
    _createPanel()
    _bindCloseBtn()
    _bindThemeButtons()
    _bindFontButtons()
    _bindUpdateButton()
    _loadSavedTheme()
    _loadSavedFontSize()
    _loadVersion()
    _listenAutoUpdate()

    document.getElementById('btnSettings').addEventListener('click', open)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _el('settingsPanel')?.classList.contains('open')) close()
    })

    _mounted = true
  }

  /** @description Cria o overlay semi-transparente. */
  function _createOverlay() {
    const overlay = document.createElement('div')
    overlay.id        = 'settingsOverlay'
    overlay.className = 'settings-overlay'
    overlay.addEventListener('click', close)
    document.body.appendChild(overlay)
  }

  /** @description Cria o painel com cabeçalho, paletas e seção de atualização. */
  function _createPanel() {
    const panel = document.createElement('div')
    panel.id        = 'settingsPanel'
    panel.className = 'settings-panel'
    panel.innerHTML = `
      <div class="settings-header">
        <div class="settings-header-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
                     a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
                     A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
                     l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
                     A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
                     l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
                     a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
                     l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
                     a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Configurações
        </div>
        <button type="button" id="settingsClose" class="settings-close" title="Fechar">×</button>
      </div>

      <div class="settings-content">

        <p class="settings-section-label">Paleta de Cores</p>
        <div class="settings-palettes" id="settingsPalettes">
          ${_THEMES.map(t => `
            <button type="button" class="palette-swatch" data-theme="${t.id}" title="${t.label}">
              <div class="palette-preview">
                <div class="palette-bar"   style="background:${t.colors.primary}"></div>
                <div class="palette-body"  style="background:${t.colors.bg}">
                  <div class="palette-card" style="background:${t.colors.surface}">
                    <div class="palette-accent" style="background:${t.colors.accent}"></div>
                  </div>
                </div>
              </div>
              <span class="palette-label">${t.label}</span>
            </button>
          `).join('')}
        </div>

        <p class="settings-section-label" style="margin-top:28px">Tamanho de Fonte</p>
        <div class="settings-font-sizes" id="settingsFontSizes">
          <button type="button" class="settings-font-btn" data-size="12">A <small>12</small></button>
          <button type="button" class="settings-font-btn" data-size="14">A <small>14</small></button>
          <button type="button" class="settings-font-btn" data-size="16">A <small>16</small></button>
        </div>

        <p class="settings-section-label" style="margin-top:28px">Colaboradores</p>
        <div class="settings-colaboradores" id="settingsColaboradores">
          <p class="settings-colab-loading" id="settingsColabLoading">Carregando...</p>
          <p class="settings-colab-error"   id="settingsColabError"   hidden></p>
          <div class="settings-colab-table-wrap" id="settingsColabTable" hidden>
            <table class="settings-colab-table">
              <thead>
                <tr><th>E-mail</th><th>Autorizado</th><th></th></tr>
              </thead>
              <tbody id="settingsColabBody"></tbody>
            </table>
          </div>
        </div>

        <p class="settings-section-label" style="margin-top:28px">Versão do Aplicativo</p>
        <div class="settings-update-box">
          <span class="settings-version">
            Versão atual: <strong id="settingsVersion">—</strong>
          </span>
          <button type="button" class="btn btn-secondary" id="settingsCheckUpdate">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                 style="vertical-align:middle;margin-right:5px">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Verificar Atualizações
          </button>
          <p class="settings-update-status" id="settingsUpdateStatus" hidden></p>
        </div>

      </div>
    `
    document.body.appendChild(panel)
  }

  /** @description Registra o botão de fechar do cabeçalho. */
  function _bindCloseBtn() {
    _el('settingsClose').addEventListener('click', close)
  }

  /**
   * @description Registra o clique em cada swatch de paleta:
   * aplica o tema, marca como ativo e persiste no arquivo userData.
   */
  function _bindThemeButtons() {
    _el('settingsPalettes').querySelectorAll('.palette-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        _applyTheme(btn.dataset.theme)
        _markActive(btn.dataset.theme)
        _persistTheme(btn.dataset.theme)
      })
    })
  }

  function _bindFontButtons() {
    _el('settingsFontSizes').querySelectorAll('.settings-font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.size
        _applyFontSize(size)
        _markActiveFont(size)
        _persistFontSize(size)
      })
    })
  }

  function _applyFontSize(size) {
    const zoom = { '12': '0.90', '14': '1', '16': '1.15' }
    document.documentElement.style.zoom = zoom[String(size)] || '1'
  }

  function _markActiveFont(size) {
    _el('settingsFontSizes')?.querySelectorAll('.settings-font-btn').forEach(btn => {
      btn.classList.toggle('settings-font-btn--active', btn.dataset.size === String(size))
    })
  }

  async function _persistFontSize(size) {
    localStorage.setItem('reegg-font-size', String(size))
    try {
      const s = await window.appService.loadSettings()
      await window.appService.saveSettings({ ...s, fontSize: String(size) })
    } catch { }
  }

  async function _loadSavedFontSize() {
    let size = '14'
    try {
      const s = await window.appService.loadSettings()
      size = s?.fontSize || localStorage.getItem('reegg-font-size') || '14'
    } catch {
      size = localStorage.getItem('reegg-font-size') || '14'
    }
    _applyFontSize(size)
    _markActiveFont(size)
  }

  /**
   * @description Aplica o tema ao elemento `<html>` via classe CSS.
   * @param {string} themeId
   */
  function _applyTheme(themeId) {
    document.documentElement.className = themeId === 'padrao' ? '' : `theme-${themeId}`
  }

  /**
   * @description Marca o swatch do tema ativo como selecionado.
   * @param {string} themeId
   */
  function _markActive(themeId) {
    _el('settingsPalettes')?.querySelectorAll('.palette-swatch').forEach(btn => {
      btn.classList.toggle('palette-swatch--active', btn.dataset.theme === themeId)
    })
  }

  /**
   * @description Salva o tema no arquivo settings.json (userData do Electron)
   * e também em localStorage como fallback.
   * @param {string} themeId
   */
  async function _persistTheme(themeId) {
    localStorage.setItem('reegg-theme', themeId)
    try {
      const s = await window.appService.loadSettings()
      await window.appService.saveSettings({ ...s, theme: themeId })
    } catch { }
  }

  /**
   * @description Carrega o tema salvo: prioriza o arquivo userData,
   * cai para localStorage se o arquivo não existir ainda.
   */
  async function _loadSavedTheme() {
    let themeId = 'padrao'
    try {
      const settings = await window.appService.loadSettings()
      if (settings?.theme) {
        themeId = settings.theme
      } else {
        themeId = localStorage.getItem('reegg-theme') || 'padrao'
      }
    } catch {
      themeId = localStorage.getItem('reegg-theme') || 'padrao'
    }
    _applyTheme(themeId)
    _markActive(themeId)
  }

  /** @description Busca a versão atual do app via IPC e exibe no painel. */
  async function _loadVersion() {
    try {
      const v = await window.appService.getVersion()
      const el = _el('settingsVersion')
      if (el) el.textContent = `v${v}`
    } catch { /* sem IPC em dev sem electron */ }
  }

  /**
   * @description Registra o botão de verificar atualizações.
   * Faz check via IPC e exibe o resultado. Se houver update disponível,
   * abre a página de download ao clicar no status.
   */
  function _bindUpdateButton() {
    _el('settingsCheckUpdate').addEventListener('click', async () => {
      const btn       = _el('settingsCheckUpdate')
      const origInner = btn.innerHTML

      btn.disabled  = true
      const status = _el('settingsUpdateStatus')
      if (status) status.hidden = true
      btn.innerHTML = '<span style="opacity:.65">Verificando...</span>'

      try {
        const result = await window.appService.checkUpdate()
        _showUpdateResult(result)
      } catch {
        _showUpdateResult({ type: 'error', message: 'Não foi possível verificar atualizações.' })
      } finally {
        btn.disabled  = false
        btn.innerHTML = origInner
      }
    })
  }

  /**
   * @description Exibe o resultado de uma verificação de atualização no painel
   * e, se for update, adiciona badge no botão de configurações.
   * @param {{ type: string, message: string, url?: string }} result
   */
  function _showUpdateResult(result) {
    const status = _el('settingsUpdateStatus')
    if (!status) return
    status.textContent = result.message
    status.className   = `settings-update-status settings-update-status--${result.type}`
    status.hidden      = false

    if (result.type === 'update') {
      // Badge no botão de configurações da topbar
      const btn = document.getElementById('btnSettings')
      if (btn && !btn.querySelector('.settings-update-badge')) {
        const badge = document.createElement('span')
        badge.className   = 'settings-update-badge'
        badge.title       = result.message
        badge.textContent = '!'
        btn.appendChild(badge)
      }
      // Toast de notificação
      window.showToast?.(result.message, 'info')

      if (result.url) {
        // Remove listener anterior para evitar duplicatas
        const newStatus = status.cloneNode(true)
        status.parentNode.replaceChild(newStatus, status)
        newStatus.textContent = result.message
        newStatus.className   = `settings-update-status settings-update-status--${result.type}`
        newStatus.hidden      = false
        newStatus.addEventListener('click', () => window.appService.openExternal(result.url), { once: true })
      }
    }
  }

  /**
   * @description Registra o listener de atualização automática enviada pelo processo main.
   * Chamado uma vez no mount; exibe resultado quando o main detectar nova versão.
   */
  function _listenAutoUpdate() {
    window.appService?.onUpdateAvailable(result => _showUpdateResult(result))
  }

  const _ICON_GRANT  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>`

  const _ICON_REVOKE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>`

  /** @description Carrega e renderiza a lista de colaboradores. */
  async function _loadColaboradores() {
    const loading = _el('settingsColabLoading')
    const error   = _el('settingsColabError')
    const table   = _el('settingsColabTable')
    const tbody   = _el('settingsColabBody')

    if (!loading) return
    loading.hidden = false
    error.hidden   = true
    table.hidden   = true

    try {
      const session = JSON.parse(localStorage.getItem('reeg_session') || 'null')
      const isAdmin = session?.colaborador?.admin === true

      const list = await window.colaboradorService.fetchAll()
      tbody.innerHTML = list.map(c => `
        <tr data-id="${c.id}" data-auth="${c.autorizacao}">
          <td>${c.email}</td>
          <td class="settings-colab-status ${c.autorizacao ? 'auth-yes' : 'auth-no'}">
            ${c.autorizacao ? 'Sim' : 'Não'}
          </td>
          <td>
            <button type="button"
                    class="settings-colab-btn ${c.autorizacao ? 'auth-revoke' : 'auth-grant'}"
                    data-id="${c.id}" data-auth="${c.autorizacao}"
                    title="${isAdmin ? (c.autorizacao ? 'Revogar autorização' : 'Autorizar') : 'Somente administradores podem alterar autorizações'}"
                    ${isAdmin ? '' : 'disabled'}>
              ${c.autorizacao ? _ICON_REVOKE : _ICON_GRANT}
            </button>
          </td>
        </tr>
      `).join('')

      if (!isAdmin) {
        const warn = document.createElement('p')
        warn.className   = 'settings-colab-warn'
        warn.textContent = 'Somente administradores podem autorizar ou revogar colaboradores.'
        table.parentNode.insertBefore(warn, table)
      }

      tbody.querySelectorAll('.settings-colab-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => _toggleAutorizacao(btn))
      })

      loading.hidden = true
      table.hidden   = false
    } catch (err) {
      loading.hidden      = true
      error.hidden        = false
      error.textContent   = `Erro ao carregar colaboradores: ${err.message}`
    }
  }

  /**
   * @description Alterna a autorização de um colaborador e atualiza a linha na tabela.
   * @param {HTMLButtonElement} btn
   */
  async function _toggleAutorizacao(btn) {
    const id          = btn.dataset.id
    const currentAuth = btn.dataset.auth === 'true'
    const newAuth     = !currentAuth

    btn.disabled  = true
    btn.innerHTML = '<span style="font-size:11px;opacity:.5">…</span>'

    try {
      await window.colaboradorService.updateAutorizacao(id, newAuth)

      const row    = btn.closest('tr')
      const status = row.querySelector('.settings-colab-status')

      row.dataset.auth   = newAuth
      btn.dataset.auth   = newAuth
      status.textContent = newAuth ? 'Sim' : 'Não'
      status.className   = `settings-colab-status ${newAuth ? 'auth-yes' : 'auth-no'}`
      btn.className      = `settings-colab-btn ${newAuth ? 'auth-revoke' : 'auth-grant'}`
      btn.title          = newAuth ? 'Revogar autorização' : 'Autorizar'
      btn.innerHTML      = newAuth ? _ICON_REVOKE : _ICON_GRANT
    } catch (err) {
      window.showToast?.(`Erro ao atualizar autorização: ${err.message}`, 'error')
      btn.innerHTML = currentAuth ? _ICON_REVOKE : _ICON_GRANT
    } finally {
      btn.disabled = false
    }
  }

  /** @description Abre o painel de configurações. */
  function open() {
    if (!_mounted) return
    _el('settingsOverlay').classList.add('open')
    _el('settingsPanel').classList.add('open')
    _loadColaboradores()
  }

  /** @description Fecha o painel de configurações. */
  function close() {
    _el('settingsOverlay')?.classList.remove('open')
    _el('settingsPanel')?.classList.remove('open')
  }

  /** @param {string} id @returns {HTMLElement} */
  function _el(id) { return document.getElementById(id) }

  return { mount, open, close }
})()
