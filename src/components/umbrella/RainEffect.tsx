"use client";

import { useEffect, useRef } from "react";

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let drops: Raindrop[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function initDrops() {
      drops = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        speed: 1.5 + Math.random() * 3.5,
        length: 12 + Math.random() * 20,
        opacity: 0.08 + Math.random() * 0.18,
      }));
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const drop of drops) {
        ctx!.beginPath();
        ctx!.moveTo(drop.x, drop.y);
        ctx!.lineTo(drop.x, drop.y + drop.length);
        ctx!.strokeStyle = `rgba(100, 150, 255, ${drop.opacity})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas!.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas!.width;
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    resize();
    initDrops();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
