class NeuralNetwork {
  //número de neuronas por capa
  constructor(neuronCounts) {
    //propiedad que contendrá los 3 niveles o capas de la red neuronal
    this.niveles = [];

    //especificar por capa el número de entradas y salidas
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.niveles.push(new Nivel(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  //calcular los datos de salida de forma recursiva por cada nivel
  static feedForward(entradasProvistas, red) {
    //situar las salidas de la capa anterior en la nueva capa en la forma de entradas
    let salidas = Nivel.feedForward(entradasProvistas, red.niveles[0]);
    for (let i = 1; i < red.niveles.length; i++) {
      salidas = Nivel.feedForward(salidas, red.niveles[i]);
    }

    // ! las salidas finales dictarán si el vehículo debe ir hacia adelante, hacia atrás, izquierda o derecha
    return salidas;
  }
}

class Nivel {
  constructor(inputCount, outputCount) {
    this.entradas = new Array(inputCount);
    this.salidas = new Array(outputCount);

    //sesgo
    this.biases = new Array(outputCount);
    //pesos de las conexiones entre las neuronas
    this.pesos = new Array(outputCount);

    for (let i = 0; i < inputCount; i++) {
      this.pesos[i] = new Array(outputCount);
    }

    Nivel.#randomize(this);
  }

  //asignacion de valores aleatorios por nodo (pesos y biases)
  //los números provenientes del siguiente método representarán el enlace entre las neuronas, enlaces cuyo peso constará de valores tantos positivos como negativos
  static #randomize(nivel) {
    //pesos aleatorios
    for (let i = 0; i < nivel.entradas.length; i++) {
      for (let j = 0; j < nivel.salidas.length; j++) {
        nivel.pesos[i][j] = Math.random() * 2 - 1;
      }
    }

    //biases aleatorios
    for (let i = 0; i < nivel.biases.length; i++) {
      nivel.biases[i] = Math.random() * 2 - 1;
    }
  }

  //cálculo de los valores de salida
  static feedForward(entradasProvistas, nivel) {
    //leer la información proveniente de los sensores láser presentes en el vehículo
    for (let i = 0; i < nivel.entradas.length; i++) {
      nivel.entradas[i] = entradasProvistas[i];
    }

    //calculo del valor de salida de pre-activacion mutiplicando los valores de entrada con los pesos generados anteriormente
    for (let i = 0; i < nivel.salidas.length; i++) {
      let sum = 0;
      for (let j = 0; j < nivel.entradas.length; j++) {
        sum += nivel.entradas[j] * nivel.pesos[j][i];
      }

      //si la salida de pre-activacion es mayor al sesgo entonces la neurona disparará un 1 como salida, de lo contrario se emitirá un 0
      if (sum > nivel.biases[i]) {
        nivel.salidas[i] = 1;
      } else {
        nivel.salidas[i] = 0;
      }
    }

    return nivel.salidas;
  }
}
