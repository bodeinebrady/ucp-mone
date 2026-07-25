import Link from "next/link";

export const metadata = {
  title: "Sean Brady — Hub Monetization",
  description:
    "Monetizing Docker Hub's pull and storage usage — surfacing usage, showing consumption, and giving admins the tools to clean house.",
};

// The brand + footer "Back" link out to the portfolio. If empty they render
// inert (no navigation), per spec.
const PORTFOLIO_URL = "https://portfolio-ten-blue-75.vercel.app/resolvability/";

// Design tokens — single source of truth for the bold design system.
const T = {
  display: "'Tanker', sans-serif",
  sans: "'Cabinet Grotesk', 'Inter', system-ui, sans-serif",
  red: "#EE3F54",
  ink: "#1C1C1C",
  lime: "#B6D81F",
  purple: "#8C4DFF",
  paper: "#fff",
  ease: "cubic-bezier(.22,1,.36,1)",
};

const css = `
.bold-root{
  --display:${T.display};--sans:${T.sans};--red:${T.red};--ink:${T.ink};
  --lime:${T.lime};--purple:${T.purple};--paper:${T.paper};--ease:${T.ease};
  background:var(--paper);color:var(--ink);min-height:100vh;font-family:var(--sans);
  font-weight:500;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.bold-root a{color:inherit;text-decoration:none}
.bold-nav{position:fixed;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px clamp(20px,3vw,46px);background:rgba(255,255,255,.82);backdrop-filter:blur(12px) saturate(1.1);-webkit-backdrop-filter:blur(12px) saturate(1.1);border-bottom:2px solid var(--ink)}
.bold-brand{font-family:var(--display);font-size:clamp(24px,2.2vw,32px);line-height:1;letter-spacing:-.01em;text-transform:uppercase;color:var(--ink)}
.bold-pill{border:2px solid var(--ink);border-radius:99px;padding:12px 26px;font-family:var(--sans);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:13px;background:transparent;color:var(--ink);cursor:pointer;white-space:nowrap;transition:background .2s var(--ease),color .2s var(--ease)}
.bold-pill:hover{background:var(--ink);color:var(--red)}
.bold-wrap{max-width:1440px;margin:0 auto;padding:0 clamp(20px,3vw,46px)}
.bold-hero{padding:clamp(130px,20vh,220px) 0 clamp(48px,8vh,90px)}
.bold-eyebrow{font-family:var(--sans);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:12px;opacity:.55;margin:0 0 clamp(20px,3vh,34px)}
.bold-title{font-family:var(--display);text-transform:uppercase;font-weight:400;line-height:.85;letter-spacing:-.02em;font-size:clamp(52px,9vw,150px);margin:0}
.bold-lead{font-family:var(--sans);font-weight:500;font-size:clamp(17px,1.5vw,22px);line-height:1.4;letter-spacing:-.01em;max-width:44ch;margin:clamp(28px,4vh,44px) 0 0}
.bold-lead b{font-weight:800}
.bold-section{margin-bottom:clamp(40px,7vh,80px)}
.bold-sublabel{font-family:var(--sans);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:12px;opacity:.5;margin:0 0 8px}
.bold-rows{display:flex;flex-direction:column}
.bold-case{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(20px,3vw,48px);align-items:center;padding:clamp(26px,4vh,50px) clamp(4px,1vw,16px);border-top:2px solid var(--ink);color:var(--ink);transition:background .4s var(--ease),color .4s var(--ease)}
.bold-rows .bold-case:last-child{border-bottom:2px solid var(--ink)}
.bold-case:hover{background:var(--ink);color:var(--red)}
.bold-ct{display:block;font-family:var(--display);text-transform:uppercase;font-weight:400;letter-spacing:-.02em;line-height:.85;font-size:clamp(28px,4.4vw,58px);transition:transform .4s var(--ease)}
.bold-case:hover .bold-ct{transform:translateX(18px)}
.bold-cd{font-family:var(--sans);font-weight:500;font-size:14px;line-height:1.5;letter-spacing:-.005em;margin:0;opacity:.85}
@media(max-width:760px){.bold-case{grid-template-columns:1fr;gap:12px}}
.bold-footer{border-top:2px solid var(--ink);margin-top:clamp(60px,10vh,120px);padding:clamp(48px,8vh,90px) clamp(20px,3vw,46px);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;max-width:1440px;margin-inline:auto}
.bold-footer-back{font-family:var(--display);text-transform:uppercase;font-weight:400;letter-spacing:-.02em;line-height:.85;font-size:clamp(28px,4.4vw,58px);display:inline-flex;align-items:center;gap:.3em;color:var(--ink);transition:transform .3s var(--ease)}
.bold-footer-back:hover{transform:translateX(-8px)}
.bold-footer-meta{font-family:var(--sans);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:12px;opacity:.5}
`;

export default function LandingPage() {
  const ext = PORTFOLIO_URL || null;

  return (
    <div className="bold-root">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <nav className="bold-nav">
        {ext ? (
          <a className="bold-brand" href={ext}>
            Sean Brady
          </a>
        ) : (
          <span className="bold-brand">Sean Brady</span>
        )}
      </nav>

      <div className="bold-wrap">
        <header className="bold-hero">
          <p className="bold-eyebrow">Lead Product Designer · Docker Hub · 2024</p>
          <h1 className="bold-title">Hub Monetization</h1>
          <p className="bold-lead">
            Turning Hub&rsquo;s <b>5.5 PB of daily pulls</b> and <b>21 PB of private storage</b>{" "}
            into revenue by surfacing usage, showing consumption, and giving admins tools
            to clean house, without alarming the 97% of users who were never affected.
          </p>
        </header>

        <section className="bold-section">
          <p className="bold-sublabel">Prototypes</p>
          <div className="bold-rows">
            <Link className="bold-case" href="/image-management">
              <span className="bold-ct">Image Management</span>
              <p className="bold-cd">
                Repository storage cleanup with live per-category metrics, suggested
                cleanup, and a dependency-aware multi-select delete flow that updates
                storage in real time.
              </p>
            </Link>
            <Link className="bold-case" href="/usage/pulls">
              <span className="bold-ct">Usage · Pulls</span>
              <p className="bold-cd">
                A pull analytics dashboard — KPI strip, pulls over time, and top
                repositories &amp; users, with interactive hover tooltips across every
                chart.
              </p>
            </Link>
          </div>
        </section>
      </div>

      <footer className="bold-footer">
        {ext ? (
          <a className="bold-footer-back" href={ext}>
            ← Back
          </a>
        ) : (
          <span className="bold-footer-back">← Back</span>
        )}
        <span className="bold-footer-meta">Sean Brady · Hub Monetization · 2024</span>
      </footer>
    </div>
  );
}
