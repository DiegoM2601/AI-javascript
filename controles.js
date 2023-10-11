class Controls {
  constructor(tipo) {
    this.adelante = false;
    this.izquierda = false;
    this.derecha = false;
    this.reversa = false;

    switch (tipo) {
      case "CONTROL":
        this.#addKeyboardListeners();
        break;
      case "ESTATICO":
        // ! El carro que simula el tráfico conducirá hacia adelante de forma perpetua por defecto
        this.adelante = true;
        break;
    }

    // this.#addKeyboardListeners();
  }

  /**
   * Método de acceso privado el cuál se encargará de estar a la escucha de eventos del teclado.
   */
  #addKeyboardListeners() {
    //! escuchar cuando una tecla ha sido presionada
    document.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.izquierda = true;
          break;
        case "ArrowRight":
          this.derecha = true;
          break;
        case "ArrowUp":
          this.adelante = true;
          break;
        case "ArrowDown":
          this.reversa = true;
          break;
      }
      // console.table(this);
    };

    //! escuchar cuando la tecla ha sido liberada o el usuario a dejado de presionarla
    document.onkeyup = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.izquierda = false;
          break;
        case "ArrowRight":
          this.derecha = false;
          break;
        case "ArrowUp":
          this.adelante = false;
          break;
        case "ArrowDown":
          this.reversa = false;
          break;
      }
      // console.table(this);
    };
  }
}
