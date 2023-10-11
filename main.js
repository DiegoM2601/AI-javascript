const lienzoCarro = document.getElementById("miLienzo");
lienzoCarro.width = 200;

const lienzoRedNeuronal = document.getElementById("lienzoRedNeuronal");
lienzoRedNeuronal.width = 300;

const ctxCarro = lienzoCarro.getContext("2d");
const ctxRed = lienzoRedNeuronal.getContext("2d");

const camino = new Road(lienzoCarro.width / 2, lienzoCarro.width * 0.9);

// const carro = new Car(100, 100, 30, 50);
//! El constructor de la clase Carro contará con 2 parámetros adicionales el primero servirá para establecer qué instancia especificamente será controlada por el usuario a través de las teclas de dirección y qué instancia conducirá de forma autónoma sobre el lienzo
//! el segundo parámetro servirá para establecer la velocidad máxima del vehículo, en caso de que el mismo no reciba nada, la velocidad máxima siempre será 3

//! el cuarto parámetro pasa de "CONTROL" a "AI" para ceder el control del vehículo a la red neuronal
const carro = new Car(camino.obtenerCentroCarril(1), 100, 30, 50, "AI");

//carros que simulen el tráfico en la carretera
const trafico = [new Car(camino.obtenerCentroCarril(1), -100, 30, 50, "TRAFICO", 2)];

animar();

function animar(time) {
  for (let i = 0; i < trafico.length; i++) {
    trafico[i].actualizar(camino.bordes, []);
  }

  carro.actualizar(camino.bordes, trafico);

  lienzoCarro.height = window.innerHeight;
  lienzoRedNeuronal.height = window.innerHeight;

  ctxCarro.save();

  //! desplazamiento en tiempo real del lienzo y del punto origen sincronizado al desplazamiento del vehículo
  ctxCarro.translate(0, -carro.y + lienzoCarro.height * 0.7);

  camino.dibujar(ctxCarro);
  for (let i = 0; i < trafico.length; i++) {
    trafico[i].dibujar(ctxCarro, "red");
  }
  carro.dibujar(ctxCarro, "blue");

  ctxCarro.restore();

  //animar visualizador mediante el argumento time el cual es provisto a través del método requestAnimationFrame
  ctxRed.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(ctxRed, carro.cerebro);

  requestAnimationFrame(animar);
}
