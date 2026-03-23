import { test, expect } from '@playwright/test';

test.describe('ÑRUEBAS DE LA TRIVIA', () => {
  test('se crea una nueva cuenta', async ({ page }) => {
    await page.goto('http://localhost:3000/Login');

    const usuario = 'testuser';
    const password = 'testpassword';

    await page.fill('input[name="username"]', usuario);
    await page.fill('input[name="password"]', password);

    await page.click('text=CREAR MI CUENTA');

    await expect(page.locator('text=Cuenta creada')).toBeVisible();
  })

  test('inicia sesión con una cuenta existente', async ({ page }) => {
    await page.goto('http://localhost:3000/Login');
    
    const usuario = 'testuser';
    const password = 'testpassword';
    await page.fill('input[name="username"]', usuario);
    await page.fill('input[name="password"]', password);
    
    await page.click('text=ENTRAR AL ESTUDIO');
    await expect(page).toHaveURL('http://localhost:3000/Salon');
  })

  test('muestra error al intentar crear cuenta sin completar campos', async ({ page }) => {
    await page.goto('http://localhost:3000/Login');
    
    await page.click('text=CREAR MI CUENTA');
    await expect(page.locator('text=Completa los campos.')).toBeVisible();
  })
  
  test('muestra error al intentar iniciar sesión sin completar campos', async ({ page }) => {
    await page.goto('http://localhost:3000/Login');
    await page.click('text=ENTRAR AL ESTUDIO');

    // AGREGAR SI ES EL ERROR CORRECTO
    await expect(page.locator('text=Completa los campos.')).toBeVisible();
  })

  test('Error al iniciar sesión con credenciales incorrectas', async ({ page }) => {
    await page.goto('http://localhost:3000/Login');
    
    const usuario = 'usuario_incorrecto';
    const password = 'contraseña_incorrecta';
    await page.fill('input[name="username"]', usuario);
    await page.fill('input[name="password"]', password);
    
    await page.click('text=ENTRAR AL ESTUDIO');

    // AGREGAR SI ES EL ERROR CORRECTO
    await expect(page.locator('text=Credenciales incorrectas')).toBeVisible();
  
  })
});