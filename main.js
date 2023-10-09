const lienzo = document.getElementById("miLienzo");
lienzo.width = 200;

const ctx = lienzo.getContext("2d");

const carro = new Car(100, 100, 30, 50);
carro.dibujar(ctx);

animar();

function animar() {
  carro.actualizar();
  lienzo.height = window.innerHeight;
  carro.dibujar(ctx);
  requestAnimationFrame(animar);
}
