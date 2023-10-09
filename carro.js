class Car {
  //100, 100, 30, 50
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.controls = new Controls();
  }

  actualizar() {
    if (this.controls.adelante) {
      this.y -= 2;
    }
    if (this.controls.reversa) {
      this.y += 2;
    }
  }

  dibujar(ctx) {
    ctx.beginPath();
    //* En lugar de ubicar un punto en el plano cartesiano y dibujar a partir de él el rectángulo se opta por dibujar dicha figura alrededor del punto y por encima del mismo
    ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
  }
}
