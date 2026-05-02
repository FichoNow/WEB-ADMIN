import { test, expect } from '@playwright/test'
import { makeTestCompany, type TestCompany } from './helpers/test-data'

async function registerAndLogin(page: import('@playwright/test').Page): Promise<TestCompany> {
  const data = makeTestCompany()

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

  await page.getByRole('button', { name: 'Ir a iniciar sesión' }).click()
  await page.getByLabel('Email corporativo').fill(data.user_email)
  await page.getByLabel('Contraseña').fill(data.user_password)
  await page.getByRole('button', { name: 'Entrar en el panel' }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 })

  return data
}

test.describe('Dashboard', () => {
  test('login lleva al panel y muestra el nombre de la empresa', async ({ page }) => {
    const data = await registerAndLogin(page)
    await expect(page.getByText(data.company_name).first()).toBeVisible({ timeout: 30000 })
  })

  test('crear departamento funciona', async ({ page }) => {
    await registerAndLogin(page)

    const createBtn = page.getByRole('button', { name: /Crear|Nuevo departamento|Añadir/ }).first()
    await createBtn.click()

    const deptName = `Depto Test ${Date.now()}`
    await page.getByLabel(/Nombre/).fill(deptName)
    await page.getByRole('button', { name: /Crear|Guardar|Confirmar/ }).first().click()

    await expect(page.getByText(deptName).first()).toBeVisible({ timeout: 30000 })
  })
})
