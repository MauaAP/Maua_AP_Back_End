# Competências desenvolvidas (`developedCompetencies`)

## Armazenamento

- No banco, o campo é uma **única string** (`Event.developedCompetencies`).
- No certificado (verso), o texto é dividido com **vírgula**: `split(",")` e cada item vira um `<li>`.
- Recomenda-se gravar como **lista separada por vírgula**, opcionalmente com espaço após a vírgula (ex.: `Comp A, Comp B`).

## API — formatos aceitos

Os endpoints abaixo aceitam:

1. **String** — enviada em `developedCompetencies` ou, como alternativa, em `competencies`.
2. **Array de strings** — normalizado para uma string CSV com `", "` entre os itens (trim em cada elemento; vazios são descartados).

### `PUT /api/event/:eventId/competencies`

- Body: `{ "developedCompetencies": "A, B" }` ou `{ "developedCompetencies": ["A", "B"] }` ou `{ "competencies": ["A", "B"] }`.
- Resposta `200`: inclui `developedCompetencies` com o valor **persistido** após a normalização.

### `PUT` atualização completa do evento

- Mesma normalização para `developedCompetencies` / `competencies` no body.

### `POST` criação de evento

- Mesma normalização.
