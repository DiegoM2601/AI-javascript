class Road {
  //el camino estará centrado alrededor de una coordenada x, ancho específico y número de carriles
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;

    //carriles
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    //longitud de la carretera infinita
    const infinito = 1000000;
    this.top = -infinito;
    this.bottom = infinito;

    //definir bordes de colision
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.bordes = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  //para alinear el carro a uno de los carriles primero sera necesario determinar el índice del carril en el cuál se hallará el vehículo
  obtenerCentroCarril(laneIndex) {
    const laneWidth = this.width / this.laneCount;

    //el calculo se hará partir del primer carril presente en la izquierda del camino a partir del cuál se calculará el centro de los carriles adyacentes
    return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
  }

  dibujar(ctx) {
    ctx.lineWdith = 5;
    ctx.strokeStyle = "white";

    //calcular la dimension de los 3 carriles (laneCount) a traves del método de interpolación lineal
    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = interpolacionLineal(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.bordes.forEach((borde) => {
      ctx.beginPath();
      ctx.moveTo(borde[0].x, borde[0].y);
      ctx.lineTo(borde[1].x, borde[1].y);
      ctx.stroke();
    });
  }
}
