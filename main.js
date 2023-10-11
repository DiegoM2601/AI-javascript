const lienzo = document.getElementById("miLienzo");
lienzo.width = 200;

const ctx = lienzo.getContext("2d");

const camino = new Road(lienzo.width / 2, lienzo.width * 0.9);

// const carro = new Car(100, 100, 30, 50);
//! El constructor de la clase Carro contará con un parámetro adicional el cual servirá para establecer qué instancia especificamente será controlada por el usuario a través de las teclas de dirección y qué instancia conducirá de forma autónoma sobre el lienzo
const carro = new Car(camino.obtenerCentroCarril(1), 100, 30, 50, "CONTROL");

//carros que simulen el tráfico en la carretera
const trafico = [new Car(camino.obtenerCentroCarril(1), -100, 30, 50, "ESTATICO", 2)];

animar();

function animar() {
  for (let i = 0; i < trafico.length; i++) {
    trafico[i].actualizar(camino.bordes);
  }

  carro.actualizar(camino.bordes);

  lienzo.height = window.innerHeight;

  ctx.save();

  //! desplazamiento en tiempo real del lienzo y del punto origen sincronizado al desplazamiento del vehículo
  ctx.translate(0, -carro.y + lienzo.height * 0.7);

  camino.dibujar(ctx);
  for (let i = 0; i < trafico.length; i++) {
    trafico[i].dibujar(ctx);
  }
  carro.dibujar(ctx);

  ctx.restore();
  requestAnimationFrame(animar);
}
