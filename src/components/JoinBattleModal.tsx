import { useState } from "react";
import Icon from "@/components/ui/icon";
import PixelCanvas from "@/components/PixelCanvas";

interface Battle {
  id: number;
  title: string;
  theme: string;
  timeLeft: string;
}

interface JoinBattleModalProps {
  battle: Battle | null;
  onClose: () => void;
}

type Step = "draw" | "submit" | "success";

export default function JoinBattleModal({ battle, onClose }: JoinBattleModalProps) {
  const [step, setStep] = useState<Step>("draw");
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");

  if (!battle) return null;

  function handleExport(dataUrl: string) {
    setPreview(dataUrl);
    setStep("submit");
  }

  function handleSubmit() {
    if (!preview || !title.trim() || !nickname.trim()) return;
    setStep("success");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white border border-border pixel-border w-full max-w-xl animate-fade-in-up overflow-y-auto max-h-[95vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <p className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground">
              {step === "draw" ? "Рисуй · 32×32" : step === "submit" ? "Отправка работы" : "Готово!"}
            </p>
            <h2 className="font-mono-pixel text-base font-bold mt-0.5">{battle.title}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Theme bar */}
        {step !== "success" && (
          <div className="px-6 py-2.5 bg-gray-50 border-b border-border flex items-center justify-between gap-4">
            <p className="font-mono-pixel text-xs text-muted-foreground truncate">
              <span className="text-foreground font-medium">Тема: </span>{battle.theme}
            </p>
            <p className="font-mono-pixel text-[10px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
              <Icon name="Clock" size={10} />
              {battle.timeLeft}
            </p>
          </div>
        )}

        {/* Steps */}
        {step !== "success" && (
          <div className="flex items-center gap-1 px-6 pt-4 pb-1">
            {(["draw", "submit"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-5 h-5 flex items-center justify-center font-mono-pixel text-[10px] font-bold border transition-colors
                  ${step === s || (s === "draw" && step === "submit")
                    ? "bg-foreground text-background border-foreground"
                    : "bg-white text-muted-foreground border-border"}`}
                >
                  {i + 1}
                </div>
                <span className={`font-mono-pixel text-[10px] uppercase tracking-wider ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === "draw" ? "Рисуй" : "Отправка"}
                </span>
                {i === 0 && <div className="w-5 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">

          {/* STEP 1: Draw */}
          {step === "draw" && (
            <PixelCanvas onExport={handleExport} />
          )}

          {/* STEP 2: Submit */}
          {step === "submit" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-start">
                {preview && (
                  <div className="w-20 h-20 flex-shrink-0 border border-border overflow-hidden">
                    <img
                      src={preview}
                      alt="Твоя работа"
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <label className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
                      Название работы
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ночной город..."
                      className="w-full border border-border px-3 py-2 font-mono-pixel text-xs outline-none focus:border-foreground transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
                      Твой никнейм
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="PixelMaster..."
                      className="w-full border border-border px-3 py-2 font-mono-pixel text-xs outline-none focus:border-foreground transition-colors bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("draw")}
                  className="flex-1 py-3 font-mono-pixel text-xs uppercase tracking-wider border border-border pixel-border-sm hover:bg-gray-50 transition-colors"
                >
                  ← Переделать
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !nickname.trim()}
                  className={`flex-[2] py-3 font-mono-pixel text-sm uppercase tracking-wider transition-all duration-150
                    ${title.trim() && nickname.trim()
                      ? "text-white pixel-border-orange hover:translate-y-[-1px] cursor-pointer"
                      : "bg-gray-100 text-muted-foreground cursor-not-allowed"}`}
                  style={title.trim() && nickname.trim() ? { backgroundColor: "var(--pixel-orange)" } : {}}
                >
                  Отправить работу
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-5 py-8 text-center animate-fade-in-up">
              <div
                className="w-16 h-16 flex items-center justify-center border-2 border-foreground"
                style={{ backgroundColor: "var(--pixel-green)" }}
              >
                <Icon name="Trophy" size={28} color="white" />
              </div>
              <div>
                <h3 className="font-mono-pixel text-lg font-bold">Работа принята!</h3>
                <p className="font-mono-pixel text-sm text-muted-foreground mt-2">
                  «{title}» отправлена в баттл<br />
                  <span className="font-medium text-foreground">«{battle.title}»</span>
                </p>
                {preview && (
                  <div className="w-20 h-20 mx-auto mt-4 border border-border overflow-hidden">
                    <img src={preview} alt="работа" className="w-full h-full" style={{ imageRendering: "pixelated" }} />
                  </div>
                )}
                <p className="font-mono-pixel text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">
                  Голосование начнётся после окончания приёма работ
                </p>
              </div>
              <button
                onClick={onClose}
                className="font-mono-pixel text-xs uppercase tracking-wider px-6 py-3 bg-foreground text-background pixel-border hover:translate-y-[-1px] transition-transform"
              >
                Отлично!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
