import React, { useMemo, useState } from "react";
import { Sparkles, Send } from "lucide-react";

/**
 * Primeira tela (estilo Gemini/Lovable): pergunta + input central.
 * Mantém a lógica simples: ao enviar, dispara webhook (se configurado).
 */
export default function HomeAIStart({
  user,
  webhookUrl,
  onOpenTrainTab,
  planName,
  onOpenPlansTab,
  onOpenWhatsAppConnect,
  whatsappStatus,
  aiStatus,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const send = async () => {
    if (!canSend) return;
    setSending(true);
    setError("");

    try {
      if (webhookUrl) {
        const resp = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "user_message",
            source: "home_ai_start",
            user_id: user?.id ?? null,
            email: user?.email ?? null,
            message: input.trim(),
            created_at: new Date().toISOString(),
          }),
        });

        if (!resp.ok) {
          const t = await resp.text().catch(() => "");
          throw new Error(t || `Webhook retornou ${resp.status}`);
        }
      }

      setInput("");
    } catch (e) {
      setError(e?.message || "Falha ao enviar para o webhook.");
    } finally {
      setSending(false);
    }
  };

  const whatsappConnected = whatsappStatus === "connected";
  const aiActive = aiStatus === "active";

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Olá! Aqui é a IARA!</span>
              </div>
              <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                Bóra Treinar essa IA?
              </h1>
            </div>

            {onOpenPlansTab && (
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="text-foreground/90">{planName || "Plano"}</span>
                  <span className="opacity-60">|</span>
                  <button
                    type="button"
                    onClick={onOpenPlansTab}
                    className="underline underline-offset-4 text-foreground hover:text-primary transition-colors"
                  >
                    Fazer upgrade
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card/50 px-4 py-3">
              <div className="text-xs text-muted-foreground">Status do WhatsApp</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={
                    "inline-flex items-center px-2 py-1 rounded-full text-xs border " +
                    (whatsappConnected
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-destructive/10 text-destructive border-destructive/30")
                  }
                >
                  {whatsappConnected ? "Conectado" : "Desconectado"}
                </span>
                {!whatsappConnected && (
                  <span className="text-xs text-muted-foreground">Conecte para ativar a IA</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 px-4 py-3">
              <div className="text-xs text-muted-foreground">Status da IA</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={
                    "inline-flex items-center px-2 py-1 rounded-full text-xs border " +
                    (aiActive
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-muted/30 text-muted-foreground border-border")
                  }
                >
                  {aiActive ? "Ativa" : "Pausada"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-[0_0_0_1px_hsl(var(--border))]">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ensine tudo sobre seu negócio aqui!"
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/80 outline-none text-base md:text-lg"
                  aria-label="Mensagem para a IARA"
                />
              </div>

              <button
                type="button"
                onClick={send}
                disabled={!canSend}
                className="inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 text-sm text-destructive border border-destructive/30 bg-destructive/10 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onOpenTrainTab}
                className="px-4 py-2 rounded-full border border-border bg-background/40 text-foreground hover:bg-background/60 transition-colors text-sm"
              >
                Treinar IA
              </button>

              <button
                type="button"
                onClick={onOpenWhatsAppConnect}
                className="px-4 py-2 rounded-full border border-border bg-background/40 text-foreground hover:bg-background/60 transition-colors text-sm inline-flex items-center gap-2"
              >
                <span>Conectar WhatsApp</span>
                <span
                  className={
                    "text-[10px] px-2 py-0.5 rounded-full border " +
                    (whatsappConnected
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-muted/30 text-muted-foreground border-border")
                  }
                >
                  {whatsappConnected ? "Conectado" : "Offline"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-4 py-2 rounded-full border border-border bg-background/40 text-foreground hover:bg-background/60 transition-colors text-sm"
              >
                Criar arte
              </button>
            </div>

            {!webhookUrl && (
              <p className="mt-4 text-xs text-muted-foreground">
                Dica: defina <code className="text-foreground">VITE_N8N_AI_WEBHOOK_URL</code> no Vercel para o envio ao n8n funcionar.
              </p>
            )}
          </div>
        </div>

        {isUpgradeModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl">
              <div className="p-5">
                <div className="text-lg font-semibold text-foreground">Recurso disponível apenas no upgrade</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Para usar <strong className="text-foreground">Criar arte</strong>, é necessário fazer upgrade do seu plano.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-border bg-background/40 text-foreground hover:bg-background/60 transition-colors text-sm"
                  >
                    Fechar
                  </button>
                  {onOpenPlansTab && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUpgradeModalOpen(false);
                        onOpenPlansTab();
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground transition-colors text-sm"
                    >
                      Ver Assinatura
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

