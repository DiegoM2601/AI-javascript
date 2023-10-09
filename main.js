const lienzo = document.getElementById("miLienzo");
lienzo.height = window.innerHeight;
lienzo.width = 200;

const ctx = lienzo.getContext("2d");

const carro = new Car(100, 100, 30, 50);
carro.dibujar(ctx);
