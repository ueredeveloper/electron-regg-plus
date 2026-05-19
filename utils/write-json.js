/**
 * @file write-json.js
 * @description Utilitários para gravar objetos JavaScript como arquivo JSON.
 * Usado principalmente para inspecionar respostas brutas da API em desenvolvimento.
 */

const fs   = require('fs')
const path = require('path')
const { app } = require('electron')

function writeJson(filePath, data) {
  if (app.isPackaged) return
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

function appendJson(filePath, data) {
  if (app.isPackaged) return
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  let arr = []
  if (fs.existsSync(filePath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      arr = Array.isArray(parsed) ? parsed : [parsed]
    } catch { arr = [] }
  }
  arr.push(data)
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), 'utf-8')
}

module.exports = { writeJson, appendJson }
