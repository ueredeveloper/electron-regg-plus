const { app, BrowserWindow, ipcMain, screen, shell } = require('electron')
const path = require('path')
const fs   = require('fs')

const _GH_REPO = 'ueredeveloper/electron-regg-plus'

async function _checkGitHubRelease() {
  // /releases/latest retorna 404 se não existir nenhuma release publicada;
  // buscamos a lista e pegamos a primeira não-draft e não-prerelease.
  const res = await fetch(`https://api.github.com/repos/${_GH_REPO}/releases?per_page=10`)
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const list = await res.json()
  const release = list.find(r => !r.draft && !r.prerelease)
  if (!release) throw new Error('Nenhuma release publicada encontrada.')
  return release
}

// Impede que o DPI scaling do Windows (125%, 150% etc.) amplie a UI do app.
// O Chromium renderiza em pixels físicos 1:1, ignorando a escala do SO.
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', '1')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}


const DocumentService      = require('./services/document-service')
const DomainService        = require('./services/domain-service')
const AddressService       = require('./services/address-service')
const EstadoService        = require('./services/estado-service')
const UserService          = require('./services/user-service')
const ProcessService       = require('./services/process-service')
const AnnexService         = require('./services/annex-service')
const InterferenceService  = require('./services/interference-service')
const BaciaService             = require('./services/bacia-service')
const UnidadeService           = require('./services/unidade-service')
const HidrogeoPorosoService    = require('./services/hidrogeo-poroso-service')
const HidrogeoFraturadoService = require('./services/hidrogeo-fraturado-service')
const FinalidadeService        = require('./services/finalidade-service')
const CoordConverter           = require('./utils/coord-converter')
const ColaboradorService       = require('./services/colaborador-service')
const AvailabilityService      = require('./services/availability-service')
const authStore                = require('./utils/auth-store')

/* ── Interceptor global de fetch: injeta Bearer token em todas as requisições ── */
;(() => {
  const _nativeFetch = globalThis.fetch
  globalThis.fetch = function (url, options = {}) {
    const token = authStore.getToken()
    if (token && !String(url).includes('github.com')) {
      options = { ...options }
      options.headers = { Authorization: `Bearer ${token}`, ...(options.headers || {}) }
    }
    return _nativeFetch(url, options)
  }
})()

const _docSvc     = new DocumentService()
const _domainSvc  = new DomainService()
const _addrSvc    = new AddressService()
const _estadoSvc  = new EstadoService()
const _userSvc    = new UserService()
const _procSvc    = new ProcessService()
const _annexSvc   = new AnnexService()
const _ifSvc      = new InterferenceService()
const _baciaSvc      = new BaciaService()
const _unidadeSvc    = new UnidadeService()
const _porosoSvc     = new HidrogeoPorosoService()
const _fraturadoSvc  = new HidrogeoFraturadoService()
const _finalidadeSvc = new FinalidadeService()
const _colaboradorSvc = new ColaboradorService()
const _availSvc       = new AvailabilityService()

if (!app.isPackaged) {
  const _electronExec = path.join(
    __dirname, 'node_modules', 'electron', 'dist',
    fs.readFileSync(
      path.join(__dirname, 'node_modules', 'electron', 'path.txt'), 'utf-8'
    ).trim()
  )

  const reload = require('electron-reload')

  reload(path.join(__dirname, 'renderer'), {
    electron: _electronExec
  })

  reload([
    path.join(__dirname, 'main.js'),
    path.join(__dirname, 'preload.js')
  ], {
    electron:        _electronExec,
    forceHardReset:  true,
    hardResetMethod: 'exit'
  })
}

function createWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width:     Math.round(sw * 0.9),
    height:    Math.round(sh * 0.9),
    minWidth:  900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'REEG+ - Registro de Dados e Criação de Atos',
    show: false
  })

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'))

  win.once('ready-to-show', () => {
    win.maximize()
    if (app.isPackaged) {
      setTimeout(async () => {
        try {
          const release  = await _checkGitHubRelease()
          const latest   = release.tag_name?.replace(/^v/, '')
          const current  = app.getVersion()
          if (latest && latest !== current) {
            const asset = release.assets?.find(a => a.name.endsWith('.exe'))
            const url   = asset?.browser_download_url ?? release.html_url
            win.webContents.send('app:update-available', {
              type: 'update', version: latest,
              message: `Nova versão disponível: v${latest}. Clique para baixar.`, url
            })
          }
        } catch { /* silencioso em background */ }
      }, 4000)
    }
  })
}

/* ── IPC: DocumentService ──────────────────────────────────────────────────── */

ipcMain.handle('document:fetchByParam',   (_event, keyword) => _docSvc.fetchByParam(keyword))
ipcMain.handle('document:fetchByUserId', (_event, userId)  => _docSvc.fetchByUserId(userId))
ipcMain.handle('document:save',         (_event, doc)     => _docSvc.save(doc))
ipcMain.handle('document:update',       (_event, doc)     => _docSvc.update(doc))
ipcMain.handle('document:deleteById',   (_event, id)      => _docSvc.deleteById(id))

/* ── IPC: DomainService ────────────────────────────────────────────────────── */

ipcMain.handle('domain:fetchAll',    () => _domainSvc.fetchAll())
ipcMain.handle('domain:listBacias',  () => _domainSvc.listBacias())
ipcMain.handle('domain:listUnidades',() => _domainSvc.listUnidades())

/* ── IPC: EstadoService ────────────────────────────────────────────────────── */

ipcMain.handle('estado:fetchAll', () => _estadoSvc.fetchAll())

/* ── IPC: AddressService ───────────────────────────────────────────────────── */

ipcMain.handle('address:fetchByKeyword', (_event, keyword) => _addrSvc.fetchByKeyword(keyword))
ipcMain.handle('address:save',           (_event, addr)    => _addrSvc.save(addr))
ipcMain.handle('address:deleteById',     (_event, id)      => _addrSvc.deleteById(id))

/* ── IPC: UserService ──────────────────────────────────────────────────────── */

ipcMain.handle('user:fetchByKeyword',    (_event, keyword) => _userSvc.fetchByKeyword(keyword))
ipcMain.handle('user:fetchByDocumentId',(_event, docId)   => _userSvc.fetchByDocumentId(docId))
ipcMain.handle('user:save',             (_event, user)    => _userSvc.save(user))
ipcMain.handle('user:deleteById',       (_event, id)      => _userSvc.deleteById(id))

/* ── IPC: ProcessService ───────────────────────────────────────────────────── */

ipcMain.handle('process:fetchByKeyword', (_event, keyword) => _procSvc.fetchByKeyword(keyword))
ipcMain.handle('process:save',           (_event, proc)    => _procSvc.save(proc))
ipcMain.handle('process:deleteById',     (_event, id)      => _procSvc.deleteById(id))

/* ── IPC: AnnexService ─────────────────────────────────────────────────────── */

ipcMain.handle('annex:fetchByKeyword', (_event, keyword) => _annexSvc.fetchByKeyword(keyword))
ipcMain.handle('annex:save',           (_event, annex)   => _annexSvc.save(annex))
ipcMain.handle('annex:deleteById',     (_event, id)      => _annexSvc.deleteById(id))

/* ── IPC: InterferenceService ──────────────────────────────────────────────── */

ipcMain.handle('interference:fetchByKeyword',    (_event, keyword) => _ifSvc.fetchByKeyword(keyword))
ipcMain.handle('interference:fetchRawByKeyword', (_event, keyword) => _ifSvc.fetchRawByKeyword(keyword))
ipcMain.handle('interference:fetchRawByAddressId', (_event, addId) => _ifSvc.fetchRawByAddressId(addId))
ipcMain.handle('interference:save',              (_event, obj)     => _ifSvc.save(obj))
ipcMain.handle('interference:update',            (_event, obj)     => _ifSvc.update(obj))
ipcMain.handle('interference:deleteById',        (_event, id)      => _ifSvc.deleteById(id))

/* ── IPC: BaciaService ─────────────────────────────────────────────────────── */

ipcMain.handle('bacia:listAll',       ()                   => _baciaSvc.listAll())
ipcMain.handle('bacia:findByPoint',   (_event, lat, lng)   => _baciaSvc.findByPoint(lat, lng))

/* ── IPC: UnidadeService ───────────────────────────────────────────────────── */

ipcMain.handle('unidade:listAll',     ()                   => _unidadeSvc.listAll())
ipcMain.handle('unidade:findByPoint', (_event, lat, lng)   => _unidadeSvc.findByPoint(lat, lng))

/* ── IPC: FinalidadeService ─────────────────────────────────────────────────── */

ipcMain.handle('finalidade:deleteById', (_event, id) => _finalidadeSvc.deleteById(id))

/* ── IPC: HidrogeoPorosoService ────────────────────────────────────────────── */

ipcMain.handle('poroso:listAll',       ()                  => _porosoSvc.listAll())
ipcMain.handle('poroso:findByPoint',   (_event, lat, lng)  => _porosoSvc.findByPoint(lat, lng))
ipcMain.handle('poroso:findByCodPlan', (_event, codPlan)   => _porosoSvc.findByCodPlan(codPlan))

/* ── IPC: HidrogeoFraturadoService ─────────────────────────────────────────── */

ipcMain.handle('fraturado:listAll',       ()                  => _fraturadoSvc.listAll())
ipcMain.handle('fraturado:findByPoint',   (_event, lat, lng)  => _fraturadoSvc.findByPoint(lat, lng))
ipcMain.handle('fraturado:findByCodPlan', (_event, codPlan)   => _fraturadoSvc.findByCodPlan(codPlan))

/* ── IPC: AvailabilityService ──────────────────────────────────────────────── */

ipcMain.handle('availability:findPoints', (_event, tpId, lat, lng) => _availSvc.findPointsInSystem(tpId, lat, lng))

/* ── IPC: Auth ─────────────────────────────────────────────────────────────── */

ipcMain.handle('auth:setToken', (_event, token) => { authStore.setToken(token); return true })

/* ── IPC: ColaboradorService ───────────────────────────────────────────────── */

ipcMain.handle('colaborador:login',             (_event, email, password)       => _colaboradorSvc.login(email, password))
ipcMain.handle('colaborador:upsert',            (_event, email, password)       => _colaboradorSvc.upsert(email, password))
ipcMain.handle('colaborador:fetchAll',          ()                              => _colaboradorSvc.fetchAll())
ipcMain.handle('colaborador:updateAutorizacao', (_event, id, autorizacao)       => _colaboradorSvc.updateAutorizacao(id, autorizacao))

/* ── IPC: CoordConverter ───────────────────────────────────────────────────── */

ipcMain.handle('coords:utmToDecimal', (_event, e, n, z, h)              => CoordConverter.utmToDecimal(e, n, z, h))
ipcMain.handle('coords:dmsToDecimal', (_event, ld, lm, ls, ldir, od, om, os, odir) => CoordConverter.dmsToDecimal(ld, lm, ls, ldir, od, om, os, odir))

/* ── IPC: App (versão, atualização e configurações) ───────────────────────── */

const _settingsFile = () => path.join(app.getPath('userData'), 'settings.json')

ipcMain.handle('app:loadSettings', () => {
  try {
    const p = _settingsFile()
    if (!fs.existsSync(p)) return {}
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch { return {} }
})

ipcMain.handle('app:saveSettings', (_event, settings) => {
  try {
    fs.writeFileSync(_settingsFile(), JSON.stringify(settings, null, 2), 'utf-8')
    return true
  } catch { return false }
})

ipcMain.handle('app:getVersion', () => app.getVersion())

ipcMain.handle('app:openExternal', (_event, url) => shell.openExternal(url))

ipcMain.handle('app:checkUpdate', async () => {
  if (!app.isPackaged) return { type: 'ok', message: 'Modo de desenvolvimento.' }
  try {
    const release  = await _checkGitHubRelease()
    const latest   = release.tag_name?.replace(/^v/, '')
    const current  = app.getVersion()
    if (latest && latest !== current) {
      const asset = release.assets?.find(a => a.name.endsWith('.exe'))
      const url   = asset?.browser_download_url ?? release.html_url
      return { type: 'update', version: latest, url,
               message: `Nova versão disponível: v${latest}. Clique para baixar.` }
    }
    return { type: 'ok', message: `Você está usando a versão mais recente (v${current}).` }
  } catch (err) {
    const detail = err?.message ?? String(err)
    console.error('[app:checkUpdate]', detail)
    return { type: 'error', message: `Não foi possível verificar atualizações. ${detail}` }
  }
})

/* ── App lifecycle ─────────────────────────────────────────────────────────── */

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
