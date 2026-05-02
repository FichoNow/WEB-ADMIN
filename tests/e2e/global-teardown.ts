import { cleanupTestData } from './helpers/cleanup'

export default async function globalTeardown() {
  try {
    const deleted = await cleanupTestData()
    console.log(`\n[global-teardown] Borrados ${deleted} registros de test.`)
  } catch (err) {
    console.error('[global-teardown] Error en cleanup:', err)
  }
}
