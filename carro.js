class Car {
  //100, 100, 30, 50
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.velocidad = 0;
    this.aceleracion = 0.2;
    this.velocidadMax = 3;
    this.friccion = 0.05;
    this.angulo = 0;

    this.controls = new Controls();
  }

  actualizar() {
    this.#mover();
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

  dibujar(ctx) {
    //animar la rotación del vehículo
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angulo);
    ctx.beginPath();

    //prettier-ignore
    ctx.rect(
      -this.width / 2, 
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.fill();

    ctx.restore();
  }
}
