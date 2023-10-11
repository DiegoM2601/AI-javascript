class Visualizer {
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.niveles.length;

    for (let i = network.niveles.length - 1; i >= 0; i--) {
      const levelTop = top + interpolacionLineal(height - levelHeight, 0, network.niveles.length == 1 ? 0.5 : i / (network.niveles.length - 1));

      ctx.setLineDash([7, 3]);
      Visualizer.drawLevel(ctx, network.niveles[i], left, levelTop, width, levelHeight, i == network.niveles.length - 1 ? ["🠉", "🠈", "🠊", "🠋"] : []);
    }
  }

  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const { entradas, salidas, pesos, biases } = level;

    for (let i = 0; i < entradas.length; i++) {
      for (let j = 0; j < salidas.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(entradas, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(salidas, j, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(pesos[i][j]);
        ctx.stroke();
      }
    }

    const nodeRadius = 18;
    for (let i = 0; i < entradas.length; i++) {
      const x = Visualizer.#getNodeX(entradas, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(entradas[i]);
      ctx.fill();
    }

    for (let i = 0; i < salidas.length; i++) {
      const x = Visualizer.#getNodeX(salidas, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(salidas[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.5 + "px Arial";
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return interpolacionLineal(left, right, nodes.length == 1 ? 0.5 : index / (nodes.length - 1));
  }
}
