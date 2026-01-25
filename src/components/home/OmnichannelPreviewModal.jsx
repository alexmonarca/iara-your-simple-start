import React, { useMemo, useState } from "react";
import { Instagram, Lock, MessageCircle, X } from "lucide-react";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function groupByPhone(logs) {
  const map = new Map();
  for (const log of Array.isArray(logs) ? logs : []) {
    const phone = log?.customer_phone || "Sem telefone";
    if (!map.has(phone)) map.set(phone, []);
    map.get(phone).push(log);
  }

  const groups = Array.from(map.entries()).map(([phone, items]) => {
    const ordered = [...items].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const last = ordered[ordered.length - 1];
    return { phone, items: ordered, lastAt: last?.created_at };
  });

  // Mais recentes primeiro
  groups.sort((a, b) => new Date(b.lastAt || 0) - new Date(a.lastAt || 0));
  return groups;
}

export default function OmnichannelPreviewModal({
  open,
  onClose,
  onUpgrade,
  logs = [],
  locked = true,
}) {
  const [activeTab, setActiveTab] = useState("whatsapp");

  const groups = useMemo(() => groupByPhone(logs).slice(0, 6), [logs]);

  if (!open) return null;

  const requestUpgrade = () => {
    if (onUpgrade) onUpgrade();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">Prévia</div>
            <h2 className="text-xl font-semibold text-foreground truncate">Painel Omnichannel</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Últimas conversas + controles avançados (disponível no upgrade).
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 inline-flex items-center justify-center rounded-2xl border border-border bg-background/40 text-foreground hover:bg-background/60 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs (WhatsApp real / Instagram fake) */}
        <div className="px-5 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className={
                "h-10 px-4 rounded-full border text-sm inline-flex items-center gap-2 transition-colors " +
                (activeTab === "whatsapp"
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-background/40 border-border text-muted-foreground hover:bg-background/60")
              }
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={() => {
                // Aba fake com cadeado
                if (locked) return requestUpgrade();
                setActiveTab("instagram");
              }}
              className={
                "h-10 px-4 rounded-full border text-sm inline-flex items-center gap-2 transition-colors " +
                (activeTab === "instagram"
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-background/40 border-border text-muted-foreground hover:bg-background/60")
              }
            >
              <Instagram className="w-4 h-4" />
              Instagram
              <span className="ml-1 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-border bg-background/40 text-muted-foreground">
                <Lock className="w-3 h-3" />
                Upgrade
              </span>
            </button>
          </div>
        </div>

        <div className="p-5">
          {activeTab !== "whatsapp" ? (
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">Mensagens do Instagram (prévia)</div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Esta aba é uma simulação do Painel Omnichannel. Para acessar Instagram + regras + atendentes,
                    faça upgrade.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={requestUpgrade}
                  className="h-10 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                >
                  Ver planos / Upgrade
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-foreground">Últimas conversas</div>
                  <button
                    type="button"
                    onClick={requestUpgrade}
                    className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-border bg-background/40 text-muted-foreground hover:bg-background/60"
                    title="Disponível no upgrade"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Pausar IA por conversa
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Clique numa conversa para ver histórico completo e controlar atendimento (no Omnichannel).
                </p>
              </div>

              {groups.length === 0 ? (
                <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                  Sem registros ainda. Assim que a IA/clientes conversarem, o histórico recente aparece aqui.
                </div>
              ) : (
                <div className="space-y-3 max-h-[55vh] overflow-auto chat-scroll pr-1">
                  {groups.map((g) => {
                    const preview = g.items.slice(-4);
                    return (
                      <div key={g.phone} className="rounded-2xl border border-border bg-background/40 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{g.phone}</div>
                            <div className="mt-0.5 text-[11px] text-muted-foreground">
                              Última atividade: {formatTime(g.lastAt) || "—"}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={requestUpgrade}
                            className="h-9 px-3 rounded-full border border-border bg-background/40 text-muted-foreground text-xs inline-flex items-center gap-2 hover:bg-background/60"
                            title="Disponível no upgrade"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Pausar IA
                          </button>
                        </div>

                        <div className="mt-3 space-y-2">
                          {preview.map((log) => {
                            const isAi = (log?.sender || "").toLowerCase() === "ai";
                            const time = formatTime(log?.created_at);
                            return (
                              <div
                                key={log?.id ?? `${log?.created_at}-${log?.message_content}`}
                                className={"flex " + (isAi ? "justify-end" : "justify-start")}
                              >
                                <div
                                  className={
                                    "max-w-[85%] rounded-2xl px-3 py-2 border " +
                                    (isAi
                                      ? "bg-primary/10 border-primary/20 text-foreground"
                                      : "bg-background/60 border-border text-foreground")
                                  }
                                >
                                  <div className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                                    {log?.message_content || "—"}
                                  </div>
                                  {time && (
                                    <div className={"mt-1 text-[10px] text-muted-foreground " + (isAi ? "text-right" : "text-left")}>
                                      {time}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={requestUpgrade}
                            className="h-10 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                          >
                            Abrir no Omnichannel
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">Desbloqueie o Painel Omnichannel</div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Tenha filtros, regras por atendente, auditoria e visão unificada (WhatsApp + Instagram).
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={requestUpgrade}
                    className="h-10 px-4 rounded-full border border-border bg-background/40 text-foreground hover:bg-background/60 transition-colors text-sm"
                  >
                    Ver planos / Upgrade
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
