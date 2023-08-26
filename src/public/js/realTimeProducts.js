const socket = io()
const form = document.getElementById('idForm')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target); 
    const prod = Object.fromEntries(datForm);
    socket.emit('nuevoProducto', prod)
    e.target.reset()
})

botonProds.addEventListener('click', () => {
    console.log("Hola")
    socket.on('prods', (prods) => {
        console.log(prods)
    })
})