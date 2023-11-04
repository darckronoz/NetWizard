// Obtener elementos del DOM
const nombreInput = document.getElementById('nombre');
const enviarButton = document.getElementById('enviar');
const resultadoParrafo = document.getElementById('resultado');
const body = document.body;

// Agregar evento al botón "Enviar"
enviarButton.addEventListener('click', () => {
    const nombre = nombreInput.value;
    if (nombre) {
        resultadoParrafo.textContent = `Hola, ${nombre}!`;
    } else {
        resultadoParrafo.textContent = 'Por favor, ingresa tu nombre.';
    }
});

// Cambiar al modo oscuro
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
}

// Escuchar eventos para alternar el modo oscuro
document.addEventListener('keydown', (event) => {
    if (event.key === 'm' && (event.ctrlKey || event.metaKey)) {
        toggleDarkMode();
    }
});
