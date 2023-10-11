function interpolacionLineal(A, B, t) {
  return A + (B - A) * t;
  // un valor que se halle entre A y B dpendiendo del valor de t
}

function obtenerInterseccion(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: interpolacionLineal(A.x, B.x, t),
        y: interpolacionLineal(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function interseccionPoligono(poligono1, poligono2) {
  for (let i = 0; i < poligono1.length; i++) {
    for (let j = 0; j < poligono2.length; j++) {
      const touch = obtenerInterseccion(poligono1[i], poligono1[(i + 1) % poligono1.length], poligono2[j], poligono2[(j + 1) % poligono2.length]);
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
