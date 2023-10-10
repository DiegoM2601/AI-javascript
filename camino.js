class Road {
  //el camino estará centrado alrededor de una coordenada x, ancho específico y número de carriles
  constructor(x, width, laneCount = 4) {
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
  }

  dibujar(ctx) {
    ctx.lineWdith = 5;
    ctx.strokeStyle = "white";

    //calcular la dimension de los 3 carriles (laneCount) a traves del método de interpolación lineal
    for (let i = 0; i <= this.laneCount; i++) {
      const x = interpolacionLineal(this.left, this.right, i / this.laneCount);

      //unicamente las dos lineas de por medio se dibujarán entrecortadas o en línea discontinua (dashed lines)
      if (i > 0 && i < this.laneCount) {
        ctx.setLineDash([20, 20]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }
}
