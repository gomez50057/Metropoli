import { computeCounts } from "./googleSheets";

export const runtime = "nodejs";

let cachePayload = null;
let cacheTime = 0;
const TTL_MS = 3 * 60 * 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (cachePayload && (now - cacheTime) < TTL_MS) {
    return Response.json(cachePayload);
  }

  const payload = await computeCounts();
  cachePayload = payload;
  cacheTime = now;

  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=10800",
    },
  });
}
