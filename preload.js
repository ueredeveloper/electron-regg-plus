const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  onMessage: (callback) => ipcRenderer.on('message', (_event, value) => callback(value))
})

/** @description Serviço de documentos. */
contextBridge.exposeInMainWorld('documentService', {
  fetchByParam:   (keyword) => ipcRenderer.invoke('document:fetchByParam', keyword),
  fetchByUserId:  (userId)  => ipcRenderer.invoke('document:fetchByUserId', userId),
  save:           (doc)     => ipcRenderer.invoke('document:save', doc),
  update:         (doc)     => ipcRenderer.invoke('document:update', doc),
  deleteById:     (id)      => ipcRenderer.invoke('document:deleteById', id)
})

/** @description Serviço de tabelas de domínio (selects de interferência). */
contextBridge.exposeInMainWorld('domainService', {
  fetchAll:     () => ipcRenderer.invoke('domain:fetchAll'),
  listBacias:   () => ipcRenderer.invoke('domain:listBacias'),
  listUnidades: () => ipcRenderer.invoke('domain:listUnidades')
})

/** @description Serviço de estados. */
contextBridge.exposeInMainWorld('estadoService', {
  fetchAll: () => ipcRenderer.invoke('estado:fetchAll')
})

/** @description Serviço de endereços. */
contextBridge.exposeInMainWorld('addressService', {
  fetchByKeyword: (keyword) => ipcRenderer.invoke('address:fetchByKeyword', keyword),
  save:           (addr)    => ipcRenderer.invoke('address:save', addr),
  deleteById:     (id)      => ipcRenderer.invoke('address:deleteById', id)
})

/** @description Serviço de usuários. */
contextBridge.exposeInMainWorld('userService', {
  fetchByKeyword:    (keyword) => ipcRenderer.invoke('user:fetchByKeyword', keyword),
  fetchByDocumentId: (docId)   => ipcRenderer.invoke('user:fetchByDocumentId', docId),
  save:              (user)    => ipcRenderer.invoke('user:save', user),
  deleteById:        (id)      => ipcRenderer.invoke('user:deleteById', id)
})

/** @description Serviço de processos. */
contextBridge.exposeInMainWorld('processService', {
  fetchByKeyword: (keyword) => ipcRenderer.invoke('process:fetchByKeyword', keyword),
  save:           (proc)    => ipcRenderer.invoke('process:save', proc),
  deleteById:     (id)      => ipcRenderer.invoke('process:deleteById', id)
})

/** @description Serviço de anexos (processos principais). */
contextBridge.exposeInMainWorld('annexService', {
  fetchByKeyword: (keyword) => ipcRenderer.invoke('annex:fetchByKeyword', keyword),
  save:           (annex)   => ipcRenderer.invoke('annex:save', annex),
  deleteById:     (id)      => ipcRenderer.invoke('annex:deleteById', id)
})

/** @description Serviço de interferências hídricas. */
contextBridge.exposeInMainWorld('interferenceService', {
  fetchByKeyword:      (keyword) => ipcRenderer.invoke('interference:fetchByKeyword', keyword),
  fetchRawByKeyword:   (keyword) => ipcRenderer.invoke('interference:fetchRawByKeyword', keyword),
  fetchRawByAddressId: (addId)   => ipcRenderer.invoke('interference:fetchRawByAddressId', addId),
  save:                (obj)     => ipcRenderer.invoke('interference:save', obj),
  update:              (obj)     => ipcRenderer.invoke('interference:update', obj),
  deleteById:          (id)      => ipcRenderer.invoke('interference:deleteById', id)
})

/** @description Serviço de bacias hidrográficas. */
contextBridge.exposeInMainWorld('baciaService', {
  listAll:     ()         => ipcRenderer.invoke('bacia:listAll'),
  findByPoint: (lat, lng) => ipcRenderer.invoke('bacia:findByPoint', lat, lng)
})

/** @description Serviço de unidades hidrográficas. */
contextBridge.exposeInMainWorld('unidadeService', {
  listAll:     ()         => ipcRenderer.invoke('unidade:listAll'),
  findByPoint: (lat, lng) => ipcRenderer.invoke('unidade:findByPoint', lat, lng)
})

/** @description Serviço de finalidades de interferência. */
contextBridge.exposeInMainWorld('finalidadeService', {
  deleteById: (id) => ipcRenderer.invoke('finalidade:deleteById', id)
})

/** @description Serviço de sistemas hidrogeo porosos (poço manual / poço raso). */
contextBridge.exposeInMainWorld('porosoService', {
  listAll:       ()          => ipcRenderer.invoke('poroso:listAll'),
  findByPoint:   (lat, lng)  => ipcRenderer.invoke('poroso:findByPoint', lat, lng),
  findByCodPlan: (codPlan)   => ipcRenderer.invoke('poroso:findByCodPlan', codPlan)
})

/** @description Serviço de sistemas hidrogeo fraturados (poço profundo). */
contextBridge.exposeInMainWorld('fraturadoService', {
  listAll:       ()          => ipcRenderer.invoke('fraturado:listAll'),
  findByPoint:   (lat, lng)  => ipcRenderer.invoke('fraturado:findByPoint', lat, lng),
  findByCodPlan: (codPlan)   => ipcRenderer.invoke('fraturado:findByCodPlan', codPlan)
})

/** @description Utilitário de conversão de coordenadas geográficas. */
contextBridge.exposeInMainWorld('coordService', {
  utmToDecimal: (e, n, z, h)                          => ipcRenderer.invoke('coords:utmToDecimal', e, n, z, h),
  dmsToDecimal: (ld, lm, ls, ldir, od, om, os, odir)  => ipcRenderer.invoke('coords:dmsToDecimal', ld, lm, ls, ldir, od, om, os, odir)
})

/** @description Sincroniza o token JWT com o processo main. */
contextBridge.exposeInMainWorld('authService', {
  setToken: (token) => ipcRenderer.invoke('auth:setToken', token)
})

/** @description Serviço de análise de disponibilidade hídrica subterrânea. */
contextBridge.exposeInMainWorld('availabilityService', {
  findPointsInSystem: (tpId, lat, lng) => ipcRenderer.invoke('availability:findPoints', tpId, lat, lng)
})

/** @description Serviço de autenticação de colaboradores. */
contextBridge.exposeInMainWorld('colaboradorService', {
  login:             (email, password) => ipcRenderer.invoke('colaborador:login',             email, password),
  upsert:            (email, password) => ipcRenderer.invoke('colaborador:upsert',            email, password),
  fetchAll:          ()                => ipcRenderer.invoke('colaborador:fetchAll'),
  updateAutorizacao: (id, autorizacao) => ipcRenderer.invoke('colaborador:updateAutorizacao', id, autorizacao)
})

/** @description Serviço de aplicativo: versão, atualização e configurações. */
contextBridge.exposeInMainWorld('appService', {
  getVersion:        ()         => ipcRenderer.invoke('app:getVersion'),
  checkUpdate:       ()         => ipcRenderer.invoke('app:checkUpdate'),
  openExternal:      (url)      => ipcRenderer.invoke('app:openExternal', url),
  loadSettings:      ()         => ipcRenderer.invoke('app:loadSettings'),
  saveSettings:      (settings) => ipcRenderer.invoke('app:saveSettings', settings),
  onUpdateAvailable: (cb)       => ipcRenderer.on('app:update-available', (_e, result) => cb(result))
})
