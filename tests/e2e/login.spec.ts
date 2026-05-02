import { test, expect } from '@playwright/test'
import { makeTestCompany, type TestCompany } from './helpers/test-data'

async function registerCompany(page: import('@playwright/test').Page, data: TestCompany) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Crea tu empresa' }).click()
  await page.getByLabel('Nombre de la empresa').fill(data.company_name)
  await page.getByLabel('CIF / NIF').fill(data.company_cif_nif)
  await page.getByLabel('Email de la empresa').fill(data.company_email)
  await page.getByLabel('Dirección').fill(data.company_address_line)
  await page.getByLabel('Ciudad').fill(data.company_city)
  await page.getByLabel('Código postal').fill(data.company_postal_code)
  await page.getByLabel('Nombre completo').fill(data.user_name)
  await page.getByLabel('Email', { exact: true }).fill(data.user_email)
  await page.getByLabel('Contraseña', { exact: true }).fill(data.user_password)
  await page.getByLabel('Confirmar contraseña').fill(data.user_password)
  await page.getByRole('button', { name: 'Finalizar y crear empresa' }).click()
  await expect(page.getByRole('heading', { name: '¡Empresa creada con éxito!' })).toBeVisible({ timeout: 30000 })
}

async function openLogin(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Gestionar empresa' }).click()
  await expect(page.getByRole('heading', { name: '¡Bienvenido!' })).toBeVisible()
}

test.describe('Login', () => {
  test('happy path: login con credenciales válidas redirige al dashboard', async ({ page }) => {
    const data = makeTestCompany()
    await registerCompany(page, data)

    await openLogin(page)
    await page.getByLabel('Email corporativo').fill(data.user_email)
    await page.getByLabel('Contraseña').fill(data.user_password)
    await page.getByRole('button', { name: 'Entrar en el panel' }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 })
  })

  test('error: contraseña incorrecta', async ({ page }) => {
    const data = makeTestCompany()
    await registerCompany(page, data)

    await openLogin(page)
    await page.getByLabel('Email corporativo').fill(data.user_email)
    await page.getByLabel('Contraseña').fill('PasswordIncorrecta1!')
    await page.getByRole('button', { name: 'Entrar en el panel' }).click()

    await expect(page.getByText(/Credenciales incorrectas/)).toBeVisible({ timeout: 30000 })
  })

  test('error: usuario no existe', async ({ page }) => {
    await openLogin(page)
    await page.getByLabel('Email corporativo').fill('test-e2e-no-existe@e2e.com')
    await page.getByLabel('Contraseña').fill('Password123!')
    await page.getByRole('button', { name: 'Entrar en el panel' }).click()

    await expect(page.getByText(/Credenciales incorrectas/)).toBeVisible({ timeout: 30000 })
  })

  test('valida: email mal formado', async ({ page }) => {
    await openLogin(page)
    await page.getByLabel('Email corporativo').fill('no-es-email')
    await page.getByLabel('Contraseña').fill('Password123!')
    await page.getByRole('button', { name: 'Entrar en el panel' }).click()

    await expect(page.getByText('Email inválido')).toBeVisible()
  })

  test('valida: campos vacíos', async ({ page }) => {
    await openLogin(page)
    await page.getByRole('button', { name: 'Entrar en el panel' }).click()
    await expect(page.getByText('Obligatorio').first()).toBeVisible()
  })
})
