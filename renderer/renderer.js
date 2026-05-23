/**
 * @file renderer.js
 * @description Orquestrador principal: inicializa o mapa Leaflet e monta
 * os componentes ativos no formulário. Para ativar um componente futuro,
 * descomente o div correspondente em index.html e a linha .mount() abaixo.
 */


// ── COMPONENTES ATIVOS ──────────────────────────────────────────────────────

DocumentList.mount(document.getElementById('section-document-list'))
DocumentView.mount(document.getElementById('section-document'))
AddressView.mount(document.getElementById('address-drawer'))
InterferenceView.mount(document.getElementById('interference-drawer'))
UserView.mount(document.getElementById('user-drawer'))
ProcessView.mount(document.getElementById('process-drawer'))
AnnexView.mount(document.getElementById('annex-drawer'))
AdministrativeActsView.mount(document.getElementById('administrative-acts-drawer'))
DocumentChartView.mount(document.getElementById('document-chart-drawer'))
SelectAddress.mount(document.getElementById('section-address'))
SelectInterference.mount(document.getElementById('section-interference'))
SelectUser.mount(document.getElementById('section-user'))
SelectProcess.mount(document.getElementById('section-process'))
SelectAnnex.mount(document.getElementById('section-attachment'))
MapCoordsBar.mount(document.getElementById('map-coords-bar'))
CoordConverter.mount(document.getElementById('coord-converter'))
SettingsPanel.mount()
LoginView.mount()
InputClear.init()

// ── MAPA ─────────────────────────────────────────────────────────────────────


const map = L.map('map', {
  center: [-15.7801, -47.9292],
  zoom: 7,
  zoomControl: true
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map)

let marker = null

const markerIcon = L.divIcon({
  className: '',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.27 21.73 0 14 0z"
      fill="#1a5276" stroke="#fff" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="5" fill="#fff"/>
  </svg>`,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -40]
})

/**
 * @description Posiciona ou reposiciona o marcador no mapa.
 * Atualiza o rodapé do mapa e notifica o InterferenceView se estiver montado.
 * @param {number} lat
 * @param {number} lng
 */
function placeMarker(lat, lng) {
  if (marker) map.removeLayer(marker)

  marker = L.marker([lat, lng], { icon: markerIcon, draggable: true })
    .addTo(map)
    .bindPopup(`<b>Interferência</b><br>Lat: ${lat.toFixed(6)}<br>Lon: ${lng.toFixed(6)}`)

  marker.on('dragend', (e) => {
    const pos = e.target.getLatLng()
    _updateMapFooter(pos.lat, pos.lng)
    if (InterferenceView.isMounted()) InterferenceView.setCoords(pos.lat, pos.lng)
  })

  _updateMapFooter(lat, lng)
  if (SelectInterference.isMounted()) SelectInterference.setCoords(lat, lng)
  if (InterferenceView.isMounted())   InterferenceView.setCoords(lat, lng)
}

/**
 * @description Atualiza a barra de coordenadas do mapa.
 * @param {number} lat
 * @param {number} lng
 */
function _updateMapFooter(lat, lng) {
  MapCoordsBar.show(lat, lng)
  document.getElementById('mapHint').textContent = 'Marcador pode ser arrastado'
  map.invalidateSize({ animate: false })
}

/* Clique no mapa posiciona o marcador */
map.on('click', (e) => placeMarker(e.latlng.lat, e.latlng.lng))

/* MapCoordsBar: remover marcador */
document.addEventListener('map-coords:remove', () => {
  if (marker) { map.removeLayer(marker); marker = null }
  MapCoordsBar.hide()
  map.invalidateSize({ animate: false })
  document.getElementById('mapHint').textContent = 'Clique no mapa para marcar a interferência'
  if (SelectInterference.isMounted()) SelectInterference.reset()
  if (InterferenceView.isMounted())   InterferenceView.reset()
})

/* MapCoordsBar: centralizar mapa e propagar coordenadas ao formulário */
document.addEventListener('map-coords:center', (e) => {
  const { lat, lng } = e.detail
  map.setView([lat, lng], map.getZoom())
  if (SelectInterference.isMounted()) SelectInterference.setCoords(lat, lng)
  if (InterferenceView.isMounted())   InterferenceView.setCoords(lat, lng)
})

/**
 * @description Exibe um ponto no mapa com zoom animado lento e posiciona o marcador.
 * @param {number} lat
 * @param {number} lng
 */
function _showPoint(lat, lng) {
  map.flyTo([lat, lng], 14, { duration: 1.5 })
  placeMarker(lat, lng)
}

/* Botão de conversor de coordenadas: expande o mapa e rola até o conversor */
document.addEventListener('iv:open-coord-converter', () => {
  const ws = document.querySelector('.workspace')
  if (!ws.classList.contains('map-expanded')) {
    _lastOpenView =
      _DRAWER_VIEWS.find(({ id }) => document.getElementById(id)?.classList.contains('open'))?.view
      ?? (!document.getElementById('aaOverlay')?.hidden ? AdministrativeActsView : null)
    ;[AddressView, InterferenceView, UserView, ProcessView, AnnexView, AdministrativeActsView]
      .forEach(v => v.isMounted() && v.close())
    ws.classList.add('map-expanded')
    setTimeout(() => map.invalidateSize({ animate: false }), 370)
  }
  setTimeout(() => {
    document.getElementById('coord-converter')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, 400)
})

/* InterferenceView e conversores emitem este evento para navegar ao ponto */
document.addEventListener('interference:goto', (e) => {
  const { lat, lng } = e.detail
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    showToast('Coordenadas fora do intervalo válido.', 'error')
    return
  }
  _showPoint(lat, lng)
})

// ── SELEÇÃO NA LISTA DE DOCUMENTOS ───────────────────────────────────────────

/**
 * @description Preenche todos os campos do formulário com os dados do
 * documento selecionado na lista. O evento `document-list:select` carrega
 * o registro completo diretamente (sem segunda query).
 */
document.addEventListener('document-list:select', (e) => {
  const doc = e.detail

  if (DocumentView.isMounted()) {
    DocumentView.setValue({
      id:        doc.id,
      typeId:    doc.tipoDocumentoId,
      number:    doc.numero    || '',
      numberSei: doc.numeroSei || ''
    })
  }

  if (SelectAddress.isMounted()) {
    SelectAddress.setValue({
      addressId:    doc.enderecoId,
      addressLabel: doc.logradouro  || '',
      bairro:       doc.bairro      || '',
      cidade:       doc.cidade      || '',
      cep:          doc.cep         || '',
      estado:       doc.enderecoEstado   || '',
      estadoId:     doc.enderecoEstadoId ?? null
    })
  }

  if (SelectInterference.isMounted()) {
    SelectInterference.setValue({
      latitude:  doc.latitude  != null ? String(doc.latitude)  : '',
      longitude: doc.longitude != null ? String(doc.longitude) : ''
    })
  }

  if (SelectUser.isMounted()) {
    SelectUser.setValue({
      userId:    doc.usuarioId,
      userLabel: doc.usuarioNome || '',
      cpfCnpj:   doc.cpfCnpj    || ''
    })
  }

  if (SelectProcess.isMounted()) {
    SelectProcess.setValue({
      processId:    doc.processoId,
      processLabel: doc.processoNumero || '',
      anexoNumero:  doc.anexoNumero    || ''
    })
  }

  if (SelectAnnex.isMounted()) {
    SelectAnnex.setValue({
      annexId:        doc.anexoId,
      annexLabel:     doc.anexoNumero    || '',
      processoNumero: doc.processoNumero || ''
    })
  }

  /* Posiciona o marcador no mapa se as coordenadas estiverem disponíveis */
  if (doc.latitude != null && doc.longitude != null) {
    _showPoint(doc.latitude, doc.longitude)
  }
})

// ── AÇÕES DO FORMULÁRIO ───────────────────────────────────────────────────────

document.getElementById('btnNew').addEventListener('click', () => {
  if (SelectAddress.isMounted())      SelectAddress.reset()
  if (SelectInterference.isMounted()) SelectInterference.reset()
  if (SelectUser.isMounted())         SelectUser.reset()
  if (SelectProcess.isMounted())      SelectProcess.reset()
  if (SelectAnnex.isMounted())        SelectAnnex.reset()
  if (marker) { map.removeLayer(marker); marker = null }
  MapCoordsBar.hide()
  map.invalidateSize({ animate: false })
  document.getElementById('mapHint').textContent = 'Clique no mapa para marcar a interferência'
})

document.getElementById('btnSave').addEventListener('click', async () => {
  const form = document.getElementById('documentForm')
  if (!form.checkValidity()) { form.reportValidity(); return }
  if (!_validateSelects()) return

  const btn  = document.getElementById('btnSave')
  const orig = btn.textContent
  btn.disabled    = true
  btn.textContent = orig === 'Editar' ? 'Editando…' : 'Salvando…'

  try {
    const data = _collectData()
    const { documentId } = DocumentView.getValue()

    if (documentId) {
      const updated = await window.documentService.update({ id: documentId, ...data })
      if (DocumentList.isMounted()) DocumentList.prependRow(updated)
      showToast('Documento atualizado com sucesso!', 'success')
    } else {
      const saved = await window.documentService.save(data)
      if (DocumentList.isMounted()) DocumentList.prependRow(saved)
      showToast('Documento salvo com sucesso!', 'success')
    }
  } catch (err) {
    console.error('[renderer] Erro ao salvar documento:', err)
    showToast('Erro ao salvar documento.', 'error')
  } finally {
    btn.disabled    = false
    btn.textContent = orig
  }
})

const _DRAWER_VIEWS = [
  { view: AddressView,      id: 'address-drawer' },
  { view: InterferenceView, id: 'interference-drawer' },
  { view: UserView,         id: 'user-drawer' },
  { view: ProcessView,      id: 'process-drawer' },
  { view: AnnexView,        id: 'annex-drawer' },
]

let _lastOpenView = null

document.getElementById('btnToggleMap').addEventListener('click', () => {
  const ws = document.querySelector('.workspace')
  ws.classList.toggle('map-expanded')

  if (ws.classList.contains('map-expanded')) {
    _lastOpenView =
      _DRAWER_VIEWS.find(({ id }) => document.getElementById(id)?.classList.contains('open'))?.view
      ?? (!document.getElementById('aaOverlay')?.hidden ? AdministrativeActsView : null)

    ;[AddressView, InterferenceView, UserView, ProcessView, AnnexView, AdministrativeActsView]
      .forEach(v => v.isMounted() && v.close())
  } else if (_lastOpenView) {
    const viewToReopen = _lastOpenView
    _lastOpenView = null
    setTimeout(() => {
      if (typeof viewToReopen.show === 'function') viewToReopen.show()
      else viewToReopen.open()
    }, 400)
  }

  setTimeout(() => map.invalidateSize({ animate: false }), 370)
})

/**
 * @description Valida se todos os campos obrigatórios dos Select components estão preenchidos.
 * Exibe um toast de erro para o primeiro campo em falta e retorna false.
 * @returns {boolean}
 */
function _validateSelects() {
  const { userId }    = SelectUser.isMounted()    ? SelectUser.getValue()    : {}
  const { addressId } = SelectAddress.isMounted() ? SelectAddress.getValue() : {}
  const { processId } = SelectProcess.isMounted() ? SelectProcess.getValue() : {}
  const { annexId }   = SelectAnnex.isMounted()   ? SelectAnnex.getValue()   : {}

  if (!userId)    { showToast('Selecione um usuário (requerente).', 'error');         return false }
  const userData = SelectUser.isMounted() ? SelectUser.getData() : null
  if (userData && !userData.cpfCnpj) {
    showToast('O usuário precisa ser cadastrado com CPF/CNPJ antes de salvar.', 'error')
    return false
  }
  if (!addressId) { showToast('Selecione um endereço.',              'error');         return false }
  if (!processId) { showToast('Selecione um processo.',              'error');         return false }
  if (!annexId)   { showToast('Selecione um processo principal.',    'error');         return false }
  return true
}

/**
 * @description Coleta os dados de todos os componentes montados.
 * Inclui os dados completos (getData) dos Selects para montar o payload aninhado.
 * @returns {Object}
 */
function _collectData() {
  const basic = [
    DocumentView, SelectAddress, SelectInterference,
    SelectUser, SelectProcess, SelectAnnex,
    InterferenceView, UserView, ProcessView, AnnexView
  ]
    .filter(c => c.isMounted())
    .reduce((acc, c) => ({ ...acc, ...c.getValue() }), {})

  return {
    ...basic,
    addressData:  SelectAddress.isMounted()  ? SelectAddress.getData()  : null,
    userData:     SelectUser.isMounted()     ? SelectUser.getData()     : null,
    processData:  SelectProcess.isMounted()  ? SelectProcess.getData()  : null,
    annexData:    SelectAnnex.isMounted()    ? SelectAnnex.getData()    : null
  }
}

// ── TOAST ─────────────────────────────────────────────────────────────────────

let _toastTimer = null

/**
 * @description Exibe uma notificação temporária na tela.
 * @param {string} msg - Mensagem a exibir.
 * @param {'success'|'error'|''} type - Tipo visual da notificação.
 */
function showToast(msg, type) {
  const toast = document.getElementById('toast')
  toast.textContent = msg
  toast.className = 'toast show' + (type ? ` ${type}` : '')
  clearTimeout(_toastTimer)
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3000)
}
window.showToast = showToast

// ── COPIAR CÉLULA DE TABELA ───────────────────────────────────────────────────

/**
 * @description Copia o texto de qualquer célula de tabela clicada para o clipboard.
 * Ignora células de ação e valores vazios/placeholder.
 */
document.addEventListener('click', (e) => {
  if (e.target.closest('button')) return
  const td = e.target.closest('td')
  if (!td || td.classList.contains('doc-list-action-cell')) return
  const text = td.textContent.trim()
  if (!text || text === '—') return
  navigator.clipboard.writeText(text).then(() => {
    td.classList.remove('td-copied')
    void td.offsetWidth
    td.classList.add('td-copied')
    setTimeout(() => td.classList.remove('td-copied'), 700)
  }).catch(() => {})
})

/* Workaround para Electron/Windows: após operações IPC assíncronas os inputs de
   texto podem perder a capacidade de receber foco via teclado. Forçar o foco
   no mousedown (fase de captura) garante que o input seja sempre ativável. */
document.addEventListener('mousedown', (e) => {
  const el = e.target
  if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !el.disabled && !el.readOnly) {
    setTimeout(() => { if (document.contains(el)) el.focus() }, 0)
  }
}, true)
