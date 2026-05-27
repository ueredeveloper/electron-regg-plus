/**
 * @file input-clear.js
 * @description Utilitário que adiciona um botão de limpar (×) em todos os inputs
 * de texto e número que ainda não possuem esse controle. Usa o mesmo padrão
 * visual dos selects: wrapper .search-input-wrap + botão .search-clear.
 */

const InputClear = (() => {
  /** @type {WeakSet<HTMLInputElement>} Impede reprocessamento do mesmo input. */
  const _processed = new WeakSet()

  /**
   * @description Retorna true para inputs que não devem receber o botão de limpar.
   * @param {HTMLInputElement} input
   * @returns {boolean}
   */
  function _shouldSkip(input) {
    if (_processed.has(input))                    return true
    if (input.type === 'hidden')                  return true
    if (input.readOnly || input.disabled)         return true
    if (input.closest('.search-input-wrap'))      return true
    if (input.classList.contains('id-fin-input')) return true
    if (input.closest('.id-dem-cell'))            return true
    if (input.closest('.id-fin-cell'))            return true
    return false
  }

  /**
   * @description Envolve um input em .search-input-wrap e adiciona o botão ×.
   * @param {HTMLInputElement} input
   */
  function _wrap(input) {
    if (_shouldSkip(input)) return
    _processed.add(input)

    const wrap = document.createElement('div')
    wrap.className = 'search-input-wrap'
    input.parentNode.insertBefore(wrap, input)
    wrap.appendChild(input)

    const btn = document.createElement('button')
    btn.type      = 'button'
    btn.className = 'search-clear'
    btn.title     = 'Limpar'
    btn.textContent = '×'
    btn.hidden    = !input.value
    wrap.appendChild(btn)

    const _refresh = () => { btn.hidden = !input.value }
    input.addEventListener('input', _refresh)
    input.addEventListener('focus', _refresh)

    btn.addEventListener('click', () => {
      input.value = ''
      btn.hidden  = true
      input.dispatchEvent(new Event('input',  { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
      input.focus()
    })
  }

  /**
   * @description Processa todos os inputs text/number dentro de um nó raiz.
   * @param {Document|HTMLElement} root
   */
  function _processAll(root = document) {
    root.querySelectorAll('input[type="text"], input[type="number"]').forEach(_wrap)
  }

  /**
   * @description Observa mudanças de classe nos .side-drawer para atualizar
   * a visibilidade dos botões quando o drawer é aberto com valores pré-preenchidos.
   */
  function _observeDrawers() {
    document.querySelectorAll('.side-drawer').forEach(drawer => {
      new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName !== 'class') continue
          if (!drawer.classList.contains('open')) continue

          drawer.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
            if (!_processed.has(input)) {
              _wrap(input)
              return
            }
            const btn = input.parentElement?.querySelector('.search-clear')
            if (btn) btn.hidden = !input.value
          })
        }
      }).observe(drawer, { attributes: true, attributeFilter: ['class'] })
    })
  }

  /**
   * @description Inicializa o utilitário: processa os inputs existentes,
   * observa drawers e monitora inputs adicionados dinamicamente.
   */
  function init() {
    _processAll()
    _observeDrawers()

    new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue
          if (node.matches?.('input[type="text"], input[type="number"]')) _wrap(node)
          node.querySelectorAll?.('input[type="text"], input[type="number"]').forEach(_wrap)
        }
      }
    }).observe(document.body, { childList: true, subtree: true })
  }

  return { init }
})()
