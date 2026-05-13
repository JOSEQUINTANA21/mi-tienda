// CARRITO
let carrito = [];
let descuento = 0;

// PRODUCTOS
const productos = [
  {
    id: 1,
    nombre: "Producto 1",
    precio: 89,
    imagen: "img/principal/img1.jpg",
    tallas: ["XS", "S", "M", "L", "XL"],
    categoria: "poleras"
  },
  {
    id: 2,
    nombre: "Producto 2",
    precio: 109,
    imagen: "img/principal/img2.jpg",
    tallas: ["S", "M", "L", "XL"],
    categoria: "abrigos"
  },
  {
    id: 3,
    nombre: "Producto 3",
    precio: 89,
    imagen: "img/principal/img3.jpg",
    tallas: ["XS", "S", "M", "L"],
    categoria: "abrigos"
  }
];

// CUPONES
const cupones = {
  'TIKTOK10': 0.1,
  'VERANO20': 0.2
};

// APLICAR CUPÓN
document.getElementById('aplicarCupon').addEventListener('click', function() {
  const codigo = document.getElementById('cuponInput').value.trim().toUpperCase();
  const mensaje = document.getElementById('mensajeCupon');

  if (cupones[codigo]) {
    descuento = cupones[codigo];
    mensaje.style.color = 'green';
    mensaje.textContent = `✓ Cupón aplicado: ${descuento * 100}% de descuento`;
  } else {
    descuento = 0;
    mensaje.style.color = 'red';
    mensaje.textContent = '✗ Cupón inválido';
  }

  actualizarTotal();
});

// ACTUALIZAR TOTAL CON DESCUENTO
function actualizarTotal() {
  const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const totalDescuento = subtotal * descuento;
  const total = subtotal - totalDescuento;

  document.getElementById('carritoSubtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
  document.getElementById('carritoTotal').textContent = `S/ ${total.toFixed(2)}`;

  const descuentoFila = document.getElementById('descuentoFila');
  if (descuento > 0) {
    descuentoFila.style.display = 'flex';
    document.getElementById('descuentoLabel').textContent = `Descuento (${descuento * 100}%)`;
    document.getElementById('carritoDescuento').textContent = `-S/ ${totalDescuento.toFixed(2)}`;
  } else {
    descuentoFila.style.display = 'none';
  }
}
// REGISTRAR EVENTOS DE TARJETAS
function registrarEventosTarjetas() {
  document.querySelectorAll('.talla-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tarjeta = this.closest('.tarjeta');
      tarjeta.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('seleccionada'));
      this.classList.add('seleccionada');
      tarjeta.querySelector('.btn-comprar').dataset.talla = this.dataset.talla;
    });
  });

  document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const talla = this.dataset.talla;
      if (!talla) {
        alert('Por favor selecciona una talla');
        return;
      }
      agregarAlCarrito(
        this.dataset.nombre,
        Number.parseFloat(this.dataset.precio),
        this.dataset.imagen,
        talla
      );
    });
  });
}

// FILTRAR Y RENDERIZAR PRODUCTOS
function filtrarProductos(categoria) {
  const filtrados = categoria === 'todas'
    ? productos
    : productos.filter(p => p.categoria === categoria);

  const grid = document.querySelector('.grid-productos');
  grid.innerHTML = filtrados.map(p => `
    <div class="tarjeta">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      <h3>${p.nombre}</h3>
      <p>S/ ${p.precio}.00</p>
      <div class="tallas">
        ${p.tallas.map(t => `
          <button class="talla-btn" data-talla="${t}">${t}</button>
        `).join('')}
      </div>
      <a href="#" class="btn-comprar"
          data-nombre="${p.nombre}"
          data-precio="${p.precio}"
          data-imagen="${p.imagen}">Agregar al carrito</a>
    </div>
  `).join('');

  registrarEventosTarjetas();
}

// AGREGAR AL CARRITO
function agregarAlCarrito(nombre, precio, imagen, talla) {
  const productoExistente = carrito.find(p => p.nombre === nombre && p.talla === talla);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, imagen, talla, cantidad: 1 });
  }
  actualizarContador();
  mostrarNotificacion();
}

// ACTUALIZAR CONTADOR
function actualizarContador() {
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  document.getElementById('contador').textContent = total;
}

// RENDERIZAR CARRITO
function renderizarCarrito() {
  const contenedor = document.getElementById('carritoItems');

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p style="color:#888; margin-top:20px;">Tu carrito está vacío</p>';
    document.getElementById('carritoTotal').textContent = 'S/ 0.00';
    return;
  }

contenedor.innerHTML = carrito.map(p => `
    <div style="display:flex; gap:12px; padding:14px 0; border-bottom:1px solid #eee;">
      <img src="${p.imagen}" style="width:70px; height:70px; object-fit:cover;" loading="lazy">
      <div style="flex:1;">
        <p style="font-size:13px; text-transform:uppercase; letter-spacing:1px;">${p.nombre}</p>
        <p style="font-size:12px; color:#888; margin-top:4px;">Talla: ${p.talla}</p>
        <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
          <button data-restar="${p.nombre}-${p.talla}"
            style="background:none; border:1px solid #222; width:24px; height:24px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center;">−</button>
          <span style="font-size:13px;">${p.cantidad}</span>
          <button data-sumar="${p.nombre}-${p.talla}"
            style="background:none; border:1px solid #222; width:24px; height:24px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center;">+</button>
          <span style="font-size:13px; margin-left:8px;">S/ ${(p.precio * p.cantidad).toFixed(2)}</span>
        </div>
      </div>
      <button data-eliminar="${p.nombre}-${p.talla}"
        style="background:none; border:none; cursor:pointer; color:#888; font-size:18px; align-self:flex-start;">
        ✕
      </button>
    </div>
  `).join('');

  document.querySelectorAll('[data-eliminar]').forEach(btn => {
    btn.addEventListener('click', function() {
      const [nombre, talla] = this.dataset.eliminar.split('-');
      carrito = carrito.filter(p => !(p.nombre === nombre && p.talla === talla));
      actualizarContador();
      renderizarCarrito();
    });
  });

  document.querySelectorAll('[data-sumar]').forEach(btn => {
    btn.addEventListener('click', function() {
      const [nombre, talla] = this.dataset.sumar.split('-');
      const producto = carrito.find(p => p.nombre === nombre && p.talla === talla);
      if (producto) producto.cantidad++;
      actualizarContador();
      renderizarCarrito();
    });
  });

  document.querySelectorAll('[data-restar]').forEach(btn => {
    btn.addEventListener('click', function() {
      const [nombre, talla] = this.dataset.restar.split('-');
      const producto = carrito.find(p => p.nombre === nombre && p.talla === talla);
      if (producto) {
        producto.cantidad--;
        if (producto.cantidad === 0) {
          carrito = carrito.filter(p => !(p.nombre === nombre && p.talla === talla));
        }
      }
      actualizarContador();
      renderizarCarrito();
    });
  });

  actualizarTotal();
}

// PANEL CARRITO
const carritoPanel = document.getElementById('carritoPanel');
const overlay = document.getElementById('overlay');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const carritoIcon = document.querySelector('.carrito-icon');

carritoIcon.addEventListener('click', function() {
  carritoPanel.classList.add('abierto');
  overlay.classList.add('activo');
  renderizarCarrito();
});

cerrarCarrito.addEventListener('click', cerrar);
overlay.addEventListener('click', cerrar);

function cerrar() {
  carritoPanel.classList.remove('abierto');
  overlay.classList.remove('activo');
}

// NOTIFICACIÓN
function mostrarNotificacion() {
  const notif = document.getElementById('notificacion');
  notif.classList.add('visible');
  setTimeout(() => notif.classList.remove('visible'), 2000);
}

// FINALIZAR COMPRA
function finalizarCompra() {
  if (carrito.length === 0) return;

  const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const total = subtotal - subtotal * descuento;

  const mensaje = carrito.map(p =>
    `• ${p.nombre} - Talla: ${p.talla} x${p.cantidad} - S/ ${(p.precio * p.cantidad).toFixed(2)}`
  ).join('\n');

  const textoCompleto = descuento > 0
    ? `¡Hola! Quiero hacer un pedido:\n\n${mensaje}\n\nDescuento: ${descuento * 100}%\nTotal: S/ ${total.toFixed(2)}`
    : `¡Hola! Quiero hacer un pedido:\n\n${mensaje}\n\nTotal: S/ ${total.toFixed(2)}`;

  const telefono = '51988294727';
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(textoCompleto)}`;

  window.open(url, '_blank');
}

document.getElementById('btnFinalizar').addEventListener('click', function(e) {
  e.preventDefault();
  finalizarCompra();
});


// ESTRELLAS RESEÑA
let estrellasSeleccionadas = 0;

document.querySelectorAll('.estrella').forEach(estrella => {
  estrella.addEventListener('click', function() {
    estrellasSeleccionadas = Number(this.dataset.valor);
    document.querySelectorAll('.estrella').forEach(e => {
      if (Number(e.dataset.valor) <= estrellasSeleccionadas) {
        e.classList.add('activa');
      } else {
        e.classList.remove('activa');
      }
    });
  });

  estrella.addEventListener('mouseover', function() {
    const valor = Number(this.dataset.valor);
    document.querySelectorAll('.estrella').forEach(e => {
      if (Number(e.dataset.valor) <= valor) {
        e.classList.add('activa');
      } else {
        e.classList.remove('activa');
      }
    });
  });

  estrella.addEventListener('mouseout', function() {
    document.querySelectorAll('.estrella').forEach(e => {
      if (Number(e.dataset.valor) <= estrellasSeleccionadas) {
        e.classList.add('activa');
      } else {
        e.classList.remove('activa');
      }
    });
  });
});

// ENVIAR RESEÑA POR WHATSAPP
document.getElementById('enviarResena').addEventListener('click', function() {
  const nombre = document.getElementById('resNombre').value.trim();
  const texto = document.getElementById('resTexto').value.trim();
  const estrellas = '★'.repeat(estrellasSeleccionadas) + '☆'.repeat(5 - estrellasSeleccionadas);

  if (!nombre || !texto || estrellasSeleccionadas === 0) {
    alert('Por favor completa todos los campos y selecciona una puntuación');
    return;
  }

  const mensaje = `Nueva reseña:\n\nNombre: ${nombre}\nPuntuación: ${estrellas}\nReseña: ${texto}`;
  const url = `https://wa.me/51988294727?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
});

// MODALES - ABRIR
document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const modalId = this.dataset.modal;
    document.getElementById(modalId).classList.add('abierto');
  });
});

// MODALES - CERRAR CON BOTÓN
document.querySelectorAll('.modal-cerrar').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.closest('.modal').classList.remove('abierto');
  });
});

// MODALES - CERRAR CON CLICK FUERA
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('abierto');
    }
  });
});

// ANIMACIONES DE SCROLL
const observador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animar').forEach(el => {
  observador.observe(el);
});

// CATEGORÍAS
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('activa'));
    this.classList.add('activa');
    filtrarProductos(this.dataset.categoria);
  });
});

// CONTADOR REGRESIVO
function iniciarContador() {
  const duracion = 24 * 60 * 60; // 24 horas en segundos
  let tiempo = duracion;

  const intervalo = setInterval(() => {
    const horas = Math.floor(tiempo / 3600);
    const minutos = Math.floor((tiempo % 3600) / 60);
    const segundos = tiempo % 60;

    document.getElementById('contador-tiempo').textContent =
      `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

    if (tiempo <= 0) {
      clearInterval(intervalo);
      document.getElementById('contador-tiempo').textContent = '¡OFERTA EXPIRADA!';
    }

    tiempo--;
  }, 1000);
}

iniciarContador();

// INICIAR
filtrarProductos('todas');