import React, { useEffect, useRef } from "react";

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let fontSize;
    let columns;
    let drops = [];

    const letters = "01<>/$#@%&*";

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      fontSize = window.innerWidth < 768 ? 12 : 16;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff88";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text =
          letters[Math.floor(Math.random() * letters.length)];

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (
          drops[i] * fontSize > canvas.height &&
          Math.random() > 0.975
        ) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    setupCanvas();
    draw();

    window.addEventListener("resize", setupCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
    />
  );
};

export default MatrixBackground;