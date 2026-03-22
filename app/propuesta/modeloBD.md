# Modelo de la base de datos con mongodb


### 1. Usuarios: `usuario`
* `id`: ObjectId 
* `nombre`: String (nombre xd)
* `pssw`: String (la contraseña)
* `score`: 

### 2. Preguntas: `preguntas`
* `id`: ObjectId.
* `genero`: String, será el genero musical al cual corresponderá la pregunta
* `pregunta`: String, será la pregunta en cuestión: "¿Cuál es el mejor álbum de Jazz para empezar?"
* `usuarioId`: ObjectId, será la referencia al usuario en la colección `usuario`

### 3. Respuestas: `respuestas`
* `id`: ObjectId.
* `respuesta`: String, será la respuesta en cuestión
* `preguntaId`: ObjectId, será la referencia a la pregunta en la colección `preguntas`
* `usuarioId`: ObjectId, será laa referencia al usuario en la colección `usuario`

