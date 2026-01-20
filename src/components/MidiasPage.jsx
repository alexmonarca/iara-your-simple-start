import React from "react";
import { Image as ImageIcon, Sparkles } from "lucide-react";

export default function MidiasPage({ onOpenPlansTab }) {
  return (
    <main className="max-w-5xl mx-auto animate-in fade-in">
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">MídIAs</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              IA de Gestão de Mídias (posts, criativos e rotinas). Em breve.
            </p>
          </div>

          {onOpenPlansTab && (
            <button
              type="button"
              onClick={onOpenPlansTab}
              className="h-10 px-4 rounded-full border border-border bg-background/40 text-foreground hover:bg-background/60 transition-colors text-sm"
            >
              Ver planos / Upgrade
            </button>
          )}
        </div>
      </header>

      <section className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-[0_0_0_1px_hsl(var(--border))] p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl border border-border bg-background/40 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">Página em construção</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Vamos concentrar aqui tudo que for da <strong className="text-foreground">IA Gestor de Mídias</strong>,
              com tutoriais e fluxos separados do chat.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Em breve: calendário editorial, templates, geração de criativos e aprovação.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
