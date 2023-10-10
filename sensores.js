class Sensor {
  constructor(carro) {
    /**
     * La presente clase toma como parámetro el vehículo de tal manera que siempre se conozca la posición actual del vehículo sobre el lienzo, el vehículo también actuará como punto de referencia a partir el cuál los sensores artificiales desempeñarán su función.
     */
    this.carro = carro;
    // número de rayos láser emitidos por la parte frontal del vehículo
    this.rayCount = 3;
    // rango de alcance y/o longitud de los rayos láser
    this.rayLength = 100;
    // ángulo de inclinación y de distancia entre cada uno de los rayos láser
    this.raySpread = Math.PI / 4;

    this.rays = [];
  }

  //configuración de los rayos láser
  actualizar() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      // el ángulo de inclinación de cada uno de los rayos láser se calculará empleando nuevamente el método de interpolación lineal
      const rayAngle = interpolacionLineal(this.raySpread / 2, -this.raySpread / 2, i / (this.rayCount - 1));

      //la ubicación del punto de partida del rayo láser
      const start = { x: this.carro.x, y: this.carro.y };

      // la ubicación del punto límite del rayo láser
      const end = {
        x: this.carro.x - Math.sin(rayAngle) * this.rayLength,
        y: this.carro.y - Math.cos(rayAngle) * this.rayLength,
      };

      // poblar el array con las coordeandas que deben respetar los rayos láser
      this.rays.push([start, end]);
    }
  }

  dibujar(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      //coordenada de partida del rayo láser
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      //coordeanda límite del rayo láser
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }
}
