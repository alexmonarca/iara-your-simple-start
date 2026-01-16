import { useEffect, useMemo, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const Index = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty("--mx", `${Math.round(x)}px`);
        el.style.setProperty("--my", `${Math.round(y)}px`);
      });
    };

    el.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
    };
  }, [reduceMotion]);

  return (
    <div ref={ref} className="min-h-screen bg-hero">
      <header className="container pt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="iara-surface shadow-elevated grid h-10 w-10 place-items-center rounded-xl">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg">IARA</p>
              <p className="text-sm text-muted-foreground">Projeto em branco</p>
            </div>
          </div>

          <Button variant="outline" className="rounded-full">
            Documentação
          </Button>
        </div>
      </header>

      <main className="container pb-16 pt-14">
        <section className="mx-auto max-w-3xl">
          <div className="iara-surface shadow-elevated rounded-2xl p-8 sm:p-10">
            <h1 className="text-balance font-display text-5xl leading-[0.95] sm:text-6xl">
              IARA
            </h1>
            <p className="text-balance mt-5 text-lg text-muted-foreground">
              Um ponto de partida simples e bonito — pronto para você criar páginas, rotas e componentes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="hero" size="lg" className="rounded-full">
                Começar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button variant="secondary" size="lg" className="rounded-full">
                Ver exemplo
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { title: "Rápido", desc: "Estrutura mínima para iterar." },
                { title: "Consistente", desc: "Design system com tokens." },
                { title: "Responsivo", desc: "Funciona bem no mobile." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border bg-background/40 p-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Dica: edite esta página em <code className="rounded bg-background/50 px-2 py-1">src/pages/Index.tsx</code>.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;

