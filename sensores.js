class Sensor {
  constructor(carro) {
    /**
     * La presente clase toma como parámetro el vehículo de tal manera que siempre se conozca la posición actual del vehículo sobre el lienzo, el vehículo también actuará como punto de referencia a partir el cuál los sensores artificiales desempeñarán su función.
     */
    this.carro = carro;

    //! es posible modificar los 3 siguientes parámetros de forma dinámica a objeto de incrementar o disminuir el número de sensores laser
    // número de rayos láser emitidos por la parte frontal del vehículo
    this.rayCount = 5;
    // rango de alcance y/o longitud de los rayos láser
    this.rayLength = 150;
    // ángulo de inclinación y de distancia entre cada uno de los rayos láser
    this.raySpread = Math.PI / 2; //45°

    this.rays = [];
    this.lecturas = [];
  }

  actualizar(bordesCamino) {
    this.#castRays();
    this.lecturas = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.lecturas.push(this.#obtenerLectura(this.rays[i], bordesCamino));
    }
  }

  //detectar todos los contactos detectados por los sensores laser
  //mas especificamente contactos con los bordes de colision cada vez que de produce una interseccion entre los segmentos laser y los bordes de la carretera
  #obtenerLectura(ray, bordesCamino) {
    let contactos = [];

    for (let i = 0; i < bordesCamino.length; i++) {
      const contacto = obtenerInterseccion(ray[0], ray[1], bordesCamino[i][0], bordesCamino[i][1]);
      //poblar el array contactos solo en caso de que exista alguna intersección
      if (contacto) {
        contactos.push(contacto);
      }
    }

    //si no existe ningun contacto y/o interseccion...
    if (contactos.length == 0) {
      return null;
    } else {
      //el bucle destinado a identificar intersecciones también se encarga de determinar que tan lejos está el punto de intersección del punto de origen, es decir, del centro del vehículo
      //esta distancia entre el punto origen y el punto de interseccion se denominará offset

      //construir un nuevo array a partir del array original contactos
      const offsets = contactos.map((e) => e.offset);

      //* una vez que todos los offsets se han coleccionado en un array el mismo se somete al método Math.min para determinar qué offset tiene el valor más reducido, es decir, que punto de intersección se halla más cerca del punto origen del vehículo
      // ? Math.min no admite arrays como parámetro. El operador ... se encargará de separar ese array en múltiples valores individuales. El resultado sería relativamente parecido a crear un bucle para barrer el array donde cada iteración proporcionará un nuevo parámetro para el método Math.min. En este caso particular se proporciona al método Math.min todos los valores contenidos por el array offsets y Math.min se encarga de seleccionar el valor más pequeño el cuál se procederá a asingar a la constante minOffSet. Finalmente se vuelve a barrer el array contactos (.find) para seleccionar el primer elemento que coincida con el valor escogido previamente por Math.min
      const minOffset = Math.min(...offsets);
      return contactos.find((e) => e.offset == minOffset);
    }
  }

  //configuración de los rayos láser
  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      // el ángulo de inclinación de cada uno de los rayos láser se calculará empleando nuevamente el método de interpolación lineal
      // el valor retornado por la interpolacion lineal es sumado al angulo actual del carro de modo que los sensores laser roten con el vehículo y no permanezcan estáticos
      const rayAngle = interpolacionLineal(this.raySpread / 2, -this.raySpread / 2, this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)) + this.carro.angulo;

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
      //dibujar las intersecciones o contactos en caso de que se detecten
      let end = this.rays[i][1];
      if (this.lecturas[i]) {
        end = this.lecturas[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      //coordenada de partida del rayo láser
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      //coordeanda límite del rayo láser
      // ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      //! cortar la propagacion del sensor laser en aquel punto donde haya contacto con el obstáculo
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      //! dibujar un segmento que simule el alcace del sensor laser si es que no existiera ese obstáculo
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
