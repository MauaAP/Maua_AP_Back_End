import { Client } from 'pg';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(join(__dirname, 'certs', 'ca.pem')).toString(),
  },
});

const query = `
SELECT
  p.id AS presence_id,
  p.date AS presence_date,
  u.id AS user_id,
  u.name AS user_name,
  u.email AS user_email,
  u.telefone AS user_telefone,
  u.cpf AS user_cpf,
  u.status AS user_status,
  e.id AS event_id,
  e."eventName",
  e.date AS event_date,
  e.local,
  e.modality
FROM
  "Presence" p
JOIN
  "User" u ON p."userId" = u.id
JOIN
  "Event" e ON p."eventId" = e.id
WHERE
  e.date >= '2025-04-09 00:00:00'
  AND e.date <  '2025-04-10 00:00:00';
`;

async function main() {
  try {
    await client.connect();
    const res = await client.query(query);

    const csvWriter = createObjectCsvWriter({
      path: join(__dirname, 'presences.csv'),
      header: [
        { id: 'presence_id', title: 'presence_id' },
        { id: 'presence_date', title: 'presence_date' },
        { id: 'user_id', title: 'user_id' },
        { id: 'user_name', title: 'user_name' },
        { id: 'user_email', title: 'user_email' },
        { id: 'user_telefone', title: 'user_telefone' },
        { id: 'user_cpf', title: 'user_cpf' },
        { id: 'user_status', title: 'user_status' },
        { id: 'event_id', title: 'event_id' },
        { id: 'eventName', title: 'nome-do-evento' },
        { id: 'event_date', title: 'event_date' },
        { id: 'local', title: 'local' },
        { id: 'modality', title: 'modality' },
      ],
    });

    await csvWriter.writeRecords(res.rows);
    console.log('✅ CSV salvo com sucesso como presences.csv');
  } catch (err) {
    console.error('❌ Erro ao executar:', err);
  } finally {
    await client.end();
  }
}

main();
