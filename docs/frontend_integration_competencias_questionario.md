# Integração front-end — Competências e questionário por evento

Documento de referência para o time de front-end implementar consumo das APIs de **competências desenvolvidas** e **questionário de avaliação por evento**.

Documentação complementar:

- [evaluation_endpoints.md](./evaluation_endpoints.md) — avaliações, perguntas e questionário
- [event_developed_competencies.md](./event_developed_competencies.md) — formato de `developedCompetencies`

---

## Resumo do que foi feito (back-end)

1. **Competências desenvolvidas no evento**  
   O campo continua sendo uma **string** no banco (`developedCompetencies`), mas a API **aceita string ou array** e normaliza para CSV com separador `", "` (vírgula + espaço).  
   Útil para formulários multi-select ou textarea.

2. **Questionário de avaliação por evento**  
   - Existe vínculo evento ↔ perguntas (`EventQuestionnaire`).  
   - **Sem vínculos** para um evento: comportamento legado — **todas** as perguntas **ativas** (equivalente ao catálogo global).  
   - **Com vínculos**: apenas as perguntas escolhidas, na **ordem** enviada em `questionIds` no `PUT`.  
   - **`questionIds` vazio** no `PUT`: remove vínculos e restaura o fallback (todas as ativas).  
   - **Criar/atualizar avaliação** e a **listagem admin por evento** respeitam o conjunto permitido para aquele evento.

3. **Ambiente de testes**  
   Em períodos de QA, `POST /api/create-user` pode ficar temporariamente **sem** `authenticateToken`; em **produção** deve exigir autenticação e papel adequado.

---

## Endpoints — referência rápida

**Base:** `https://<host>/api/...`

### Novos

| Método | Caminho | Auth | Papel | Uso |
|--------|---------|------|-------|-----|
| `GET` | `/evaluations/event/:eventId/questions` | Não | — | Perguntas aplicáveis **àquele evento** (fallback ou configuradas). Resposta: `{ "questions": [{ "id", "text", "type" }] }`. |
| `PUT` | `/evaluations/event/:eventId/questionnaire` | Bearer | **ADMIN** | Define o questionário. Body: `{ "questionIds": ["uuid", ...] }`. A ordem do array é a ordem de exibição. |
| `PUT` | `/event/:eventId/competencies` | Bearer | Ver regra no back | Atualiza só competências. Body: `developedCompetencies` ou `competencies` (string **ou** array). |

### Alterados / comportamento a alinhar no front

| Método | Caminho | O que mudou |
|--------|---------|-------------|
| `POST` / `PUT` | Rotas de **criar/atualizar evento** (completas) | Aceitar `developedCompetencies` **ou** `competencies` como **string ou array**; a resposta deve refletir o valor **normalizado** (string CSV). |
| `POST` | `/evaluations/event/:eventId` | Cada `questionId` em `answers` deve pertencer ao **questionário permitido** daquele evento (vinculadas ou, se não houver vínculo, qualquer pergunta ativa). |
| `PUT` | Atualizar avaliação | Mesma regra de `questionId` permitido. |
| `GET` | Listagem de avaliações por evento (admin) | Considera o questionário do evento ao montar/filtrar (detalhes em [evaluation_endpoints.md](./evaluation_endpoints.md)). |

### Já existentes (úteis para telas admin)

| Método | Caminho | Auth | Uso |
|--------|---------|------|-----|
| `GET` | `/evaluations/questions` | Não | Catálogo global de perguntas **ativas** (para montar o multi-select do questionário). |
| `POST` | `/evaluations/questions` | Bearer **ADMIN** | Criar nova pergunta. |

---

## Fluxo sugerido (UI)

1. **Tela pública / avaliação do participante:**  
   `GET /api/evaluations/event/:eventId/questions` — não usar só o catálogo global se o evento tiver questionário customizado.

2. **Tela admin — configurar questionário:**  
   - `GET /api/evaluations/questions` para listar opções.  
   - `PUT /api/evaluations/event/:eventId/questionnaire` com os UUIDs escolhidos e ordenados.

3. **Tela admin / edição de evento — competências:**  
   - Preferir `PUT /api/event/:eventId/competencies` se existir tela só de competências; ou enviar no `POST`/`PUT` do evento completo com array ou string.

---

## Usuário ADMIN (criado em teste local)

> Credenciais geradas em ambiente de desenvolvimento; **JWT expira** — renovar com `POST /api/auth-user`.

| Campo | Valor |
|--------|--------|
| E-mail | `admin_q_1774979186@example.com` |
| Senha | `senha1234` |
| Nome | `Admin QA` |
| Papel | `ADMIN` |

**Renovar token:**

```http
POST /api/auth-user
Content-Type: application/json

{ "email": "admin_q_1774979186@example.com", "password": "senha1234" }
```

Usar o `token` retornado em: `Authorization: Bearer <token>`.

---

## Exemplos cURL

```bash
# Perguntas do evento (público)
curl -s "http://localhost:3000/api/evaluations/event/<EVENT_UUID>/questions"

# Configurar questionário (admin)
curl -s -X PUT "http://localhost:3000/api/evaluations/event/<EVENT_UUID>/questionnaire" \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{"questionIds":["<UUID1>","<UUID2>"]}'

# Competências do evento
curl -s -X PUT "http://localhost:3000/api/event/<EVENT_UUID>/competencies" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"developedCompetencies":["Comp A","Comp B"]}'
```

---

*Última atualização: alinhado à implementação de competências + questionário por evento no Maua AP Back End.*
