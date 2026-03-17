# Sistema de Avaliação de Eventos — Documentação de Endpoints

## Visão Geral

O sistema de avaliação permite que participantes (internos e externos) avaliem eventos após sua ocorrência. As perguntas são globais e podem ser de dois tipos: **RATING** (escala 1-5) e **TEXT** (resposta dissertativa).

---

## 1. Listar Perguntas Ativas

Retorna todas as perguntas ativas do sistema para renderização do formulário.

**`GET /api/evaluations/questions`**

**Autenticação:** Não requerida

### Response `200 OK`

```json
{
  "questions": [
    {
      "id": "uuid",
      "text": "O evento trouxe muitos novos conhecimentos",
      "type": "RATING"
    },
    {
      "id": "uuid",
      "text": "Qual o ponto positivo da oficina?",
      "type": "TEXT"
    }
  ]
}
```

---

## 2. Criar Pergunta

Cria uma nova pergunta no sistema. Apenas administradores.

**`POST /api/evaluations/questions`**

**Autenticação:** Bearer Token (ADMIN)

### Request Body

```json
{
  "text": "O evento trouxe muitos novos conhecimentos",
  "type": "RATING"
}
```

| Campo  | Tipo     | Obrigatório | Descrição                                         |
|--------|----------|-------------|-----------------------------------------------------|
| `text` | `string` | Sim         | Texto da pergunta                                    |
| `type` | `string` | Sim         | Tipo da pergunta: `"RATING"` ou `"TEXT"`             |

### Response `201 Created`

```json
{
  "id": "uuid",
  "text": "O evento trouxe muitos novos conhecimentos",
  "type": "RATING",
  "isActive": true
}
```

### Erros

| Status | Mensagem                                     |
|--------|----------------------------------------------|
| 400    | O campo 'text' é obrigatório                 |
| 400    | O campo 'type' deve ser RATING ou TEXT        |
| 403    | Apenas administradores podem criar perguntas |

---

## 3. Criar Avaliação

Cria uma avaliação para um evento. O evento deve ter sido finalizado e o avaliador deve ter presença confirmada.

**`POST /api/evaluations/event/:eventId`**

**Autenticação:** Opcional
- **Usuário interno:** Enviar Bearer Token (o `userId` é extraído do token)
- **Convidado externo:** Sem token, informar `externalEmail` no body

### Request Body — Usuário Interno (com token)

```json
{
  "answers": [
    {
      "questionId": "uuid-da-pergunta-rating",
      "rating": 5
    },
    {
      "questionId": "uuid-da-pergunta-text",
      "textAnswer": "Excelente conteúdo, muito proveitoso."
    }
  ]
}
```

### Request Body — Convidado Externo (sem token)

```json
{
  "externalEmail": "convidado@email.com",
  "answers": [
    {
      "questionId": "uuid-da-pergunta-rating",
      "rating": 4
    },
    {
      "questionId": "uuid-da-pergunta-text",
      "textAnswer": "Gostei bastante da organização."
    }
  ]
}
```

### Schema de `answers`

| Campo        | Tipo      | Obrigatório | Descrição                                      |
|--------------|-----------|-------------|--------------------------------------------------|
| `questionId` | `string`  | Sim         | ID da pergunta (UUID)                            |
| `rating`     | `integer` | Condicional | Nota de 1 a 5 (obrigatório se type = RATING)    |
| `textAnswer` | `string`  | Condicional | Resposta dissertativa (obrigatório se type = TEXT)|

### Response `201 Created`

```json
{
  "id": "uuid-da-avaliacao",
  "eventId": "uuid-do-evento",
  "userId": "uuid-do-usuario",
  "externalEmail": null,
  "createdAt": "2025-06-15T14:30:00.000Z",
  "answers": [
    {
      "id": "uuid",
      "questionId": "uuid",
      "rating": 5,
      "textAnswer": null
    },
    {
      "id": "uuid",
      "questionId": "uuid",
      "rating": null,
      "textAnswer": "Excelente conteúdo, muito proveitoso."
    }
  ]
}
```

### Erros

| Status | Mensagem                                                           |
|--------|--------------------------------------------------------------------|
| 400    | O parâmetro 'eventId' é obrigatório                                |
| 400    | É necessário estar autenticado ou informar o externalEmail         |
| 400    | É necessário enviar ao menos uma resposta no campo 'answers'       |
| 403    | O evento ainda não foi finalizado                                  |
| 403    | Usuário não possui presença confirmada neste evento                |
| 403    | Convidado externo não possui presença confirmada neste evento      |
| 404    | Evento não encontrado                                              |
| 409    | Usuário já avaliou este evento                                     |
| 409    | Convidado externo já avaliou este evento                           |

---

## 4. Editar Avaliação

Permite ao avaliador editar suas respostas. Substitui todas as respostas anteriores.

**`PUT /api/evaluations/:evaluationId`**

**Autenticação:** Opcional (mesma lógica do criar)

### Request Body — Usuário Interno (com token)

```json
{
  "answers": [
    {
      "questionId": "uuid-da-pergunta-rating",
      "rating": 3
    },
    {
      "questionId": "uuid-da-pergunta-text",
      "textAnswer": "Atualizando minha resposta."
    }
  ]
}
```

### Request Body — Convidado Externo (sem token)

```json
{
  "externalEmail": "convidado@email.com",
  "answers": [
    {
      "questionId": "uuid-da-pergunta-rating",
      "rating": 2
    },
    {
      "questionId": "uuid-da-pergunta-text",
      "textAnswer": "Revisando minha avaliação."
    }
  ]
}
```

### Response `200 OK`

```json
{
  "id": "uuid-da-avaliacao",
  "eventId": "uuid-do-evento",
  "userId": "uuid-do-usuario",
  "externalEmail": null,
  "updatedAt": "2025-06-16T10:00:00.000Z",
  "answers": [
    {
      "id": "uuid",
      "questionId": "uuid",
      "rating": 3,
      "textAnswer": null
    },
    {
      "id": "uuid",
      "questionId": "uuid",
      "rating": null,
      "textAnswer": "Atualizando minha resposta."
    }
  ]
}
```

### Erros

| Status | Mensagem                                                       |
|--------|----------------------------------------------------------------|
| 400    | O parâmetro 'evaluationId' é obrigatório                       |
| 400    | É necessário estar autenticado ou informar o externalEmail     |
| 400    | É necessário enviar ao menos uma resposta no campo 'answers'   |
| 403    | Você não tem permissão para editar esta avaliação              |
| 404    | Avaliação não encontrada                                       |

---

## 5. Listar Avaliações por Evento (Admin)

Retorna todas as avaliações de um evento com dados do avaliador e respostas detalhadas.

**`GET /api/evaluations/event/:eventId`**

**Autenticação:** Bearer Token (ADMIN ou SECRETARY)

### Response `200 OK`

```json
{
  "evaluations": [
    {
      "id": "uuid-da-avaliacao",
      "eventId": "uuid-do-evento",
      "userName": "João da Silva",
      "userEmail": "joao@maua.br",
      "externalEmail": null,
      "createdAt": "2025-06-15T14:30:00.000Z",
      "updatedAt": "2025-06-15T14:30:00.000Z",
      "answers": [
        {
          "questionId": "uuid",
          "questionText": "O evento trouxe muitos novos conhecimentos",
          "questionType": "RATING",
          "rating": 5,
          "textAnswer": null
        },
        {
          "questionId": "uuid",
          "questionText": "Qual o ponto positivo da oficina?",
          "questionType": "TEXT",
          "rating": null,
          "textAnswer": "Excelente conteúdo."
        }
      ]
    },
    {
      "id": "uuid-da-avaliacao-2",
      "eventId": "uuid-do-evento",
      "userName": null,
      "userEmail": null,
      "externalEmail": "convidado@email.com",
      "createdAt": "2025-06-15T16:00:00.000Z",
      "updatedAt": "2025-06-15T16:00:00.000Z",
      "answers": [
        {
          "questionId": "uuid",
          "questionText": "O evento trouxe muitos novos conhecimentos",
          "questionType": "RATING",
          "rating": 4,
          "textAnswer": null
        }
      ]
    }
  ]
}
```

### Erros

| Status | Mensagem                                                                     |
|--------|------------------------------------------------------------------------------|
| 403    | Apenas administradores e secretários podem visualizar avaliações             |
| 404    | Evento não encontrado                                                        |

---

## Resumo de Rotas

| Método | Rota                               | Auth              | Descrição                          |
|--------|-------------------------------------|--------------------|-------------------------------------|
| GET    | `/api/evaluations/questions`       | Público            | Listar perguntas ativas            |
| POST   | `/api/evaluations/questions`       | ADMIN              | Criar pergunta                     |
| POST   | `/api/evaluations/event/:eventId`  | Opcional (JWT/Email)| Criar avaliação                   |
| PUT    | `/api/evaluations/:evaluationId`   | Opcional (JWT/Email)| Editar avaliação                  |
| GET    | `/api/evaluations/event/:eventId`  | ADMIN / SECRETARY  | Listar avaliações por evento       |

---

## Tipos de Pergunta (`type`)

| Valor    | Descrição                                | Campo de resposta  |
|----------|-------------------------------------------|--------------------|
| `RATING` | Escala numérica de 1 a 5                 | `rating` (integer) |
| `TEXT`   | Resposta dissertativa (texto livre)       | `textAnswer` (string)|

---

## Exemplos com cURL

### Listar perguntas

```bash
curl -X GET http://localhost:3000/api/evaluations/questions
```

### Criar pergunta (Admin)

```bash
curl -X POST http://localhost:3000/api/evaluations/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -d '{
    "text": "O evento trouxe muitos novos conhecimentos",
    "type": "RATING"
  }'
```

### Criar avaliação (Usuário Interno)

```bash
curl -X POST http://localhost:3000/api/evaluations/event/EVENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "answers": [
      { "questionId": "Q_ID_1", "rating": 5 },
      { "questionId": "Q_ID_2", "textAnswer": "Muito bom!" }
    ]
  }'
```

### Criar avaliação (Convidado Externo)

```bash
curl -X POST http://localhost:3000/api/evaluations/event/EVENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "externalEmail": "convidado@email.com",
    "answers": [
      { "questionId": "Q_ID_1", "rating": 4 },
      { "questionId": "Q_ID_2", "textAnswer": "Gostei muito." }
    ]
  }'
```

### Editar avaliação

```bash
curl -X PUT http://localhost:3000/api/evaluations/EVALUATION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "answers": [
      { "questionId": "Q_ID_1", "rating": 3 },
      { "questionId": "Q_ID_2", "textAnswer": "Resposta atualizada." }
    ]
  }'
```

### Listar avaliações de um evento (Admin)

```bash
curl -X GET http://localhost:3000/api/evaluations/event/EVENT_ID \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```
