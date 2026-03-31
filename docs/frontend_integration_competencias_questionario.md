# Integração front-end — Competências, questionário por evento e eventos (admin)

Documento de referência para o time de front-end implementar consumo das APIs de **competências desenvolvidas**, **questionário de avaliação por evento** e **CRUD/exportação de eventos** (rotas validadas em ambiente local).

Documentação complementar:

- [evaluation_endpoints.md](./evaluation_endpoints.md) — avaliações, perguntas e questionário
- [event_developed_competencies.md](./event_developed_competencies.md) — formato de `developedCompetencies`
- [export_events_csv.md](./export_events_csv.md) — exportação CSV de todos os eventos

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

4. **Eventos — atualização completa**  
   `PUT /api/update-event/:eventId` exige o **mesmo conjunto de campos obrigatórios** que o create (incluindo `developedCompetencies` ou `competencies`). A resposta é só mensagem de sucesso; para exibir dados atualizados, chame `GET /api/events/:eventId`. Papéis: `ADMIN`, `SECRETARY`, `MODERATOR`.

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

| Método | Caminho | Auth | Papel | Uso |
|--------|---------|------|-------|-----|
| `GET` | `/evaluations/questions` | Não | — | Catálogo global de perguntas **ativas** (multi-select do questionário). |
| `POST` | `/evaluations/questions` | Bearer | **ADMIN** | Criar nova pergunta. |
| `GET` | `/events` | Bearer | ADMIN, SECRETARY, MODERATOR | Lista todos os eventos (array com `eventId`, `eventName`, datas em **ms**, etc.). |
| `GET` | `/events/:eventId` | Não | — | Detalhe de um evento (mesmo formato de campos da lista). |
| `POST` | `/create-event` | Bearer | ADMIN, SECRETARY, MODERATOR | Cria evento; body completo; **201** + `{ "message": "..." }` (sem `eventId` na resposta — obter via `GET /events` ou fluxo da UI). |
| `PUT` | `/update-event/:eventId` | Bearer | ADMIN, SECRETARY, MODERATOR | Atualiza evento inteiro; **200** + `{ "message": "Evento atualizado com sucesso!" }`; opcionais: `numberMaxParticipants`, `link`. |
| `GET` | `/download-events` | Bearer | ADMIN, SECRETARY, MODERATOR | CSV com **todos** os eventos (análise externa). Ver [export_events_csv.md](./export_events_csv.md). |

---

## Eventos — contrato para o front (criar / atualizar)

**Datas e horários:** enviar como **número** (epoch em **milissegundos**), igual ao retorno de `GET /events` e `GET /events/:eventId`.

**`modality`:** string; o back faz `toUpperCase()` (ex.: `PRESENCIAL`).

**`developedCompetencies`:** aceita **string** ou **array de strings**; persistido como string normalizada (ex.: `"Comp Y, Comp Z"`).

**E-mails e telefones:** `hostEmail` e `hostPhone` são **arrays**; telefones devem passar na validação do domínio (ex. 11 dígitos para padrão BR usado no sistema).

**Após `PUT /update-event/...`:** faça `GET /api/events/:eventId` para sincronizar o estado da tela — o PUT não devolve o objeto do evento.

---

## Fluxo sugerido (UI)

1. **Tela pública / avaliação do participante:**  
   `GET /api/evaluations/event/:eventId/questions` — não usar só o catálogo global se o evento tiver questionário customizado.

2. **Tela admin — configurar questionário:**  
   - `GET /api/evaluations/questions` para listar opções.  
   - `PUT /api/evaluations/event/:eventId/questionnaire` com os UUIDs escolhidos e ordenados.

3. **Tela admin / edição de evento — competências:**  
   - Preferir `PUT /api/event/:eventId/competencies` se existir tela só de competências; ou enviar no `POST`/`PUT` do evento completo com array ou string.

4. **Tela admin / edição de evento — formulário completo:**  
   - Carregar com `GET /api/events/:eventId`.  
   - Salvar com `PUT /api/update-event/:eventId` enviando **todos** os campos obrigatórios.  
   - Opcional: botão “Exportar todos os eventos (CSV)” chamando `GET /api/download-events`.

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

# Listar eventos (admin)
curl -s "http://localhost:3000/api/events" \
  -H "Authorization: Bearer <TOKEN>"

# Detalhe de um evento
curl -s "http://localhost:3000/api/events/<EVENT_UUID>"

# Criar evento (corpo mínimo ilustrativo — ajuste datas em ms e validações)
curl -s -X POST "http://localhost:3000/api/create-event" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "eventName":"Meu evento",
    "date":1735689600000,
    "host":"Palestrante",
    "manager":["Organizador"],
    "hostEmail":["org@example.com"],
    "hostPhone":["11987654321"],
    "local":"Auditório",
    "modality":"PRESENCIAL",
    "targetAudience":"Docentes",
    "activityType":"workshop",
    "goals":"Objetivos do evento",
    "period":"2026",
    "contentActivities":["Atividade 1"],
    "developedCompetencies":"Comp A",
    "initTime":1735693200000,
    "finishTime":1735704000000
  }'

# Atualizar evento (mesmos campos obrigatórios + opcionais numberMaxParticipants, link)
curl -s -X PUT "http://localhost:3000/api/update-event/<EVENT_UUID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "eventName":"Meu evento (editado)",
    "date":1735689600000,
    "host":"Palestrante",
    "manager":["Organizador"],
    "hostEmail":["org@example.com"],
    "hostPhone":["11987654321"],
    "local":"Auditório B",
    "modality":"PRESENCIAL",
    "targetAudience":"Docentes",
    "activityType":"workshop",
    "goals":"Objetivos atualizados",
    "period":"2026",
    "contentActivities":["Atividade 1"],
    "developedCompetencies":["Comp A","Comp B"],
    "initTime":1735693200000,
    "finishTime":1735704000000,
    "link":"https://example.org/evento"
  }'

# Exportar todos os eventos em CSV
curl -s "http://localhost:3000/api/download-events" \
  -H "Authorization: Bearer <TOKEN>" \
  -o events.csv
```

---

*Última atualização: competências, questionário por evento, atualização de eventos (`PUT /update-event`) e export CSV documentados para integração front-end.*
