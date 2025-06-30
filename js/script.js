document.addEventListener('DOMContentLoaded', () => {
    const osoDispara = document.getElementById('oso-dispara');
    const osoSorpresa = document.getElementById('oso-sorpresa');
    const corazonContainer = document.getElementById('corazon-container');

    // --- Función para generar los puntos del corazón usando la fórmula matemática ---
    function generarPuntosCorazon(numPuntos, escalaX, escalaY, offsetX, offsetY) {
        const puntos = [];
        const radianesPorPunto = (2 * Math.PI) / numPuntos;
        for (let i = 0; i <= numPuntos; i++) {
            const t = i * radianesPorPunto;
            // Fórmula del corazón:
            const x = 16 * Math.sin(t) ** 3;
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

            // Escalar y desplazar las coordenadas para que se ajusten a la pantalla
            puntos.push([
                x * escalaX + offsetX,
                -y * escalaY + offsetY // El -y es para que el corazón no quede invertido
            ]);
        }
        return puntos;
    }

    // Parámetros ajustados para un corazón más pequeño, más proporcionado y movido a la derecha
    const numPuntos = 50;  // Número de puntos para el contorno
    const escalaX = 0.8;   // Ligeramente reducido para que sea menos ancho
    const escalaY = 1.5;   // Mantiene la proporción vertical
    const offsetX = 55;    // Aumentado para mover el corazón más a la derecha (vw)
    const offsetY = 50;    // Posición vertical en el centro de la pantalla (vh)

    // Generar los puntos del corazón con los nuevos parámetros
    const puntosCorazon = generarPuntosCorazon(numPuntos, escalaX, escalaY, offsetX, offsetY);

    let index = 0;
    let corazonesCreados = [];

    // Función para crear un corazón
    function crearCorazon(x, y, esUltimo = false) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Posición inicial (cerca del oso)
        const startX = 15;
        const startY = 60;
        
        heart.style.left = `${startX}vw`;
        heart.style.top = `${startY}vh`;
        
        corazonContainer.appendChild(heart);
        corazonesCreados.push(heart);

        // Pequeño delay para que se vea el efecto de disparo
        setTimeout(() => {
            heart.classList.add('heart-shooting');
            heart.style.left = `${x}vw`;
            heart.style.top = `${y}vh`;
            
            // Si es el último corazón, activar efectos especiales
            if (esUltimo) {
                setTimeout(() => {
                    activarEfectoFinal();
                }, 1500);
            }
        }, 50);
    }

    // Función para activar el efecto final
    function activarEfectoFinal() {
        corazonesCreados.forEach((heart, idx) => {
            setTimeout(() => {
                heart.classList.remove('heart-shooting');
                heart.classList.add('heart-final');
                
                setTimeout(() => {
                    heart.classList.add('heart-pulse');
                }, 800);
            }, idx * 50);
        });

        setTimeout(() => {
            osoDispara.style.display = 'none';
            osoSorpresa.classList.add('show');
        }, 1000);
    }

    // Función para añadir sonido (opcional)
    function reproducirSonido(tipo) {
        try {
            let audio;
            switch(tipo) {
                case 'disparo':
                    // audio = new Audio('sounds/disparo.mp3');
                    break;
                case 'final':
                    // audio = new Audio('sounds/final.mp3');
                    break;
            }
            // if (audio) audio.play();
        } catch (error) {
            console.log('Audio no disponible:', error);
        }
    }

    // Iniciar la animación
    function iniciarAnimacion() {
        const intervalo = setInterval(() => {
            if (index < puntosCorazon.length) {
                const [x, y] = puntosCorazon[index];
                const esUltimo = index === puntosCorazon.length - 1;
                crearCorazon(x, y, esUltimo);
                reproducirSonido('disparo');
                index++;
            } else {
                clearInterval(intervalo);
            }
        }, 300);
    }

    setTimeout(iniciarAnimacion, 1000);

    // Reiniciar al hacer clic en el oso sorprendido
    document.addEventListener('click', (e) => {
        if (e.target.id === 'oso-sorpresa') location.reload();
    });

    // Cursor personalizado
    document.addEventListener('mousemove', (e) => {
        let cursor = document.querySelector('.custom-cursor');
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, #ff1744, #e91e63);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.7;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            `;
            document.body.appendChild(cursor);
        }
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Mostrar u ocultar la tarjeta
    const btnTarjeta = document.getElementById('btn-tarjeta');
    const tarjeta = document.getElementById('tarjeta');

    btnTarjeta.addEventListener('click', (e) => {
        e.stopPropagation();               // Evitar cierre inmediato
        tarjeta.classList.toggle('show');
    });

    // Cerrar la tarjeta al hacer clic fuera del contenido
    tarjeta.addEventListener('click', (e) => {
        if (e.target === tarjeta) tarjeta.classList.remove('show');
    });
});
