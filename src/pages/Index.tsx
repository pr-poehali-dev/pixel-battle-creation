import { useState } from "react";
import Icon from "@/components/ui/icon";

const BATTLES = [
  {
    id: 1,
    title: "Городской пейзаж",
    theme: "Нарисуй ночной город в стиле киберпанк",
    status: "active",
    timeLeft: "2д 4ч",
    participants: 47,
    player1: {
      name: "PixelNinja",
      votes: 312,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/4227e406-b364-4f9b-b6c7-41ea65104ceb.jpg",
    },
    player2: {
      name: "ArtDroid",
      votes: 289,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/50c1d6b0-3b74-41b6-8ef5-84c5270e3216.jpg",
    },
  },
  {
    id: 2,
    title: "Персонаж недели",
    theme: "Герой магического мира — создай уникального персонажа",
    status: "active",
    timeLeft: "5ч 30м",
    participants: 23,
    player1: {
      name: "LoPixel",
      votes: 178,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/26683086-e436-4496-9b8f-3261c4e5c468.jpg",
    },
    player2: {
      name: "8BitSoul",
      votes: 201,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/4227e406-b364-4f9b-b6c7-41ea65104ceb.jpg",
    },
  },
  {
    id: 3,
    title: "Природа 16bit",
    theme: "Закат над горами — только 16 цветов",
    status: "finished",
    timeLeft: "Завершён",
    participants: 61,
    player1: {
      name: "CraftByte",
      votes: 445,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/50c1d6b0-3b74-41b6-8ef5-84c5270e3216.jpg",
    },
    player2: {
      name: "RetroMind",
      votes: 388,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/26683086-e436-4496-9b8f-3261c4e5c468.jpg",
    },
  },
];

const STATS = [
  { label: "Активных баттлов", value: "12" },
  { label: "Художников", value: "1 840" },
  { label: "Работ загружено", value: "9 320" },
  { label: "Голосов отдано", value: "48K" },
];

function VoteBar({ votes1, votes2 }: { votes1: number; votes2: number }) {
  const total = votes1 + votes2;
  const pct1 = Math.round((votes1 / total) * 100);
  const pct2 = 100 - pct1;
  return (
    <div className="flex h-1.5 w-full overflow-hidden bg-gray-100">
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${pct1}%`, backgroundColor: "var(--pixel-orange)" }}
      />
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${pct2}%`, backgroundColor: "var(--pixel-blue)" }}
      />
    </div>
  );
}

function BattleCard({ battle, index }: { battle: (typeof BATTLES)[0]; index: number }) {
  const [voted, setVoted] = useState<null | 1 | 2>(null);
  const total = battle.player1.votes + battle.player2.votes;
  const isFinished = battle.status === "finished";
  const winner = isFinished ? (battle.player1.votes > battle.player2.votes ? 1 : 2) : null;

  return (
    <div className={`bg-white border border-border pixel-border animate-fade-in-up delay-${(index + 1) * 100}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-mono-pixel text-xs font-semibold uppercase tracking-widest text-foreground">
            {battle.title}
          </span>
          {isFinished ? (
            <span className="font-mono-pixel text-[10px] px-2 py-0.5 bg-gray-100 text-muted-foreground uppercase tracking-wider">
              ЗАВЕРШЁН
            </span>
          ) : (
            <span
              className="font-mono-pixel text-[10px] px-2 py-0.5 text-white uppercase tracking-wider animate-pixel-pulse"
              style={{ backgroundColor: "var(--pixel-orange)" }}
            >
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span className="font-mono-pixel text-xs">{battle.timeLeft}</span>
        </div>
      </div>

      {/* Theme */}
      <div className="px-5 py-3 border-b border-border bg-gray-50">
        <p className="text-xs text-muted-foreground font-mono-pixel">
          <span className="text-foreground font-medium">Тема: </span>
          {battle.theme}
        </p>
      </div>

      {/* VS section */}
      <div className="grid grid-cols-2 relative vs-line">
        {[battle.player1, battle.player2].map((player, i) => {
          const isWinner = winner === i + 1;
          const isVoted = voted === i + 1;
          const pct = Math.round((player.votes / total) * 100);

          return (
            <div
              key={i}
              className={`p-4 flex flex-col gap-3 ${i === 0 ? "border-r border-border" : ""} ${isWinner ? "bg-gray-50" : ""}`}
            >
              <div className="aspect-square w-full overflow-hidden border border-border">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono-pixel text-xs font-semibold truncate">{player.name}</p>
                  <p className="font-mono-pixel text-[10px] text-muted-foreground">
                    {player.votes} голосов · {pct}%
                  </p>
                </div>
                {isWinner && (
                  <span
                    className="font-mono-pixel text-[10px] px-1.5 py-0.5 text-foreground"
                    style={{ backgroundColor: "var(--pixel-yellow)" }}
                  >
                    WIN
                  </span>
                )}
              </div>

              {!isFinished && (
                <button
                  onClick={() => setVoted((i + 1) as 1 | 2)}
                  className={`w-full py-2 text-xs font-mono-pixel font-semibold uppercase tracking-wider border transition-all duration-150
                    ${isVoted
                      ? i === 0
                        ? "text-white border-transparent pixel-border-orange"
                        : "text-white border-transparent pixel-border-blue"
                      : "bg-white text-foreground border-border hover:border-foreground pixel-border-sm"
                    }`}
                  style={
                    isVoted
                      ? { backgroundColor: i === 0 ? "var(--pixel-orange)" : "var(--pixel-blue)" }
                      : {}
                  }
                >
                  {isVoted ? "✓ Голос отдан" : "Голосовать"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote bar */}
      <VoteBar votes1={battle.player1.votes} votes2={battle.player2.votes} />

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon name="Users" size={12} />
          <span className="font-mono-pixel text-xs">{battle.participants} участников</span>
        </div>
        <button className="font-mono-pixel text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          Открыть
          <Icon name="ArrowRight" size={12} />
        </button>
      </div>
    </div>
  );
}

export default function Index() {
  const [filter, setFilter] = useState<"all" | "active" | "finished">("all");

  const filtered = BATTLES.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Nav */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono-pixel text-base font-bold tracking-tight">
              PIXEL<span style={{ color: "var(--pixel-orange)" }}>BATTLE</span>
            </span>
            <span className="animate-blink font-mono-pixel text-base leading-none" style={{ color: "var(--pixel-orange)" }}>_</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#battles"
              className="font-mono-pixel text-xs uppercase tracking-wider text-foreground border-b-2 pb-0.5"
              style={{ borderColor: "var(--pixel-orange)" }}
            >
              Баттлы
            </a>
          </nav>
          <button className="font-mono-pixel text-xs uppercase tracking-wider px-4 py-2 bg-foreground text-background pixel-border hover:translate-y-[-1px] transition-transform">
            Войти
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="animate-fade-in-up">
          <p className="font-mono-pixel text-xs uppercase tracking-widest mb-4" style={{ color: "var(--pixel-orange)" }}>
            Сообщество пиксель-арт художников
          </p>
          <h1 className="font-mono-pixel text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Твори.<br />
            Сражайся.<br />
            <span style={{ color: "var(--pixel-orange)" }}>Побеждай.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed mb-8">
            Участвуй в пиксель-арт баттлах, загружай работы и голосуй за лучших художников.
            Новые темы каждую неделю.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="font-mono-pixel text-sm uppercase tracking-wider px-6 py-3 bg-foreground text-background pixel-border hover:translate-y-[-2px] transition-transform duration-150">
              Участвовать в баттле
            </button>
            <button className="font-mono-pixel text-sm uppercase tracking-wider px-6 py-3 bg-white text-foreground border border-border pixel-border-sm hover:translate-y-[-2px] transition-transform duration-150">
              Как это работает
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-16 border border-border">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={`bg-white px-5 py-5 animate-fade-in-up delay-${(i + 2) * 100}`}
            >
              <p className="font-mono-pixel text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Battles */}
      <section id="battles" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono-pixel text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--pixel-orange)" }}>
              Текущие соревнования
            </p>
            <h2 className="font-mono-pixel text-2xl font-bold">Баттлы</h2>
          </div>

          {/* Filters */}
          <div className="flex gap-px border border-border overflow-hidden">
            {(["all", "active", "finished"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono-pixel text-[10px] uppercase tracking-wider px-3 py-2 transition-colors
                  ${filter === f ? "bg-foreground text-background" : "bg-white text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "Все" : f === "active" ? "Активные" : "Завершённые"}
              </button>
            ))}
          </div>
        </div>

        {/* Battle grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((battle, i) => (
            <BattleCard key={battle.id} battle={battle} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 border border-border bg-white pixel-border p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up delay-600">
          <div>
            <p className="font-mono-pixel text-xs uppercase tracking-widest mb-2" style={{ color: "var(--pixel-orange)" }}>
              Хочешь попасть в следующий баттл?
            </p>
            <h3 className="font-mono-pixel text-xl font-bold">Следующий баттл стартует через 2 дня</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Зарегистрируйся и получи уведомление о старте
            </p>
          </div>
          <button
            className="whitespace-nowrap font-mono-pixel text-sm uppercase tracking-wider px-6 py-3 text-white pixel-border-orange hover:translate-y-[-2px] transition-transform duration-150"
            style={{ backgroundColor: "var(--pixel-orange)" }}
          >
            Записаться
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono-pixel text-sm font-bold">
            PIXEL<span style={{ color: "var(--pixel-orange)" }}>BATTLE</span>
          </span>
          <p className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground">
            Сообщество пиксель-арт художников · 2026
          </p>
          <div className="flex gap-4">
            <a href="#" className="font-mono-pixel text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">О нас</a>
            <a href="#" className="font-mono-pixel text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Правила</a>
            <a href="#" className="font-mono-pixel text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
