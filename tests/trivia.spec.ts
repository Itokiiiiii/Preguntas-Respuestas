import { test, expect } from '@playwright/test';

test.describe('FLUJO COMPLETO DE TRIVIA', () => {

    test.beforeEach(async ({ page }) => {
        await page.route('**/api/questions', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    pregunta: "Pregunta de Test",
                    options: ["Correcta", "Incorrecta 1", "Incorrecta 2", "Incorrecta 3"],
                    correct_answer: "Correcta",
                    genero: "Test Rock",
                    explanation: "Explicación de prueba"
                }),
            });
        });

        await page.goto('http://localhost:3000/Trivia');
        await page.evaluate(() => {
            localStorage.setItem('user_name', 'testuser');
        });
        await page.reload();
    });

    test('debe sumar puntos al responder correctamente', async ({ page }) => {
        await expect(page.locator('h2')).toContainText('Pregunta de Test');

        await page.getByRole('button', { name: 'Correcta', exact: true }).click();

        const contadorCorrectas = page.locator('span.text-green-400');
        await expect(contadorCorrectas).toHaveText('1', { timeout: 10000 });

        await expect(page.locator('text=Explicación de prueba')).toBeVisible();
    });

    test('flujo hasta terminar la trivia y guardar score', async ({ page }) => {
        await page.route('**/api/users/score', async route => {
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        });

        for (let i = 1; i <= 10; i++) {

            await expect(page.locator('text=Sintonizando Gemini')).not.toBeVisible();

            await page.getByRole('button', { name: 'Correcta', exact: true }).click();

            if (i < 10) {
    
                const btnSiguiente = page.getByRole('button', { name: 'Siguiente Pregunta' });
                await expect(btnSiguiente).toBeVisible();
                await btnSiguiente.click();
            }
        }

        const btnFinalizar = page.getByRole('button', { name: 'Finalizar Trivia' });
        await expect(btnFinalizar).toBeVisible();
        await btnFinalizar.click();

        await expect(page).toHaveURL(/.*Salon/);
    });
});