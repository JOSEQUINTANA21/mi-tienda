// PRODUCTOS EN EL CARRITO
let carrito = [];

// BASE DE DATOS DE PRODUCTOS
const productos = [
  {
    id: 1,
    nombre: "Producto 1",
    precio: 89,
    imagen: "img/principal/img1.jpg",
    tallas: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    nombre: "Producto 2",
    precio: 109,
    imagen: "img/principal/img2.jpg",
    tallas: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    nombre: "Producto 3",
    precio: 89,
    imagen: "img/principal/img3.jpg",
    tallas: ["XS", "S", "M", "L"]
  }
];

// GENERAR TARJETAS
function renderizarProductos() {
  const grid = document.querySelector('.grid-productos');
  grid.innerHTML = productos.map(p => `
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

  // EVENTOS TALLAS
  document.querySelectorAll('.talla-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tarjeta = this.closest('.tarjeta');
      tarjeta.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('seleccionada'));
      this.classList.add('seleccionada');
      tarjeta.querySelector('.btn-comprar').dataset.talla = this.dataset.talla;
    });
  });

  // EVENTOS AGREGAR AL CARRITO
  document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const talla = this.dataset.talla;
      if (!talla) {
        alert('Por favor selecciona una talla');
        return;
      }
      const nombre = this.dataset.nombre;
      const precio = Number.parseFloat(this.dataset.precio);
      const imagen = this.dataset.imagen;
      agregarAlCarrito(nombre, precio, imagen, talla);
    });
  });
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
        <p style="font-size:12px; color:#888; margin-top:4px;">Talla: ${p.talla} · Cantidad: ${p.cantidad}</p>
        <p style="font-size:13px; margin-top:4px;">S/ ${(p.precio * p.cantidad).toFixed(2)}</p>
      </div>
      <button data-eliminar="${p.nombre}-${p.talla}"
        style="background:none; border:none; cursor:pointer; color:#888; font-size:18px; align-self:center;">
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

// FINALIZAR COMPRA POR WHATSAPP
function finalizarCompra() {
  if (carrito.length === 0) return;

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const mensaje = carrito.map(p =>
    `• ${p.nombre} - Talla: ${p.talla} x${p.cantidad} - S/ ${(p.precio * p.cantidad).toFixed(2)}`
  ).join('\n');

  const textoCompleto = `¡Hola! Quiero hacer un pedido:\n\n${mensaje}\n\nTotal: S/ ${total.toFixed(2)}`;

  const telefono = '51988294727';
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(textoCompleto)}`;

  window.open(url, '_blank');
}

document.getElementById('btnFinalizar').addEventListener('click', function(e) {
  e.preventDefault();
  finalizarCompra();
});

// INICIAR
renderizarProductos();