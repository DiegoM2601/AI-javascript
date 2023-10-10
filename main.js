const lienzo = document.getElementById("miLienzo");
lienzo.width = 200;

const ctx = lienzo.getContext("2d");

const camino = new Road(lienzo.width / 2, lienzo.width * 0.9);

// const carro = new Car(100, 100, 30, 50);
const carro = new Car(camino.obtenerCentroCarril(1), 100, 30, 50);
carro.dibujar(ctx);

animar();

function animar() {
  carro.actualizar();

  lienzo.height = window.innerHeight;
  camino.dibujar(ctx);
  carro.dibujar(ctx);
  requestAnimationFrame(animar);
}
