// =====================
// PRODUCTOS
// =====================
const productos = [
{id:1,nombre:"Shampoo",precio:25000,categoria:"shampoo",img:"img/shampoo.png.jpeg"},
{id:2,nombre:"Acondicionador Rizos",precio:28000,categoria:"rizos",img:"img/acondicionador.png.jpeg"},
{id:3,nombre:"Gel Definidor de Rizos",precio:22000,categoria:"rizos",img:"img/gel.png.jpeg"},
{id:4,nombre:"Mascarilla",precio:30000,categoria:"tratamiento",img:"img/mascarilla.png.jpeg"},
{id:5,nombre:"Kit Rizos",precio:85000,categoria:"rizos",img:"img/kit-rizos.png.jpeg"},
{id:6,nombre:"Kit Serum",precio:70000,categoria:"tratamiento",img:"img/kit-serum.png.jpeg"},
{id:7,nombre:"Protector Térmico",precio:27000,categoria:"tratamiento",img:"img/protector.png.jpeg"},
{id:8,nombre:"Tinte 5.5",precio:35000,categoria:"color",img:"img/tinte.png.jpeg"},
{id:9,nombre:"Jabón Natural",precio:18000,categoria:"shampoo",img:"img/jabon.png.jpeg"}
];

// =====================
// STORAGE
// =====================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// =====================
// TOAST
// =====================
function toast(msg){
  let t = document.createElement("div");
  t.innerText = msg;
  t.style.cssText = `
    position:fixed;bottom:20px;left:50%;
    transform:translateX(-50%);
    background:#111;color:#fff;
    padding:12px 18px;border-radius:10px;
    z-index:9999`;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(),2000);
}

// =====================
// PRODUCTOS
// =====================
function mostrarProductos(lista){
  const cont = document.getElementById("lista-productos");
  if(!cont) return;

  cont.innerHTML = "";

  lista.forEach(p=>{
    let fav = favoritos.includes(p.id) ? "❤️" : "🤍";

    cont.innerHTML += `
    <div class="card">
      <img src="${p.img}" class="img-producto">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>

      <button onclick="verDetalle(${p.id})">Ver</button>
      <button onclick="agregarCarrito(${p.id})">Agregar</button>
      <button onclick="toggleFavorito(${p.id})">${fav}</button>
    </div>`;
  });
}

// =====================
// BUSCAR / FILTRAR
// =====================
function buscar(){
  let texto = document.getElementById("buscador")?.value.toLowerCase() || "";
  let filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}

function filtrar(){
  let checks = document.querySelectorAll("input[type=checkbox]:checked");
  let categorias = [...checks].map(c => c.value);

  let filtrados = productos.filter(p =>
    categorias.length === 0 || categorias.includes(p.categoria)
  );

  mostrarProductos(filtrados);
}

// =====================
// CARRITO (PRO)
// =====================
function agregarCarrito(id){
  let producto = productos.find(p => p.id === id);
  if(!producto) return;

  let existe = carrito.find(p => p.id === id);
  if(existe){
    existe.cantidad++;
  }else{
    carrito.push({...producto, cantidad:1});
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  toast("Producto agregado 🛒");
}

// =====================
// MOSTRAR CARRITO (DISEÑO PRO)
// =====================
function mostrarCarrito(){
  let cont = document.getElementById("lista-carrito");
  let subtotalEl = document.getElementById("subtotal");
  let totalEl = document.getElementById("total");

  if(!cont) return;

  cont.innerHTML = "";
  let total = 0;

  carrito.forEach((p,i)=>{
    total += p.precio * p.cantidad;

    cont.innerHTML += `
    <div class="item-carrito">

      <img src="${p.img}">

      <div class="item-info">
        <h4>${p.nombre}</h4>
        <p>$${p.precio}</p>
      </div>

      <div class="cantidad">
        <button onclick="cambiarCantidad(${i}, -1)">-</button>
        <span>${p.cantidad}</span>
        <button onclick="cambiarCantidad(${i}, 1)">+</button>
      </div>

      <div class="item-precio">
        $${p.precio * p.cantidad}
      </div>

      <button onclick="eliminar(${i})">🗑</button>

    </div>`;
  });

  if(subtotalEl) subtotalEl.innerText = "$" + total;
  if(totalEl) totalEl.innerText = "$" + (total + 5000);
}

// =====================
// CAMBIAR CANTIDAD
// =====================
function cambiarCantidad(i, cambio){
  carrito[i].cantidad += cambio;

  if(carrito[i].cantidad <= 0){
    carrito.splice(i,1);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContador();
}

// =====================
// ELIMINAR / VACIAR
// =====================
function eliminar(i){
  carrito.splice(i,1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContador();
}

function vaciarCarrito(){
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
  actualizarContador();
}

// =====================
// CONTADOR
// =====================
function actualizarContador(){
  let contador = document.getElementById("contador");
  if(contador){
    contador.innerText = carrito.length;
  }
}

// =====================
// FAVORITOS
// =====================
function toggleFavorito(id){
  let index = favoritos.indexOf(id);

  if(index === -1){
    favoritos.push(id);
    toast("Agregado a favoritos ❤️");
  }else{
    favoritos.splice(index,1);
    toast("Eliminado de favoritos");
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarProductos(productos);
  mostrarFavoritos();
}

// =====================
// MOSTRAR FAVORITOS (PRO)
// =====================
function mostrarFavoritos(){
  let cont = document.getElementById("lista-favoritos");
  if(!cont) return;

  cont.innerHTML = "";

  favoritos.forEach(id=>{
    let p = productos.find(prod => prod.id === id);
    if(!p) return;

    cont.innerHTML += `
    <div class="card-fav">

      <img src="${p.img}">

      <div class="contenido">
        <h3>${p.nombre}</h3>
        <p>Producto capilar</p>
        <span>$${p.precio}</span>

        <button onclick="agregarCarrito(${p.id})">
          Agregar al carrito
        </button>
      </div>

      <button class="eliminar" onclick="toggleFavorito(${p.id})">
        🗑
      </button>

    </div>`;
  });
}

// =====================
// DETALLE
// =====================
function verDetalle(id){
  localStorage.setItem("detalle", id);
  window.location.href = "detalle.html";
}

function cargarDetalle(){
  let id = localStorage.getItem("detalle");
  let p = productos.find(x => x.id == id);
  if(!p) return;

  document.getElementById("nombre").innerText = p.nombre;
  document.getElementById("precio").innerText = "$" + p.precio;
  document.getElementById("detalle-img").src = p.img;
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", ()=>{
  actualizarContador();

  if(document.getElementById("lista-productos")){
    mostrarProductos(productos);
  }

  if(document.getElementById("lista-carrito")){
    mostrarCarrito();
  }

  if(document.getElementById("lista-favoritos")){
    mostrarFavoritos();
  }
});