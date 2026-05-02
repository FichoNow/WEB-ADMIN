const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export async function cleanupTestData(): Promise<number> {
  const res = await fetch(`${API_URL}/test/cleanup`, { method: 'POST' })
  if (!res.ok) {
    throw new Error(`Cleanup failed: ${res.status} ${res.statusText}`)
  }
  const json = (await res.json()) as { deleted: number }
  return json.deleted
}
