export async function generarPregunta() {
  try {
    const response = await fetch('/api/questions', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Respuesta de servidor no exitosa: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(" Error en tilin.js:", error);
    return { error: true }; 
  }
}