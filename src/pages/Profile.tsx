import { useState } from "react";
import Icon from "@/components/ui/icon";

const ARTIST = {
  name: "PixelNinja",
  handle: "@pixelninja",
  avatar: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/29f6b1df-91c8-42f3-9721-e55186064444.jpg",
  bio: "Пиксельный художник с 5-летним стажем. Специализируюсь на персонажах и городских пейзажах. Победитель 12 баттлов.",
  joinedYear: "2021",
  stats: [
    { label: "Баттлов", value: "34" },
    { label: "Побед", value: "12" },
    { label: "Работ", value: "89" },
    { label: "Голосов получено", value: "4 230" },
  ],
  badges: [
    { icon: "Trophy", label: "Победитель", color: "var(--pixel-yellow)" },
    { icon: "Flame", label: "Серия 5", color: "var(--pixel-orange)" },
    { icon: "Star", label: "Топ-10", color: "var(--pixel-blue)" },
    { icon: "Zap", label: "Быстрый старт", color: "var(--pixel-green)" },
  ],
  works: [
    {
      id: 1,
      title: "Ночной город",
      battle: "Городской пейзаж",
      votes: 312,
      place: 1,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/4227e406-b364-4f9b-b6c7-41ea65104ceb.jpg",
    },
    {
      id: 2,
      title: "Лесная тропа",
      battle: "Природа 16bit",
      votes: 245,
      place: 2,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/50c1d6b0-3b74-41b6-8ef5-84c5270e3216.jpg",
    },
    {
      id: 3,
      title: "Воин Пиксель",
      battle: "Персонаж недели",
      votes: 178,
      place: 1,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/26683086-e436-4496-9b8f-3261c4e5c468.jpg",
    },
    {
      id: 4,
      title: "Галерея теней",
      battle: "Тёмная тема",
      votes: 301,
      place: 1,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/45880152-c1d3-4045-a4f5-afb19c4ff77c.jpg",
    },
    {
      id: 5,
      title: "Киберзакат",
      battle: "Городской пейзаж",
      votes: 199,
      place: 2,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/4227e406-b364-4f9b-b6c7-41ea65104ceb.jpg",
    },
    {
      id: 6,
      title: "Пикселёк",
      battle: "Миниатюра",
      votes: 88,
      place: 3,
      image: "https://cdn.poehali.dev/projects/48786136-63c6-45a4-8562-4356eeb35b1e/files/29f6b1df-91c8-42f3-9721-e55186064444.jpg",
    },
  ],
  activity: [4, 7, 2, 9, 5, 11, 3, 8, 6, 12, 4, 7],
};

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

function PlaceBadge({ place }: { place: number }) {
  const colors: Record<number, string> = {
    1: "var(--pixel-yellow)",
    2: "#C0C0C0",
    3: "#CD7F32",
  };
  const labels: Record<number, string> = { 1: "1ST", 2: "2ND", 3: "3RD" };
  if (!labels[place]) return null;
  return (
    <span
      className="font-mono-pixel text-[9px] font-bold px-1.5 py-0.5 text-foreground absolute top-2 left-2"
      style={{ backgroundColor: colors[place] }}
    >
      {labels[place]}
    </span>
  );
}

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const [tab, setTab] = useState<"works" | "battles">("works");
  const maxActivity = Math.max(...ARTIST.activity);

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Nav */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-mono-pixel text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
          <span className="font-mono-pixel text-base font-bold tracking-tight">
            PIXEL<span style={{ color: "var(--pixel-orange)" }}>BATTLE</span>
          </span>
          <button className="font-mono-pixel text-xs uppercase tracking-wider px-4 py-2 bg-foreground text-background pixel-border hover:translate-y-[-1px] transition-transform">
            Войти
          </button>
        </div>
      </header>

      {/* Profile header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in-up">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 border-2 border-border pixel-border overflow-hidden">
                <img
                  src={ARTIST.avatar}
                  alt={ARTIST.name}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center"
                style={{ backgroundColor: "var(--pixel-green)" }}
              >
                <Icon name="Check" size={10} color="white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-mono-pixel text-2xl font-bold tracking-tight">{ARTIST.name}</h1>
                  <p className="font-mono-pixel text-sm text-muted-foreground mt-0.5">{ARTIST.handle}</p>
                </div>
                <button
                  className="font-mono-pixel text-xs uppercase tracking-wider px-4 py-2 border border-border pixel-border-sm hover:bg-foreground hover:text-background transition-colors"
                >
                  Подписаться
                </button>
              </div>

              <p className="text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">{ARTIST.bio}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {ARTIST.badges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border bg-gray-50"
                  >
                    <Icon name={badge.icon} size={12} color={badge.color} />
                    <span className="font-mono-pixel text-[10px] uppercase tracking-wider text-foreground">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-8 border border-border animate-fade-in-up delay-200">
            {ARTIST.stats.map((stat) => (
              <div key={stat.label} className="bg-white px-5 py-4">
                <p className="font-mono-pixel text-xl font-bold">{stat.value}</p>
                <p className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity chart */}
      <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in-up delay-300">
        <div className="border border-border bg-white p-6 pixel-border-sm">
          <p className="font-mono-pixel text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Активность за год
          </p>
          <div className="flex items-end gap-1.5 h-16">
            {ARTIST.activity.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full transition-all duration-500"
                  style={{
                    height: `${(val / maxActivity) * 48}px`,
                    backgroundColor: val === maxActivity ? "var(--pixel-orange)" : "hsl(var(--foreground))",
                    opacity: val === maxActivity ? 1 : 0.15 + (val / maxActivity) * 0.6,
                  }}
                />
                <span className="font-mono-pixel text-[8px] text-muted-foreground">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + Works */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Tabs */}
        <div className="flex gap-px border border-border overflow-hidden w-fit mb-8 animate-fade-in-up delay-400">
          {(["works", "battles"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-mono-pixel text-xs uppercase tracking-wider px-5 py-2.5 transition-colors
                ${tab === t ? "bg-foreground text-background" : "bg-white text-muted-foreground hover:text-foreground"}`}
            >
              {t === "works" ? "Работы" : "Баттлы"}
            </button>
          ))}
        </div>

        {tab === "works" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ARTIST.works.map((work, i) => (
              <div
                key={work.id}
                className={`group border border-border bg-white pixel-border-sm hover:pixel-border transition-all duration-200 animate-fade-in-up delay-${Math.min((i + 1) * 100, 600)} cursor-pointer`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <PlaceBadge place={work.place} />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-200" />
                </div>
                <div className="p-3">
                  <p className="font-mono-pixel text-xs font-semibold truncate">{work.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-mono-pixel text-[10px] text-muted-foreground truncate">{work.battle}</p>
                    <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                      <Icon name="Heart" size={10} />
                      <span className="font-mono-pixel text-[10px]">{work.votes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "battles" && (
          <div className="flex flex-col gap-3">
            {ARTIST.works.map((work, i) => (
              <div
                key={work.id}
                className={`flex items-center gap-4 border border-border bg-white p-4 pixel-border-sm hover:pixel-border transition-all duration-200 animate-fade-in-up delay-${Math.min((i + 1) * 100, 600)} cursor-pointer`}
              >
                <div className="w-12 h-12 flex-shrink-0 border border-border overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono-pixel text-xs font-semibold truncate">{work.battle}</p>
                  <p className="font-mono-pixel text-[10px] text-muted-foreground mt-0.5">{work.title}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-mono-pixel text-xs font-semibold">{work.votes}</p>
                    <p className="font-mono-pixel text-[9px] text-muted-foreground uppercase tracking-wider">голосов</p>
                  </div>
                  {work.place <= 3 && (
                    <span
                      className="font-mono-pixel text-[9px] font-bold px-1.5 py-0.5 text-foreground"
                      style={{
                        backgroundColor:
                          work.place === 1
                            ? "var(--pixel-yellow)"
                            : work.place === 2
                            ? "#C0C0C0"
                            : "#CD7F32",
                      }}
                    >
                      #{work.place}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
