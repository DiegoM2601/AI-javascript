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

    this.controls = new Controls();
  }

  actualizar() {
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

    // *** DESPLAZMIENTO IZQUIERDA DERECHA
    if (this.controls.izquierda) {
      this.x -= 2;
    }
    if (this.controls.derecha) {
      this.x += 2;
    }

    this.y -= this.velocidad;
  }

  dibujar(ctx) {
    ctx.beginPath();
    //* En lugar de ubicar un punto en el plano cartesiano y dibujar a partir de él el rectángulo se opta por dibujar dicha figura alrededor del punto y por encima del mismo
    ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
  }
}
