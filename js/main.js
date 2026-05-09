// PRODUCTOS EN EL CARRITO
let carrito = [];

// AGREGAR AL CARRITO
function agregarAlCarrito(nombre, precio, imagen) {
  const productoExistente = carrito.find(p => p.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad: 1 });
  }
  actualizarContador();
}

// ACTUALIZAR CONTADOR
function actualizarContador() {
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  document.getElementById('contador').textContent = total;
}

// MOSTRAR PRODUCTOS EN EL PANEL
function renderizarCarrito() {
  const contenedor = document.getElementById('carritoItems');
  const totalEl = document.getElementById('carritoTotal');

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p style="color:#888; margin-top:20px;">Tu carrito está vacío</p>';
    totalEl.textContent = 'S/ 0.00';
    return;
  }

  contenedor.innerHTML = carrito.map(p => `
    <div style="display:flex; gap:12px; padding:14px 0; border-bottom:1px solid #eee;">
      <img src="${p.imagen}" style="width:70px; height:70px; object-fit:cover;" loading="lazy">
      <div style="flex:1;">
        <p style="font-size:13px; text-transform:uppercase; letter-spacing:1px;">${p.nombre}</p>
        <p style="font-size:12px; color:#888; margin-top:4px;">Cantidad: ${p.cantidad}</p>
        <p style="font-size:13px; margin-top:4px;">S/ ${(p.precio * p.cantidad).toFixed(2)}</p>
      </div>
      <button data-eliminar="${p.nombre}"
        style="background:none; border:none; cursor:pointer; color:#888; font-size:18px; align-self:center;">
        ✕
      </button>
    </div>
  `).join('');

  document.querySelectorAll('[data-eliminar]').forEach(btn => {
    btn.addEventListener('click', function() {
      carrito = carrito.filter(p => p.nombre !== this.dataset.eliminar);
      actualizarContador();
      renderizarCarrito();
    });
  });

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  totalEl.textContent = `S/ ${total.toFixed(2)}`;
}

// ELEMENTOS DEL PANEL
const carritoPanel = document.getElementById('carritoPanel');
const overlay = document.getElementById('overlay');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const carritoIcon = document.querySelector('.carrito-icon');

// ABRIR CARRITO
carritoIcon.addEventListener('click', function() {
  carritoPanel.classList.add('abierto');
  overlay.classList.add('activo');
  renderizarCarrito();
});

// CERRAR CARRITO
cerrarCarrito.addEventListener('click', cerrar);
overlay.addEventListener('click', cerrar);

function cerrar() {
  carritoPanel.classList.remove('abierto');
  overlay.classList.remove('activo');
}

// EVENTOS BOTONES AGREGAR
document.querySelectorAll('.btn-comprar').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const nombre = this.dataset.nombre;
    const precio = Number.parseFloat(this.dataset.precio);
    const imagen = this.dataset.imagen;
    agregarAlCarrito(nombre, precio, imagen);
  });
});


// FINALIZAR COMPRA POR WHATSAPP
function finalizarCompra() {
  if (carrito.length === 0) return;

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const mensaje = carrito.map(p => 
    `• ${p.nombre} x${p.cantidad} - S/ ${(p.precio * p.cantidad).toFixed(2)}`
  ).join('\n');

  const textoCompleto = `¡Hola! Quiero hacer un pedido:\n\n${mensaje}\n\nTotal: S/ ${total.toFixed(2)}`;

  const telefono = '51988294727'; // ejemplo: 51987654321
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(textoCompleto)}`;

  window.open(url, '_blank');
}

document.getElementById('btnFinalizar').addEventListener('click', function(e) {
  e.preventDefault();
  finalizarCompra();
});