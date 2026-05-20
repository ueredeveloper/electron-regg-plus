/**
 * @file availability-view.js
 * @description Painel de Análise de Disponibilidade de outorga.
 * Montado dentro do #aaPanelDisp pelo AdministrativeActsView.
 * Recebe o contexto (interferência + usuário selecionado) via setContext().
 */
const AvailabilityView = (() => {
  let _mounted = false
  let _selectedInterference = null
  let _users                = []
  let _selectedUserId       = null

  let _chartInstance = null
  let _logScale      = false
  let _lastData      = null
  let _mapLayer      = null
  let _pointsLayer   = null

  const _TIPO_POCO_MAP = { 1: 'Manual', 2: 'Tubular Raso', 3: 'Tubular Profundo' }

  /* ── Mount ──────────────────────────────────────────────────────────────── */

  function mount(container) {
    container.innerHTML = `
      <div class="aa-disp-controls">
        <div class="form-row">
          <div class="form-group">
            <label>Latitude</label>
            <input type="text" id="aaDispLat" class="aa-readonly" readonly tabindex="-1">
          </div>
          <div class="form-group">
            <label>Longitude</label>
            <input type="text" id="aaDispLng" class="aa-readonly" readonly tabindex="-1">
          </div>
          <div class="form-group">
            <label>Tipo de Poço</label>
            <input type="text" id="aaDispTipo" class="aa-readonly" readonly tabindex="-1">
          </div>
          <div class="form-group grow">
            <label>Usuário</label>
            <input type="text" id="aaDispUserName" class="aa-readonly" readonly tabindex="-1">
          </div>
          <div class="form-group aa-disp-toggle-group">
            <label>&nbsp;</label>
            <label class="aa-disp-log-switch"
                   title="Ativado: inclui o ponto analisado no cálculo de Q Outorgada e Q Usuário. Desativado: exibe o cenário sem o ponto (apenas outorgas existentes)">
              <input type="checkbox" id="aaDispWithPoint" checked>
              <span class="aa-disp-log-track">
                <span class="aa-disp-log-thumb"></span>
              </span>
              <span class="aa-disp-log-text">Com ponto</span>
            </label>
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <button type="button" class="btn btn-primary" id="aaDispAnalyze">Analisar</button>
          </div>
        </div>
      </div>

      <div class="aa-disp-body">

        <div id="aaDispNoInterf" class="aa-disp-status">
          Selecione uma interferência na aba <strong>Atos Administrativos</strong> para analisar a disponibilidade.
        </div>
        <div id="aaDispLoading" class="aa-disp-status" hidden>Carregando análise...</div>
        <div id="aaDispError" class="aa-disp-status aa-disp-status--error" hidden></div>

        <div id="aaDispResults" hidden>

          <div class="aa-disp-info-bar">
            <span>Bacia Hidrográfica: <strong id="aaDispBacia">—</strong></span>
            <span class="aa-disp-sep">|</span>
            <span>Unidade Hidrográfica: <strong id="aaDispUH">—</strong></span>
          </div>

          <div class="aa-disp-table-wrap">
            <table class="aa-disp-table">
              <thead>
                <tr>
                  <th>Sistema</th>
                  <th>Código</th>
                  <th>Q Explotável (m³/ano)</th>
                  <th>N° Poços</th>
                  <th>Q Total Outorgada (m³/ano)</th>
                  <th>% UTILIZADA</th>
                  <th>Vol. Disponível (m³/ano)</th>
                </tr>
              </thead>
              <tbody id="aaDispTableBody"></tbody>
            </table>
          </div>

          <div class="aa-disp-chart-section">
            <div class="aa-disp-chart-toolbar">
              <span class="aa-disp-chart-title">Análise de Disponibilidade</span>
              <label class="aa-disp-log-switch"
                     title="Escala logarítmica facilita a comparação quando há grande diferença de magnitude entre os valores">
                <input type="checkbox" id="aaDispLogToggle">
                <span class="aa-disp-log-track">
                  <span class="aa-disp-log-thumb"></span>
                </span>
                <span class="aa-disp-log-text">Escala Log</span>
              </label>
            </div>
            <div id="aaDispChart" class="aa-disp-chart"></div>
          </div>

          <div class="aa-disp-points-section" id="aaDispPointsList" hidden></div>

        </div>
      </div>
    `
    _bindEvents()
    _mounted = true
  }

  /* ── API pública ─────────────────────────────────────────────────────────── */

  /**
   * @description Chamado pelo AdministrativeActsView ao trocar de aba ou ao
   * mudar a interferência/usuário selecionados.
   * @param {Object|null} interference
   * @param {Array}       users
   * @param {string|null} selectedUserId
   */
  function setContext(interference, users, selectedUserId) {
    _selectedInterference = interference || null
    _users                = users || []
    _selectedUserId       = selectedUserId || null
    if (_mounted) _populateCoords()
  }

  /** @description Remove camadas do mapa. Chamado ao abrir nova sessão de análise. */
  function clearMapLayers() {
    if (typeof map === 'undefined' || !map) return
    if (_mapLayer)    { map.removeLayer(_mapLayer);    _mapLayer    = null }
    if (_pointsLayer) { map.removeLayer(_pointsLayer); _pointsLayer = null }
    _lastData = null
  }

  /* ── Eventos ────────────────────────────────────────────────────────────── */

  function _bindEvents() {
    _el('aaDispAnalyze').addEventListener('click', _analyze)

    _el('aaDispWithPoint').addEventListener('change', () => {
      if (!_lastData) return
      const withPoint = _el('aaDispWithPoint').checked
      const analyse   = withPoint ? _lastData.analyseWith : _lastData.analyseWithout
      _renderResults(_lastData.hgInfo, analyse, withPoint ? _lastData.userVol : 0)
      setTimeout(() => _chartInstance?.resize(), 60)
    })

    _el('aaDispLogToggle').addEventListener('change', e => {
      _logScale = e.target.checked
      if (_lastData) {
        const withPoint = _el('aaDispWithPoint').checked
        const analyse   = withPoint ? _lastData.analyseWith : _lastData.analyseWithout
        _renderChart(analyse.q_ex, analyse.q_outorgada, analyse.vol_disponivel, withPoint ? _lastData.userVol : 0)
      }
    })
  }

  /* ── Coordenadas ────────────────────────────────────────────────────────── */

  function _populateCoords() {
    if (!_selectedInterference) {
      _el('aaDispLat').value      = ''
      _el('aaDispLng').value      = ''
      _el('aaDispTipo').value     = ''
      _el('aaDispUserName').value = ''
      _showState('nointerf')
      return
    }
    _el('aaDispLat').value  = _selectedInterference.latitude  ?? ''
    _el('aaDispLng').value  = _selectedInterference.longitude ?? ''
    const tpId = _selectedInterference.tipoPoco?.id
    _el('aaDispTipo').value = _TIPO_POCO_MAP[tpId] || (tpId ? `Tipo ${tpId}` : '')

    const userName = _selectedInterference.us_nome
      || _users.find(u => String(u.id) === String(_selectedUserId))?.nome
      || ''
    _el('aaDispUserName').value = userName

    if (_el('aaDispResults').hidden) _showState('idle')
  }

  function _showState(state) {
    _el('aaDispNoInterf').hidden = state !== 'nointerf'
    _el('aaDispLoading').hidden  = state !== 'loading'
    _el('aaDispError').hidden    = state !== 'error'
    _el('aaDispResults').hidden  = state !== 'results'
  }

  /* ── Análise ────────────────────────────────────────────────────────────── */

  async function _analyze() {
    if (!_selectedInterference) { _showState('nointerf'); return }

    const lat  = _selectedInterference.latitude
    const lng  = _selectedInterference.longitude
    const tpId = _selectedInterference.tipoPoco?.id || 3

    if (lat == null || lng == null) {
      _el('aaDispError').textContent = 'Interferência sem coordenadas.'
      _showState('error')
      return
    }

    _showState('loading')
    _el('aaDispAnalyze').disabled = true

    try {
      const addId = _selectedInterference.endereco?.id || SelectAddress.getData()?.id

      const [response, demandsRaw] = await Promise.all([
        window.availabilityService.findPointsInSystem(tpId, lat, lng),
        addId
          ? window.interferenceService.fetchRawByAddressId(addId).catch(() => [])
          : Promise.resolve([])
      ])

      const { _hg_info, _hg_shape, _points } = response

      const matchedInterf = demandsRaw.find(
        d => String(d.int_id) === String(_selectedInterference.id)
      )
      const userVol = parseFloat(matchedInterf?.vol_anual_ma) || 0

      const userMarker = {
        id: 0,
        dt_demanda: { vol_anual_ma: userVol },
        int_latitude: lat,
        int_longitude: lng,
        tp_id: tpId
      }

      const basePoints     = _points || []
      const analyseWith    = _calcAnalysis(_hg_info, [userMarker, ...basePoints])
      const analyseWithout = _calcAnalysis(_hg_info, basePoints)

      const withPoint = _el('aaDispWithPoint').checked
      const analyse   = withPoint ? analyseWith : analyseWithout

      const userInfo = _users.find(u => String(u.id) === String(_selectedUserId)) || null
      const userPoint = {
        _isUser:    true,
        us_nome:    userInfo?.nome     || _selectedInterference.us_nome    || '—',
        cpf_cnpj:   userInfo?.cpfCnpj  || _selectedInterference.cpf_cnpj  || '—',
        processo:   SelectProcess.isMounted() ? SelectProcess.getData() : null,
        endereco:   _selectedInterference.endereco || SelectAddress.getData() || null,
        dt_demanda: matchedInterf?.dt_demanda || null
      }

      _lastData = { hgInfo: _hg_info, analyseWith, analyseWithout, userVol, points: basePoints, userPoint }

      _drawShape(_hg_shape)
      _drawPoints(basePoints, { lat, lng, vol: userVol })
      _renderResults(_hg_info, analyse, userVol)
      _showState('results')
      setTimeout(() => _chartInstance?.resize(), 60)
    } catch (err) {
      console.error('AvailabilityView:', err)
      _el('aaDispError').textContent = `Erro: ${err.message}`
      _showState('error')
    } finally {
      _el('aaDispAnalyze').disabled = false
    }
  }

  function _calcAnalysis(info, points) {
    let total = 0
    points.forEach(p => {
      const v = p.dt_demanda?.vol_anual_ma
      total += (v == null) ? 0 : (parseFloat(v) || 0)
    })
    const q_ex = Number(info?.re_cm_ano) || 0
    let pct = q_ex > 0 ? ((total * 100) / q_ex).toFixed(4) : '0.0000'
    if (isNaN(parseFloat(pct))) pct = '0.0000'
    return {
      q_ex,
      n_points:       points.length,
      q_outorgada:    total,
      pct_utilizada:  pct,
      vol_disponivel: q_ex - total
    }
  }

  /* ── Renderização ───────────────────────────────────────────────────────── */

  function _renderResults(info, analyse, userVol) {
    _el('aaDispBacia').textContent = _selectedInterference?.baciaHidrografica?.baciaNome
                                     || info?.bacia_nome || '—'
    _el('aaDispUH').textContent   = info?.uh_nome || '—'

    const fmt = n => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    _el('aaDispTableBody').innerHTML = `
      <tr>
        <td>${info?.sistema  || '—'}</td>
        <td>${info?.cod_plan || '—'}</td>
        <td>${fmt(analyse.q_ex)}</td>
        <td>${analyse.n_points}</td>
        <td>${fmt(analyse.q_outorgada)}</td>
        <td>${analyse.pct_utilizada}</td>
        <td>${fmt(analyse.vol_disponivel)}</td>
      </tr>
    `
    _renderChart(analyse.q_ex, analyse.q_outorgada, analyse.vol_disponivel, userVol)
    _renderPointsList()
  }

  function _renderChart(qEx, qOut, qDisp, qUser) {
    const el = _el('aaDispChart')
    if (!el) return
    if (typeof echarts === 'undefined') { el.textContent = 'ECharts não disponível.'; return }
    if (!_chartInstance) _chartInstance = echarts.init(el)

    const axisType = _logScale ? 'log' : 'value'
    _chartInstance.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: params => {
          const p = params[0]
          return `${p.name}<br/>${Number(p.value).toLocaleString('pt-BR', { maximumFractionDigits: 4 })} m³/ano`
        }
      },
      xAxis: {
        type: 'category',
        data: ['Q Explotável', 'Q Outorgada', 'Q Disponível', 'Q Usuário'],
        axisLabel: { fontSize: 11 }
      },
      yAxis: {
        type: axisType,
        name: 'm³/ano',
        nameTextStyle: { fontSize: 11 },
        min: _logScale ? 1 : undefined,
        axisLabel: { formatter: v => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) }
      },
      series: [{
        type: 'bar',
        data: [
          { value: qEx,   itemStyle: { color: '#0ea5e9' } },
          { value: qOut,  itemStyle: { color: '#f97316' } },
          { value: qDisp, itemStyle: { color: '#22c55e' } },
          { value: qUser, itemStyle: { color: '#a855f7' } }
        ],
        label: {
          show: true,
          position: 'top',
          formatter: p => Number(p.value).toLocaleString('pt-BR', { maximumFractionDigits: 0 }),
          fontSize: 10
        }
      }],
      grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true }
    }, true)
  }

  /* ── Mapa ───────────────────────────────────────────────────────────────── */

  function _drawShape(shape) {
    if (typeof map === 'undefined' || !map) return
    if (_mapLayer) { map.removeLayer(_mapLayer); _mapLayer = null }
    if (!shape) return
    try {
      _mapLayer = L.geoJSON(shape, {
        style: { color: '#f97316', weight: 2, fillColor: '#f97316', fillOpacity: 0.15 }
      }).addTo(map)
      map.fitBounds(_mapLayer.getBounds(), { padding: [20, 20] })
    } catch (e) {
      console.error('AvailabilityView: erro ao desenhar subsistema', e)
    }
  }

  /* ── Lista de pontos ────────────────────────────────────────────────────── */

  const _MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

  function _getMonthVol(point, mes) {
    // fetchRawByAddressId: dt_demanda is the array directly
    // findPointsInSystem:  dt_demanda.demandas is the array
    const demandas = Array.isArray(point?.dt_demanda)
      ? point.dt_demanda
      : (point?.dt_demanda?.demandas || [])
    const d = demandas.find(d => String(d.mes) === String(mes))
    return d != null ? parseFloat(d.vol_mensal_mm) || 0 : null
  }

  function _fmtCpfCnpj(v) {
    if (!v || v === '—') return v || '—'
    const d = String(v).replace(/\D/g, '')
    if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    return v
  }

  function _renderPointsList() {
    const el = _el('aaDispPointsList')
    if (!el || !_lastData) return

    const withPoint = _el('aaDispWithPoint').checked
    const rows = withPoint
      ? [_lastData.userPoint, ..._lastData.points]
      : _lastData.points

    if (!rows.length) { el.hidden = true; return }

    const fmtVol = v => v != null
      ? Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
      : '—'

    const header = `<tr>
      <th>Nome</th><th>CPF/CNPJ</th><th>Processo</th><th>Endereço</th>
      ${_MONTHS.map(m => `<th>${m}</th>`).join('')}
    </tr>`

    const body = rows.map(p => {
      const nome      = p.us_nome   || p.nome   || '—'
      const cpfRaw    = p.us_cpf_cnpj || p.cpf_cnpj || p.cpfCnpj || '—'
      const cpf       = _fmtCpfCnpj(cpfRaw)
      const proc      = p.int_processo || p.processo?.numero || '—'
      const end       = p.emp_endereco || p.endereco?.logradouro || '—'
      const searchKey = [nome, cpfRaw, end].join(' ').toLowerCase()
      const monthly   = _MONTHS.map((_, i) =>
        `<td class="num">${fmtVol(_getMonthVol(p, i + 1))}</td>`
      ).join('')
      return `<tr${p._isUser ? ' class="aa-disp-user-row"' : ''} data-search="${searchKey}">
        <td>${nome}</td><td>${cpf}</td><td>${proc}</td><td>${end}</td>${monthly}
      </tr>`
    }).join('')

    el.hidden = false
    el.innerHTML = `
      <div class="aa-disp-points-header">
        <p class="aa-disp-points-title">Pontos no subsistema</p>
        <input type="search" id="aaDispPointsSearch" class="aa-disp-points-search"
               placeholder="Buscar por nome, CPF, CNPJ ou endereço…" autocomplete="off">
      </div>
      <div class="aa-disp-points-table-wrap">
        <table class="aa-disp-table aa-disp-points-table">
          <thead>${header}</thead>
          <tbody id="aaDispPointsBody">${body}</tbody>
        </table>
      </div>
    `

    _el('aaDispPointsSearch')?.addEventListener('input', e => {
      const term = e.target.value.trim().toLowerCase()
      _el('aaDispPointsBody')?.querySelectorAll('tr[data-search]').forEach(tr => {
        tr.hidden = !!(term && !tr.dataset.search.includes(term))
      })
    })
  }

  /* ── Mapa ───────────────────────────────────────────────────────────────── */

  function _drawPoints(points, userPoint) {
    if (typeof map === 'undefined' || !map) return
    if (_pointsLayer) { map.removeLayer(_pointsLayer); _pointsLayer = null }

    const layers = []

    points.forEach(p => {
      const lat = p.int_latitude  ?? p.latitude
      const lng = p.int_longitude ?? p.longitude
      if (lat == null || lng == null) return
      const vol = parseFloat(p.dt_demanda?.vol_anual_ma) || 0
      const m = L.circleMarker([lat, lng], {
        radius: 5, color: '#f97316', fillColor: '#f97316', fillOpacity: 0.75, weight: 1.5
      })
      m.bindTooltip(`Outorga existente<br>Q: ${vol.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} m³/ano`)
      layers.push(m)
    })

    if (userPoint?.lat != null && userPoint?.lng != null) {
      const m = L.circleMarker([userPoint.lat, userPoint.lng], {
        radius: 7, color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.9, weight: 2
      })
      m.bindTooltip(`Ponto analisado<br>Q: ${(userPoint.vol || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} m³/ano`)
      layers.push(m)
    }

    if (!layers.length) return
    _pointsLayer = L.layerGroup(layers).addTo(map)
  }

  /* ── Utilitário ─────────────────────────────────────────────────────────── */

  function _el(id) { return document.getElementById(id) }

  return { mount, setContext, clearMapLayers }
})()
