export const TEST_EMAIL_PREFIX = 'test-e2e-'

let counter = 0

export interface TestCompany {
  company_name: string
  company_cif_nif: string
  company_email: string
  company_address_line: string
  company_city: string
  company_postal_code: string
  user_name: string
  user_email: string
  user_password: string
}

function randomDigits(length: number): string {
  let out = ''
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}

export function makeTestCompany(suffix?: string): TestCompany {
  counter += 1
  const tag = `${Date.now()}-${counter}-${Math.random().toString(36).slice(2, 8)}${suffix ?? ''}`
  return {
    company_name: `Test Co ${tag}`,
    company_cif_nif: `B${randomDigits(8)}`,
    company_email: `${TEST_EMAIL_PREFIX}${tag}@e2e.com`,
    company_address_line: 'Calle Falsa 123',
    company_city: 'Barcelona',
    company_postal_code: '08001',
    user_name: 'Test Admin',
    user_email: `${TEST_EMAIL_PREFIX}admin-${tag}@e2e.com`,
    user_password: 'Password123!',
  }
}
