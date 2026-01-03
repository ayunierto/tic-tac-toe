# Tic Tac Toe — versión simple

Un juego muy simple de Tic Tac Toe hecho con HTML/CSS/JS. Ahora soporta juego en red usando Socket.IO.

Instalación y ejecución (desde consola):

```bash
# Inicializar proyecto si no lo hiciste (opcional)
npm init -y

# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# Abrir en el navegador
# Visita: http://localhost:3000
```

Uso básico:

- En la caja "Código de sala" puedes escribir un código para unirte a una sala existente o dejarlo vacío para crear una nueva.
- En la caja "Código de sala" puedes escribir un código para unirte a una sala existente o dejarlo vacío para crear una nueva.
- Escribe tu nombre en "Tu nombre" para que se muestre a los participantes.
- Puedes proteger la sala con una contraseña; si la sala ya existe deberás introducir la misma contraseña para unirte.
- La sala admite máximo 2 participantes; se rechaza la unión adicional.
- Compartir el código de sala con otra persona para jugar desde otro dispositivo.
- Al haber dos jugadores, el juego comienza y se sincroniza vía WebSocket.

Mejoras opcionales: marcador, IA simple, interfaz responsive, animaciones.
