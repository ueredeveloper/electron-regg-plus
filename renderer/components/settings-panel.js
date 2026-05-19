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
    _bindUpdateButton()
    _loadSavedTheme()
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
      await window.appService.saveSettings({ theme: themeId })
    } catch { /* ambiente sem IPC ignora silenciosamente */ }
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

  /** @description Abre o painel de configurações. */
  function open() {
    if (!_mounted) return
    _el('settingsOverlay').classList.add('open')
    _el('settingsPanel').classList.add('open')
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
