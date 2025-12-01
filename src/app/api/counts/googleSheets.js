import { google } from "googleapis";

const FORMS = [
  { key: "zapotlan", label: "Zapotlán de Juárez", env: "SPREADSHEET_ZAPOTLAN" },
  { key: "pachuca_la_espannita", label: 'Pachuca de Soto "La Españita"', env: "SPREADSHEET_PACHUCA_ESPANNITA" },
  { key: "mineral_de_la_reforma", label: "Mineral de la Reforma", env: "SPREADSHEET_MINERAL_REFORMA" },
  { key: "mineral_del_monte", label: "Mineral del Monte", env: "SPREADSHEET_MINERAL_MONTE" },
  { key: "epazoyucan", label: "Epazoyucan", env: "SPREADSHEET_EPAZOYUCAN" },
  { key: "zempoala", label: "Zempoala", env: "SPREADSHEET_ZEMPOALA" },

  // cuando tengas el ID:
  // { key: "san_agustin_tlaxiaca", label: "San Agustín Tlaxiaca", env: "SPREADSHEET_SAN_AGUSTIN_TLAXIACA" },
];

const PREFERRED_SHEET = "Respuestas del formulario 1";

const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_KEYFILE,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

async function findResponsesSheetTitle(sheetsApi, spreadsheetId) {
  const meta = await sheetsApi.spreadsheets.get({ spreadsheetId });
  const titles = meta.data.sheets.map((s) => s.properties.title);

  const target = norm(PREFERRED_SHEET);

  let title = titles.find((t) => norm(t) === target);
  if (title) return title;

  title = titles.find((t) => /respuestas|form responses/i.test(t));
  if (title) return title;

  return titles[0];
}

async function countRows(sheetsApi, spreadsheetId) {
  const title = await findResponsesSheetTitle(sheetsApi, spreadsheetId);
  const range = `'${title}'!A:A`;

  const res = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values?.length || 0;
  return { total: Math.max(0, rows - 1), sheetUsada: title };
}

export async function computeCounts() {
  const auth = getAuth();
  const sheetsApi = google.sheets({ version: "v4", auth });

  const counts = [];

  for (const f of FORMS) {
    const spreadsheetId = process.env[f.env];

    if (!spreadsheetId) {
      counts.push({
        key: f.key,
        label: f.label,
        total: null,
        error: `Falta variable de entorno: ${f.env}`,
      });
      continue;
    }

    try {
      const { total, sheetUsada } = await countRows(sheetsApi, spreadsheetId);
      counts.push({ key: f.key, label: f.label, total, sheetUsada });
    } catch (e) {
      counts.push({ key: f.key, label: f.label, total: null, error: String(e) });
    }
  }

  return { updatedAt: new Date().toISOString(), counts };
}
