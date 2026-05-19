# Requisitos — electron-regg+

Sistema desktop (Electron) para cadastro de documentos de outorga de recursos hídricos.

---

## 1. Layout geral da tela principal

A tela é dividida em dois painéis lado a lado:

| Painel esquerdo | Painel direito |
|---|---|
| Mapa (Leaflet / OpenStreetMap) | Formulário de cadastro |

O painel direito é rolável. O mapa ocupa 100% da altura disponível.

---

## 2. Formulário de cadastro (painel direito)

Os campos aparecem nesta ordem, de cima para baixo.

---

### 2.1 Documento

Tabelas: `documento`, `documento_tipo`

| Campo | Tipo de controle | Obrigatório | Observação |
|---|---|---|---|
| Tipo de Documento | `<select>` | Sim | Opções carregadas de `documento_tipo` |
| Número | `<input text>` | Sim | Campo livre |
| Número SEI | `<input text>` | Não | Campo livre |

**Schema `documento_tipo`:**
```
id  |  nome
----|----------
1   | Parecer
2   | Despacho
3   | Requerimento
4   | Ofício
```

**Schema `documento`:**
```
id | numero | numero_sei | endereco (FK) | processo (FK) | tipo_documento (FK)
```

---

### 2.2 Endereço + Interferência (mesma linha / bloco)

Tabelas: `endereco`, `interferencia`

#### Endereço — caixa de seleção pesquisável (autocomplete)

- O usuário digita parte do **logradouro** (mínimo 2 caracteres).
- O sistema consulta a tabela `endereco` e exibe resultados em uma lista dropdown.
- Ao selecionar um resultado, os dados do endereço ficam associados ao cadastro.
- O texto exibido no campo deve mostrar: `logradouro — cidade/UF`.

**Schema `endereco`:**
```
id | logradouro | bairro | cidade | cep | estado (FK)
```

**Exemplo de resultado:**
```
Rodeador, Gleba 01, Lotes 076/077 - PICAG — Brazlândia/DF
```

#### Interferência — Latitude e Longitude

- Ao lado do campo de endereço, botão ícone **map-pin-plus** abre o drawer `InterferenceView`.
- Dois `<input number>`: **Latitude** e **Longitude**.
- Esses campos são preenchidos automaticamente ao clicar no mapa (Leaflet) ou ao selecionar no drawer.
- Também podem ser editados manualmente; ao confirmar, o marcador no mapa é reposicionado.
- O marcador no mapa é arrastável e ao arrastar atualiza os campos.

**Schema `interferencia`:**
```
id | latitude | longitude | logradouro | tipo_interferencia (FK) | tipo_outorga (FK)
   | subtipo_outorga (FK) | situacao (FK) | tipo_ato (FK)
   | bacia_hidrografica (FK) | unidade_hidrografica (FK) | endereco (FK)
```

---

### 2.3 Usuário

Tabela: `usuario`

- Caixa de seleção pesquisável (autocomplete).
- Botão ícone **user-plus** abre o drawer `UserView`.
- O usuário digita parte do **nome** ou do **CPF/CNPJ**.
- O sistema consulta `usuario` e exibe resultados em dropdown.
- Texto exibido no resultado: `nome — CPF/CNPJ`.

**Schema `usuario`:**
```
id | nome | cpf_cnpj
```

**Exemplo de resultado:**
```
Jayro Francisco Machado Lessa — 099.289.601-00
```

---

### 2.4 Processo

Tabela: `processo`

- Caixa de seleção pesquisável (autocomplete).
- O usuário digita parte do **número do processo**.
- Texto exibido: número do processo.

**Schema `processo`:**
```
id | numero | anexo (FK) | usuario (FK)
```

**Exemplo:**
```
0197-000477/2015
```

---

### 2.5 Anexo (Processo Principal)

Tabela: `anexo`

- Caixa de seleção pesquisável (autocomplete).
- O usuário digita parte do **número do anexo**.
- Texto exibido: número do anexo.

**Schema `anexo`:**
```
id | numero
```

**Exemplo:**
```
00197-00002342/2025-61
```

---

### 2.6 Botões de ação

Localizados abaixo dos campos do formulário.

| Botão | Ação |
|---|---|
| **Salvar** | Valida os campos obrigatórios e persiste o documento no banco |
| **Editar** | Ativa edição do documento selecionado na lista (carrega dados no formulário) |
| **Deletar** | Remove o documento selecionado (com confirmação antes de executar) |

Regras:
- **Salvar** está sempre disponível (cria novo registro).
- **Editar** e **Deletar** ficam habilitados somente quando há um documento selecionado na lista de resultados.
- Ao salvar com sucesso, o formulário é limpo e a lista é atualizada.

---

## 3. Área de pesquisa de documentos

Localizada abaixo dos botões de ação.

### 3.1 Campo de pesquisa

- `<input text>` com placeholder "Pesquisar documento..."
- Botão **Pesquisar** ao lado do campo.
- A pesquisa filtra por: número do documento, número SEI ou nome do usuário vinculado.
- Também pode ser acionada pressionando `Enter` no campo.

### 3.2 Lista de resultados

- Exibida abaixo do campo de pesquisa.
- Cada linha da lista mostra:
  - Tipo do documento
  - Número
  - Número SEI
  - Endereço (logradouro resumido)
  - Processo vinculado
- Ao clicar em uma linha, os dados são carregados no formulário acima (modo edição).
- A linha selecionada fica destacada visualmente.

---

## 4. Relacionamentos entre tabelas

```
documento
  ├── tipo_documento → documento_tipo.id
  ├── endereco       → endereco.id
  └── processo       → processo.id
                          ├── anexo   → anexo.id
                          └── usuario → usuario.id

interferencia
  └── endereco → endereco.id
```

---

## 5. Comportamento do mapa

- Mapa Leaflet centralizado no Distrito Federal (lat: -15.78, lon: -47.93) por padrão.
- Clicar no mapa posiciona um marcador e preenche Latitude/Longitude no formulário.
- O marcador é arrastável; ao soltar, os campos são atualizados.
- Ao digitar lat/lon manualmente e clicar em "Ir ao mapa", o mapa centraliza e o marcador é reposicionado.
- Ao limpar o formulário, o marcador é removido.

---

## 6. Drawers laterais

Painéis deslizantes que sobrepõem o formulário principal (da direita para a esquerda). Apenas um drawer pode estar aberto por vez.

### 6.1 AddressView — Cadastro de Endereço

Aberto pelo botão **house-plus** no campo `SelectAddress`.

| Seção | Campos |
|---|---|
| Formulário | Logradouro (obrigatório), Bairro, Cidade (obrigatório), CEP, UF |
| Lista | Pesquisa por logradouro ou cidade → tabela com Logradouro, Bairro, Cidade, UF |

- Ao clicar numa linha da lista: preenche `SelectAddress` e fecha o drawer.
- Ao salvar: dispara `address-view:saved`.

### 6.2 InterferenceView — Cadastro de Interferência

Aberto pelo botão **map-pin-plus** no campo `SelectInterference`.

| Seção | Campos |
|---|---|
| Formulário | Logradouro (obrigatório), Latitude (obrigatório), Longitude (obrigatório), Tipo de Interferência*, Tipo de Outorga*, Subtipo de Outorga, Situação*, Tipo de Ato, Bacia Hidrográfica, Unidade Hidrográfica |
| Lista | Pesquisa por logradouro ou coordenadas → tabela com Logradouro, Latitude, Longitude, Tipo |

Os selects marcados com `*` são carregados via API. Ao clicar numa linha da lista: preenche `SelectInterference` (lat/lon) e fecha o drawer.

### 6.3 UserView — Cadastro de Usuário

Aberto pelo botão **user-plus** no campo `SelectUser`.

| Seção | Campos |
|---|---|
| Formulário | Nome (obrigatório), CPF/CNPJ (obrigatório, com máscara automática) |
| Lista | Pesquisa por nome ou CPF/CNPJ → tabela com Nome, CPF/CNPJ |

- Ao clicar numa linha da lista: preenche `SelectUser` e fecha o drawer.

---

## 7. Banco de dados

- Banco local: **SQLite** (arquivo `.db` na pasta do app).
- Acesso via `better-sqlite3` (Node.js, síncrono).
- As queries de autocomplete usam `LIKE '%termo%'` com limite de 10 resultados.

---

## 7. Fora do escopo desta fase

- Autenticação/login de usuários.
- Geração de documentos PDF/HTML a partir dos templates.
- Sincronização com servidor remoto.
- Cadastro de processos e anexos pela tela principal (apenas seleção).
