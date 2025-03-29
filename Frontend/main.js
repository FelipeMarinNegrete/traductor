var usuario_activoNo = "hola";
var usuario_activoNu = "hola";

function verify_user() {
    var nombre= document.getElementById("input-user-name").value;
    var contrasena = document.getElementById("input-user-key").value;
    fetch(`http://127.0.0.1:8000/verify-user/${[nombre,contrasena]}`)
    .then(response => response.json())
    .then(data => {if(data==="False") alert("Usuario o contraseña incorrectos"); if(data!="False") {location.href = "select1.html";
        const usuario = { nombre: data[0],
            clave: data[1],
            numeroU: data[2],
        }
        fetch("http://127.0.0.1:8000/load-user", {method: "POST",headers: {"Content-Type": "application/json"}, body: JSON.stringify(usuario)});}})
}

function create_user() {
    var nombre= document.getElementById("input-new-user-name").value;
    var contrasena1 = document.getElementById("input-new-user-key").value;
    var contrasena2 = document.getElementById("input-new-user-key-verify").value;
    if (contrasena1!=contrasena2) alert("Las contraseñas no son iguales");
    if (contrasena1===contrasena2) 
    fetch(`http://127.0.0.1:8000/create-user/${[nombre,contrasena1]}`)
    .then(response => response.json())
    .then(data => {location.href = "log_in.html"; alert(data)});
}

function register_user() {
    location.href = "registrar_usuario.html";
}

function cargarInformacion() {
    fetch("http://127.0.0.1:8000/get-userA")
    .then(response => response.json())
    .then(data => {
        let string1 = "Bienvenid@ ";
        let string2 = data.nombre;
        let stringConcatenado = `${string1}${string2}`;
        document.getElementById("nombre_usuario").innerHTML = stringConcatenado;
        console.log(data)
    });
}
function pedir_clima() {
    
}