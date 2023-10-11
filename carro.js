class Car {
  //100, 100, 30, 50
  constructor(x, y, width, height, tipoControl, velocidadMaxima = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.velocidad = 0;
    this.aceleracion = 0.2;
    this.velocidadMax = velocidadMaxima;
    this.friccion = 0.05;
    this.angulo = 0;
    this.accidentado = false;

    this.sensor = new Sensor(this);
    this.controls = new Controls(tipoControl);
  }

  actualizar(bordesCamino) {
    //! impedir que el vehículo siga desplazándose después de haber colisionado
    if (!this.accidentado) {
      this.#mover();
      this.poligono = this.#crearPoligono();
      this.accidentado = this.#evaluarAccidente(bordesCamino);
    }
    this.sensor.actualizar(bordesCamino);
  }

  #evaluarAccidente(bordesCamino) {
    for (let i = 0; i < bordesCamino.length; i++) {
      if (interseccionPoligono(this.poligono, bordesCamino[i])) {
        return true;
      }
    }
    return false;
  }

  #crearPoligono() {
    const puntos = [];

    //obtener la hipotenusa del triangulo rectangulo y el radio entre el punto origen y el vertice
    const rad = Math.hypot(this.width, this.height) / 2;

    //obtener el ángulo del segmento presente entre el punto origen y el vértice a través del arco tangente del rectángulo
    const alfa = Math.atan2(this.width, this.height);

    puntos.push({
      x: this.x - Math.sin(this.angulo - alfa) * rad,
      y: this.y - Math.cos(this.angulo - alfa) * rad,
    });
    puntos.push({
      x: this.x - Math.sin(this.angulo + alfa) * rad,
      y: this.y - Math.cos(this.angulo + alfa) * rad,
    });
    puntos.push({
      x: this.x - Math.sin(Math.PI + this.angulo - alfa) * rad,
      y: this.y - Math.cos(Math.PI + this.angulo - alfa) * rad,
    });
    puntos.push({
      x: this.x - Math.sin(Math.PI + this.angulo + alfa) * rad,
      y: this.y - Math.cos(Math.PI + this.angulo + alfa) * rad,
    });

    return puntos;
  }

  #mover() {
    if (this.controls.adelante) {
      // this.y -= 2;
      this.velocidad += this.aceleracion;
    }
    if (this.controls.reversa) {
      // this.y += 2;
      this.velocidad -= this.aceleracion;
    }

    //* configurar la máxima velocidad que puede alcanzar el carro al momento de desplazarse hacia adelante
    if (this.velocidad > this.velocidadMax) {
      this.velocidad = this.velocidadMax;
    }

    //* configurar la máxima velocida que puede alcanzar el carro en reversa
    //! en este caso la velocidad evaluada consistirá en un valor negativo
    if (this.velocidad < -this.velocidadMax / 2) {
      this.velocidad = -this.velocidadMax / 2;
    }

    //* implementar el coeficiente de fricción
    /**
     * Mientras más alta sea la velocidad del carro, más alta será la fuerza de fricción.
     * Mientras menor sea la velocidad, menor será la fuerza de fricción.
     */
    if (this.velocidad > 0) {
      this.velocidad -= this.friccion;
    }
    if (this.velocidad < 0) {
      this.velocidad += this.friccion;
    }

    //* impedir que el vehículo se mueva por sí solo
    //Math.abs (valor absoluto) se emplea a objeto de ignorar si la velocidad cuenta con un valor positivo o negativo, es decir, a objeto de ignorar si el carro se desplaza hacia adelante o hacia atrás
    if (Math.abs(this.velocidad) < this.friccion) {
      this.velocidad = 0;
    }

    /**
     * En caso de que la velocidad sea un valor negativa, es decir, que el carro se desplaza en reversa los controles de dirección horizontal no deben alterarse. Por defecto, al momento de ir en reversa dichos controles se invierten de modo que será necesario revertirlos a objeto de que conserven la dirección de desplazamiento original.
     */
    //! el siguiente condicional sirve para rotar el carro solo cuando existe aceleración. En caso de que la velocidad sea cero el carro no rotará en lo absoluto
    if (this.velocidad != 0) {
      // revertir el ángulo de rotación del carro en reversa
      const revertir = this.velocidad > 0 ? 1 : -1;

      // *** DESPLAZMIENTO HORARIO Y ANTIHORARIO DEL CARRO
      if (this.controls.izquierda) {
        this.angulo += 0.03 * revertir;
      }
      if (this.controls.derecha) {
        this.angulo -= 0.03 * revertir;
      }
    }

    //* desplazamiento vertical dependiente del ángulo de rotación del vehículo
    this.x -= Math.sin(this.angulo) * this.velocidad;
    this.y -= Math.cos(this.angulo) * this.velocidad;

    // this.y -= this.velocidad;
  }

  //FIXME: la propiedad poligono no se incluye en el constructor de la presente clase ?????
  dibujar(ctx) {
    if (this.accidentado) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "black";
    }

    ctx.beginPath();
    ctx.moveTo(this.poligono[0].x, this.poligono[0].y);

    for (let i = 1; i < this.poligono.length; i++) {
      ctx.lineTo(this.poligono[i].x, this.poligono[i].y);
    }
    ctx.fill();

    // el vehículo tendrá la responsabilidad de dibujar sus propios sensores
    this.sensor.dibujar(ctx);
  }
}
