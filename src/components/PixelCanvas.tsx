import { useRef, useEffect, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

const GRID_SIZE = 32;
const PALETTE = [
  "#000000", "#ffffff", "#ff6b35", "#2d6be4",
  "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6",
  "#1abc9c", "#e67e22", "#34495e", "#95a5a6",
  "#ff9ff3", "#ffeaa7", "#74b9ff", "#55efc4",
  "#fd79a8", "#6c5ce7", "#00b894", "#fdcb6e",
];

interface PixelCanvasProps {
  onExport: (dataUrl: string) => void;
}

export default function PixelCanvas({ onExport }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = useState<string[]>(() => Array(GRID_SIZE * GRID_SIZE).fill("#ffffff"));
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState<"pen" | "eraser" | "fill">("pen");
  const [size, setSize] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [history, setHistory] = useState<string[][]>([Array(GRID_SIZE * GRID_SIZE).fill("#ffffff")]);
  const [histIdx, setHistIdx] = useState(0);
  const cellSize = useRef(12);

  // Draw grid on canvas
  const render = useCallback((px: string[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cs = cellSize.current;
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const x = (i % GRID_SIZE) * cs;
      const y = Math.floor(i / GRID_SIZE) * cs;
      ctx.fillStyle = px[i];
      ctx.fillRect(x, y, cs, cs);
    }
    // grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cs, 0);
      ctx.lineTo(i * cs, GRID_SIZE * cs);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cs);
      ctx.lineTo(GRID_SIZE * cs, i * cs);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    cellSize.current = Math.floor(w / GRID_SIZE);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = cellSize.current * GRID_SIZE;
      canvas.height = cellSize.current * GRID_SIZE;
    }
    render(pixels);
  }, []);

  useEffect(() => { render(pixels); }, [pixels, render]);

  function getCell(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor(((clientX - rect.left) * scaleX) / cellSize.current);
    const y = Math.floor(((clientY - rect.top) * scaleY) / cellSize.current);
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return null;
    return { x, y };
  }

  function floodFill(px: string[], idx: number, target: string, replacement: string): string[] {
    if (target === replacement) return px;
    const next = [...px];
    const stack = [idx];
    while (stack.length) {
      const i = stack.pop()!;
      if (i < 0 || i >= GRID_SIZE * GRID_SIZE) continue;
      if (next[i] !== target) continue;
      next[i] = replacement;
      const x = i % GRID_SIZE;
      if (x > 0) stack.push(i - 1);
      if (x < GRID_SIZE - 1) stack.push(i + 1);
      stack.push(i - GRID_SIZE);
      stack.push(i + GRID_SIZE);
    }
    return next;
  }

  function paint(cell: { x: number; y: number }, px: string[]): string[] {
    const next = [...px];
    const activeColor = tool === "eraser" ? "#ffffff" : color;
    if (tool === "fill") {
      const idx = cell.y * GRID_SIZE + cell.x;
      return floodFill(next, idx, next[idx], activeColor);
    }
    const half = Math.floor(size / 2);
    for (let dy = -half; dy <= half; dy++) {
      for (let dx = -half; dx <= half; dx++) {
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
          next[ny * GRID_SIZE + nx] = activeColor;
        }
      }
    }
    return next;
  }

  function saveHistory(px: string[]) {
    const newHist = history.slice(0, histIdx + 1);
    newHist.push(px);
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
  }

  function handleDown(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const cell = getCell(e);
    if (!cell) return;
    setDrawing(true);
    const next = paint(cell, pixels);
    setPixels(next);
    if (tool === "fill") saveHistory(next);
  }

  function handleMove(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (!drawing || tool === "fill") return;
    const cell = getCell(e);
    if (!cell) return;
    setPixels(prev => paint(cell, prev));
  }

  function handleUp() {
    if (drawing) {
      setDrawing(false);
      saveHistory(pixels);
    }
  }

  function undo() {
    if (histIdx > 0) {
      const idx = histIdx - 1;
      setHistIdx(idx);
      setPixels(history[idx]);
    }
  }

  function redo() {
    if (histIdx < history.length - 1) {
      const idx = histIdx + 1;
      setHistIdx(idx);
      setPixels(history[idx]);
    }
  }

  function clear() {
    const blank = Array(GRID_SIZE * GRID_SIZE).fill("#ffffff");
    setPixels(blank);
    saveHistory(blank);
  }

  function handleExport() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Export without grid lines — clean pixel art
    const off = document.createElement("canvas");
    off.width = GRID_SIZE;
    off.height = GRID_SIZE;
    const ctx = off.getContext("2d")!;
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const x = i % GRID_SIZE;
      const y = Math.floor(i / GRID_SIZE);
      ctx.fillStyle = pixels[i];
      ctx.fillRect(x, y, 1, 1);
    }
    onExport(off.toDataURL("image/png"));
  }

  const TOOLS = [
    { id: "pen", icon: "Pencil", label: "Карандаш" },
    { id: "eraser", icon: "Eraser", label: "Ластик" },
    { id: "fill", icon: "PaintBucket", label: "Заливка" },
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Tools */}
        <div className="flex gap-px border border-border overflow-hidden">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.label}
              className={`p-2 transition-colors ${tool === t.id ? "bg-foreground text-background" : "bg-white text-muted-foreground hover:text-foreground"}`}
            >
              <Icon name={t.icon} size={14} />
            </button>
          ))}
        </div>

        {/* Brush size — only for pen/eraser */}
        {tool !== "fill" && (
          <div className="flex gap-px border border-border overflow-hidden">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-7 h-7 flex items-center justify-center font-mono-pixel text-[10px] transition-colors
                  ${size === s ? "bg-foreground text-background" : "bg-white text-muted-foreground hover:text-foreground"}`}
              >
                {s}px
              </button>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Undo / Redo / Clear */}
        <div className="flex gap-px border border-border overflow-hidden">
          <button
            onClick={undo}
            disabled={histIdx === 0}
            title="Отменить"
            className="p-2 bg-white text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Icon name="Undo2" size={14} />
          </button>
          <button
            onClick={redo}
            disabled={histIdx >= history.length - 1}
            title="Повторить"
            className="p-2 bg-white text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Icon name="Redo2" size={14} />
          </button>
          <button
            onClick={clear}
            title="Очистить"
            className="p-2 bg-white text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      </div>

      {/* Palette + active color */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 flex-shrink-0 border-2 border-foreground pixel-border-sm"
          style={{ backgroundColor: tool === "eraser" ? "#ffffff" : color }}
          title="Текущий цвет"
        />
        <div className="flex flex-wrap gap-1">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool("pen"); }}
              className={`w-5 h-5 transition-transform hover:scale-110 ${color === c && tool !== "eraser" ? "ring-2 ring-foreground ring-offset-1" : "border border-border"}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="w-full border border-border overflow-hidden cursor-crosshair" style={{ touchAction: "none" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", imageRendering: "pixelated" }}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={handleUp}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleExport}
        className="w-full py-3 font-mono-pixel text-sm uppercase tracking-wider text-white pixel-border-orange hover:translate-y-[-1px] transition-transform"
        style={{ backgroundColor: "var(--pixel-orange)" }}
      >
        Использовать эту работу →
      </button>
    </div>
  );
}
