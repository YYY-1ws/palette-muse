import { PaintingCard } from "@/components/PaintingCard";
import roundsData from "@/lib/rounds.json";
import type { RoundsData } from "@/lib/types";

const data = roundsData as RoundsData;

export default function TestImagesPage() {
  const total = data.rounds.reduce((sum, r) => sum + r.paintings.length, 0);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Phase 0 — 图片基础设施验证</h1>
        <p className="mt-2 text-sm text-neutral-500">
          展示 {total} 张画。检查：所有图片正常加载、无 404、骨架屏在加载完成后被替换。
        </p>
      </header>

      {data.rounds.map((round) => (
        <section key={round.round} className="mb-12">
          <h2 className="mb-4 text-lg font-medium">
            第{round.round}轮 {round.theme}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {round.paintings.map((p) => (
              <PaintingCard
                key={p.id}
                filename={p.filename}
                name={p.name}
                artist={p.artist}
                objectPosition={p.objectPosition}
                eager={round.round === 1}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
