export default function drawText(ctx, text, x, y) {
  ctx.font = "48px 'Ubuntu Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.fillText(text, x, y);
}
