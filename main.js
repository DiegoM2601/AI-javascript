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
// const carro = new Car(camino.obtenerCentroCarril(1), 100, 30, 50, "AI");

/**
 * * La PARALELIZACION se aplicará simulando 100 vehículos al mismo tiempo.
 */
const N = 100;
const carros = generarCarros(N);
let mejorCarro = carros[0];
if (localStorage.getItem("mejorCerebro")) {
  mejorCarro.cerebro = JSON.parse(localStorage.getItem("mejorCerebro"));
}

//carros que simulen el tráfico en la carretera
const trafico = [new Car(camino.obtenerCentroCarril(1), -100, 30, 50, "TRAFICO", 2)];

animar();

//! almacenar el desempeño neuronal del mejor carro
function guardar() {
  localStorage.setItem("mejorCerebro", JSON.stringify(mejorCarro.cerebro));
}
function descartar() {
  localStorage.removeItem("mejorCerebro");
}

function generarCarros(N) {
  const carros = [];
  for (let i = 1; i <= N; i++) {
    carros.push(new Car(camino.obtenerCentroCarril(1), 100, 30, 50, "AI"));
  }

  return carros;
}

function animar(time) {
  for (let i = 0; i < trafico.length; i++) {
    trafico[i].actualizar(camino.bordes, []);
  }

  for (let i = 0; i < carros.length; i++) {
    carros[i].actualizar(camino.bordes, trafico);
  }

  /**
   * ! encontrar la mejor simulacion, es decir, aquel que cuente con la coordenada y más pequeña
   * ! Tomando en cuenta que el lienzo se desempeña en un plano cartesiano invertido aquel vehículo cuya coordenada y sea la más reducida implicará que se haya más arriba en el lienzo, es decir, más adelante en el camino. Por otra parte aquel carro cuya coordenada en y sea mayor implicará que el mismo se halla más atrás en el camino, o bien está avanzando en reversa o bien se ha detenida por alguna razón.
   */
  //prettier-ingore
  mejorCarro = carros.find(
    //hallar el carro con la coordenada y más pequeña y compararla un array de todos los carros compuestos únicamente por sus coordenadas en el eje y
    (c) => c.y == Math.min(...carros.map((c) => c.y))
  );

  lienzoCarro.height = window.innerHeight;
  lienzoRedNeuronal.height = window.innerHeight;

  ctxCarro.save();

  //! desplazamiento en tiempo real del lienzo y del punto origen sincronizado al desplazamiento del vehículo
  ctxCarro.translate(0, -mejorCarro.y + lienzoCarro.height * 0.7);

  camino.dibujar(ctxCarro);
  for (let i = 0; i < trafico.length; i++) {
    trafico[i].dibujar(ctxCarro, "red");
  }

  ctxCarro.globalAlpha = 0.2;
  for (let i = 0; i < carros.length; i++) {
    carros[i].dibujar(ctxCarro, "blue");
  }
  ctxCarro.globalAlpha = 1;
  mejorCarro.dibujar(ctxCarro, "blue", true);

  ctxCarro.restore();

  //animar visualizador mediante el argumento time el cual es provisto a través del método requestAnimationFrame
  ctxRed.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(ctxRed, mejorCarro.cerebro);

  requestAnimationFrame(animar);
}
