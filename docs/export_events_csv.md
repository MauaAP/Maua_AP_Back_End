# Exportação CSV de eventos

Endpoint para baixar **todos** os registros da tabela `Event` (sem filtro), em CSV, para análise externa (Excel, Pandas, etc.).

## Endpoint

`GET /api/download-events`

## Autenticação e autorização

- Header: `Authorization: Bearer <JWT>`
- Papéis permitidos: `ADMIN`, `SECRETARY`, `MODERATOR`
- Resposta `403` se o papel não for permitido.

## Resposta

- **200:** corpo `text/csv; charset=utf-8`
- Header `Content-Disposition: attachment; filename=events.csv`
- **Sem eventos:** arquivo CSV apenas com linha de cabeçalho (comportamento do `json2csv` com array vazio).

## Formato das colunas

Uma linha por evento. Campos alinhados ao modelo Prisma `Event` (sem joins com presenças, avaliações ou questionário).

| Coluna | Descrição |
|--------|-----------|
| `id` | UUID do evento |
| `eventName` | Nome |
| `date` | Data do evento (ISO 8601 UTC) |
| `host` | Anfitrião/palestrante (texto) |
| `manager` | Array JSON (ex.: `["Nome 1","Nome 2"]`) |
| `hostEmail` | Array JSON |
| `hostPhone` | Array JSON |
| `local` | Local |
| `modality` | Modalidade (string persistida) |
| `targetAudience` | Público-alvo |
| `activityType` | Tipo de atividade |
| `maxParticipants` | Número ou vazio (null no banco) |
| `goals` | Objetivos |
| `period` | Período |
| `contentActivities` | Array JSON |
| `developedCompetencies` | Competências (string) |
| `initTime` | Início (ISO 8601 UTC) |
| `finishTime` | Fim (ISO 8601 UTC) |
| `link` | Link opcional ou vazio |

**Notas para análise:**

- Colunas de array devem ser interpretadas como JSON.
- Datas estão em ISO UTC; não há agregação nem métricas calculadas no servidor.

## Exemplo cURL

```bash
curl -s -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:3000/api/download-events" -o events.csv
```

## Verificação local (colunas do mapper)

```bash
npm run verify:event-csv
```

Valida que o mapper gera todas as chaves definidas em `EVENT_CSV_FIELD_NAMES` (sem acesso ao banco). Implementação: [`src/scripts/verify_event_csv_mapper.ts`](../src/scripts/verify_event_csv_mapper.ts).
