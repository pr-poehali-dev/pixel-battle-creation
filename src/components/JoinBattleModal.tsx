import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

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

type Step = "upload" | "preview" | "success";

export default function JoinBattleModal({ battle, onClose }: JoinBattleModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!battle) return null;

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleSubmit() {
    if (!preview || !title.trim() || !nickname.trim()) return;
    setStep("success");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-border pixel-border w-full max-w-lg animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground">
              Участие в баттле
            </p>
            <h2 className="font-mono-pixel text-base font-bold mt-0.5">{battle.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {step !== "success" && (
          <div className="px-6 py-3 bg-gray-50 border-b border-border">
            <p className="font-mono-pixel text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Тема:</span> {battle.theme}
            </p>
            <p className="font-mono-pixel text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <Icon name="Clock" size={10} />
              Осталось: {battle.timeLeft}
            </p>
          </div>
        )}

        {/* Steps indicator */}
        {step !== "success" && (
          <div className="flex gap-px px-6 pt-4">
            {(["upload", "preview"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`w-5 h-5 flex items-center justify-center font-mono-pixel text-[10px] font-bold border transition-colors
                    ${step === s || (s === "upload" && step === "preview")
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white text-muted-foreground border-border"
                    }`}
                >
                  {i + 1}
                </div>
                <span className={`font-mono-pixel text-[10px] uppercase tracking-wider ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === "upload" ? "Загрузка" : "Отправка"}
                </span>
                {i === 0 && <div className="w-6 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">

          {/* STEP 1: Upload */}
          {step === "upload" && (
            <div className="flex flex-col gap-4">
              {/* Drop zone */}
              <div
                className={`border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 h-48
                  ${dragOver ? "border-foreground bg-gray-50" : "border-border hover:border-foreground"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <div className="absolute inset-0 bg-foreground/0 hover:bg-foreground/10 transition-colors flex items-center justify-center">
                      <span className="font-mono-pixel text-[10px] uppercase tracking-wider text-transparent hover:text-white transition-colors">
                        Заменить
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground">
                      <Icon name="ImagePlus" size={20} />
                    </div>
                    <div className="text-center">
                      <p className="font-mono-pixel text-xs font-medium">Перетащи файл или кликни</p>
                      <p className="font-mono-pixel text-[10px] text-muted-foreground mt-1">PNG, JPG — рекомендуется пиксель-арт</p>
                    </div>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />

              <button
                onClick={() => setStep("preview")}
                disabled={!preview}
                className={`w-full py-3 font-mono-pixel text-sm uppercase tracking-wider transition-all duration-150
                  ${preview
                    ? "bg-foreground text-background pixel-border hover:translate-y-[-1px] cursor-pointer"
                    : "bg-gray-100 text-muted-foreground cursor-not-allowed"
                  }`}
              >
                Далее →
              </button>
            </div>
          )}

          {/* STEP 2: Preview + submit */}
          {step === "preview" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 border border-border overflow-hidden">
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                </div>
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
                  onClick={() => setStep("upload")}
                  className="flex-1 py-3 font-mono-pixel text-xs uppercase tracking-wider border border-border pixel-border-sm hover:bg-gray-50 transition-colors"
                >
                  ← Назад
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !nickname.trim()}
                  className={`flex-2 flex-grow py-3 font-mono-pixel text-sm uppercase tracking-wider transition-all duration-150
                    ${title.trim() && nickname.trim()
                      ? "bg-foreground text-background pixel-border hover:translate-y-[-1px] cursor-pointer"
                      : "bg-gray-100 text-muted-foreground cursor-not-allowed"
                    }`}
                  style={title.trim() && nickname.trim() ? { backgroundColor: "var(--pixel-orange)", color: "white" } : {}}
                >
                  Отправить работу
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-5 py-6 text-center animate-fade-in-up">
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
