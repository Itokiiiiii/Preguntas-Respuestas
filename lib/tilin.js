export async function generarPregunta() {
  try {
    // --- INTENTO 1: Generar con la IA ---
    const response = await fetch('/api/questions', {
      method: 'POST',
    });

    if (!response.ok) {
      // Si el servidor responde 429 (límite de cuota) o 500, saltamos al catch
      throw new Error(`IA no disponible: ${response.status}`);
    }

    const data = await response.json();
    
    // Si la data viene vacía o con error interno de la API
    if (data.error || !data.pregunta) {
        throw new Error("Contenido de IA inválido");
    }

    return data;

  } catch (error) {
    console.warn("Falló la generación por IA, buscando en la Base de Datos...", error);

    try {
      const fallbackResponse = await fetch('/api/admin/questions/random');

      if (!fallbackResponse.ok) {
        throw new Error("No hay preguntas disponibles en la base de datos");
      }

      const localData = await fallbackResponse.json();
      
      return { ...localData, isFallback: true };

    } catch (fallbackError) {
      console.error("Error crítico: Ni la IA ni la DB tienen preguntas.", fallbackError);
      return { error: true };
    }
  }
}