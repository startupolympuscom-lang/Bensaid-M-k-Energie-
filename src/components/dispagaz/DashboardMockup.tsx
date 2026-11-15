import Image from "next/image";
import logoWhite from "@/assets/dispagaz/dispagaz-logo-white.png";
import { cn } from "@/lib/cn";

/**
 * Laptop showing an illustrative Dispagaz dashboard, built in HTML/CSS.
 *
 * Everything is sized in `em`, and the root font-size is a fraction of the
 * container width (1em ≈ 1/54 of the width, via container query units), so
 * the whole mockup scales perfectly from phones to large screens.
 * Figures are sample data, labelled as such inside the mockup.
 */

const nav = [
  { label: "Tableau de bord", icon: "M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z" },
  { label: "Ventes", icon: "M3 4h2l2.4 11h11.2L21 7H7M9 20a1 1 0 1 0 0-.01M18 20a1 1 0 1 0 0-.01" },
  { label: "Stock", icon: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10" },
  {
    label: "Tournées",
    icon: "M2 6h12v10H2zM14 10h4l3 3v3h-7M6 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01",
  },
  {
    label: "Clients",
    icon: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4-5",
  },
  { label: "Finances", icon: "M3 6h18v13H3zM3 10h18M16 15h2" },
  { label: "Rapports", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[1.05em] w-[1.05em] shrink-0"
    >
      <path d={d} />
    </svg>
  );
}

const kpis = [
  { label: "Ventes", value: "482 300", unit: "MAD", note: "+ 12,4 %" },
  { label: "Bouteilles en stock", value: "5 240", unit: "", note: "+ 3,1 %" },
  { label: "Tournées", value: "12", unit: "", note: "En cours" },
];

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];

export function DashboardMockup({ caption, className }: { caption: string; className?: string }) {
  return (
    <figure className={cn("@container", className)}>
      <div
        role="img"
        aria-label="Aperçu de l’interface Dispagaz : tableau de bord des ventes, du stock, des tournées et de l’évolution des ventes (données d’exemple)"
        className="text-[1.85cqw] select-none"
      >
        {/* Lid */}
        <div className="relative rounded-t-[1.5em] bg-[#0b0c0d] p-[0.8em] pt-[1.1em] shadow-[0_4em_8em_-2em_rgb(0_0_0/0.65)] ring-1 ring-white/10">
          <span className="absolute top-[0.4em] left-1/2 h-[0.35em] w-[0.35em] -translate-x-1/2 rounded-full bg-[#2a2d30]" />
          <div className="grid aspect-[16/10] grid-cols-[10.5em_1fr] overflow-hidden rounded-[0.5em] bg-[#f6f6f4] text-[#171b1d]">
            {/* Sidebar */}
            <div className="flex flex-col bg-[#15171a] px-[1em] py-[1.4em] text-white">
              <Image src={logoWhite} alt="" className="h-[1.6em] w-auto self-start" sizes="120px" />
              <ul className="mt-[2em] space-y-[0.3em]">
                {nav.map((item, i) => (
                  <li
                    key={item.label}
                    className={cn(
                      "flex items-center gap-[0.7em] rounded-[0.6em] px-[0.8em] py-[0.62em] text-[0.8em] leading-none",
                      i === 0 ? "bg-[#ff6b00] font-semibold text-[#171b1d]" : "text-white/70",
                    )}
                  >
                    <NavIcon d={item.icon} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main */}
            <div className="flex min-h-0 flex-col p-[1.4em]">
              <div className="flex items-start justify-between gap-[1em]">
                <div>
                  <p className="font-heading text-[1.5em] leading-tight font-bold tracking-[-0.02em]">
                    Bonjour,
                  </p>
                  <p className="mt-[0.3em] text-[0.78em] text-[#5b6063]">
                    Voici la performance de votre activité aujourd’hui.
                  </p>
                </div>
                <span className="rounded-full border border-[#e7e8e6] bg-white px-[0.9em] py-[0.45em] text-[0.72em] font-semibold whitespace-nowrap">
                  Données d’exemple
                </span>
              </div>

              <div className="mt-[1.4em] grid grid-cols-3 gap-[0.9em]">
                {kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-[0.8em] bg-white p-[1em] shadow-[0_0.1em_0.5em_rgb(23_27_29/0.07)]"
                  >
                    <p className="flex items-center gap-[0.45em] text-[0.7em] text-[#5b6063]">
                      <span className="h-[0.7em] w-[0.7em] rounded-[0.2em] border-[0.15em] border-[#ff6b00]" />
                      {kpi.label}
                    </p>
                    <p className="mt-[0.45em] font-heading text-[1.4em] leading-none font-bold tracking-[-0.02em]">
                      {kpi.value}
                      {kpi.unit ? (
                        <span className="ml-[0.25em] text-[0.55em] font-semibold">{kpi.unit}</span>
                      ) : null}
                    </p>
                    <p className="mt-[0.55em] text-[0.68em] font-semibold text-[#b54a00]">
                      {kpi.note}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-[0.9em] flex min-h-0 flex-1 flex-col rounded-[0.8em] bg-white p-[1em] shadow-[0_0.1em_0.5em_rgb(23_27_29/0.07)]">
                <p className="text-[0.8em] font-semibold">Évolution des ventes</p>
                <svg
                  viewBox="0 0 400 120"
                  preserveAspectRatio="none"
                  className="mt-[0.6em] min-h-0 w-full flex-1"
                >
                  <defs>
                    <linearGradient id="dz-chart-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#FF6B00" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#FF6B00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[30, 60, 90].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="400"
                      y1={y}
                      y2={y}
                      stroke="#eceeed"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  <path
                    d="M0 104 C30 98 50 86 80 88 C115 91 135 70 165 72 C195 74 215 82 245 66 C275 50 300 58 330 40 C355 26 375 18 400 8 L400 120 L0 120 Z"
                    fill="url(#dz-chart-fill)"
                  />
                  <path
                    d="M0 104 C30 98 50 86 80 88 C115 91 135 70 165 72 C195 74 215 82 245 66 C275 50 300 58 330 40 C355 26 375 18 400 8"
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="mt-[0.5em] flex justify-between text-[0.6em] text-[#6f7477]">
                  {months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Base */}
        <div className="relative mx-[-5%] h-[1.5em] rounded-b-[1.4em] bg-gradient-to-b from-[#e3e4e5] via-[#b9bcbe] to-[#8f9395] shadow-[0_1.5em_2.5em_-1em_rgb(0_0_0/0.6)]">
          <span className="absolute top-0 left-1/2 h-[0.45em] w-[13%] -translate-x-1/2 rounded-b-[0.6em] bg-[#9da1a3]" />
        </div>
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
