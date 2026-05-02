import { test, expect } from '@playwright/test'
import { makeTestCompany } from './helpers/test-data'

test.describe('Registro de empresa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Crea tu empresa' }).click()
    await expect(page.getByRole('heading', { name: 'Crea tu empresa' })).toBeVisible()
  })

  test('happy path: crea empresa con datos válidos', async ({ page }) => {
    const data = makeTestCompany()

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
  })

  test('valida: email mal formado', async ({ page }) => {
    await page.getByLabel('Email de la empresa').fill('no-es-email')
    await page.getByLabel('Email de la empresa').blur()
    await page.getByRole('button', { name: 'Finalizar y crear empresa' }).click()
    await expect(page.getByText('Email inválido').first()).toBeVisible()
  })

  test('valida: password menor de 8 caracteres', async ({ page }) => {
    const data = makeTestCompany()
    await page.getByLabel('Nombre de la empresa').fill(data.company_name)
    await page.getByLabel('CIF / NIF').fill(data.company_cif_nif)
    await page.getByLabel('Email de la empresa').fill(data.company_email)
    await page.getByLabel('Dirección').fill(data.company_address_line)
    await page.getByLabel('Ciudad').fill(data.company_city)
    await page.getByLabel('Código postal').fill(data.company_postal_code)
    await page.getByLabel('Nombre completo').fill(data.user_name)
    await page.getByLabel('Email', { exact: true }).fill(data.user_email)
    await page.getByLabel('Contraseña', { exact: true }).fill('1234567')
    await page.getByLabel('Confirmar contraseña').fill('1234567')

    await page.getByRole('button', { name: 'Finalizar y crear empresa' }).click()
    await expect(page.getByText('Mínimo 8 caracteres')).toBeVisible()
  })

  test('valida: passwords no coinciden', async ({ page }) => {
    const data = makeTestCompany()
    await page.getByLabel('Nombre de la empresa').fill(data.company_name)
    await page.getByLabel('CIF / NIF').fill(data.company_cif_nif)
    await page.getByLabel('Email de la empresa').fill(data.company_email)
    await page.getByLabel('Dirección').fill(data.company_address_line)
    await page.getByLabel('Ciudad').fill(data.company_city)
    await page.getByLabel('Código postal').fill(data.company_postal_code)
    await page.getByLabel('Nombre completo').fill(data.user_name)
    await page.getByLabel('Email', { exact: true }).fill(data.user_email)
    await page.getByLabel('Contraseña', { exact: true }).fill('Password123!')
    await page.getByLabel('Confirmar contraseña').fill('Password999!')

    await page.getByRole('button', { name: 'Finalizar y crear empresa' }).click()
    await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible()
  })

  test('valida: campos obligatorios vacíos', async ({ page }) => {
    await page.getByRole('button', { name: 'Finalizar y crear empresa' }).click()
    await expect(page.getByText('Obligatorio').first()).toBeVisible()
  })

  test('valida: email duplicado devuelve error', async ({ page }) => {
    const data = makeTestCompany()

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

    await page.goto('/')
    await page.getByRole('button', { name: 'Crea tu empresa' }).click()

    const data2 = makeTestCompany('-dup')
    await page.getByLabel('Nombre de la empresa').fill(data2.company_name)
    await page.getByLabel('CIF / NIF').fill(data2.company_cif_nif)
    await page.getByLabel('Email de la empresa').fill(data2.company_email)
    await page.getByLabel('Dirección').fill(data2.company_address_line)
    await page.getByLabel('Ciudad').fill(data2.company_city)
    await page.getByLabel('Código postal').fill(data2.company_postal_code)
    await page.getByLabel('Nombre completo').fill(data2.user_name)
    await page.getByLabel('Email', { exact: true }).fill(data.user_email)
    await page.getByLabel('Contraseña', { exact: true }).fill(data2.user_password)
    await page.getByLabel('Confirmar contraseña').fill(data2.user_password)
    await page.getByRole('button', { name: 'Finalizar y crear empresa' }).click()

    await expect(page.getByText(/Ya existe un usuario con ese email/)).toBeVisible({ timeout: 30000 })
  })
})
