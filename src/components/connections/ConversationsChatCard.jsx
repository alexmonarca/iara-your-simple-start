import React from "react";
import { LayoutList, MessageCircle } from "lucide-react";

import CollapsibleCard from "./CollapsibleCard";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function ConversationsChatCard({ collapsed, onToggle, onOpenPlansTab, logs = [] }) {
  const orderedLogs = Array.isArray(logs)
    ? [...logs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    : [];

  return (
    <CollapsibleCard
      title="Conversas - Chat"
      description="Resumo e recomendação para gestão centralizada."
      collapsed={collapsed}
      onToggle={onToggle}
      rightSlot={<MessageCircle className="w-4 h-4 text-primary" />}
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="text-xs font-medium text-foreground">Últimas conversas (10)</div>

          {orderedLogs.length === 0 ? (
            <div className="mt-2 text-xs text-muted-foreground">
              Sem registros ainda. Assim que a IA/clientes conversarem, o histórico recente aparece aqui.
            </div>
          ) : (
            <div className="mt-3 space-y-2 max-h-72 overflow-auto chat-scroll pr-1">
              {orderedLogs.map((log) => {
                const isAi = (log?.sender || "").toLowerCase() === "ai";
                const time = formatTime(log?.created_at);
                const phone = log?.customer_phone;
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
                      {!isAi && phone && (
                        <div className="text-[10px] text-muted-foreground mb-1 truncate">{phone}</div>
                      )}
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
          )}
        </div>

        <div className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="flex items-start gap-3">
            <LayoutList className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">Painel Omnichannel</div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Confira <strong className="text-foreground">todas as conversas</strong> e tenha mais controle de quem a IA
                conversa (regras, atendentes e histórico) usando o Painel Omnichannel.
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOpenPlansTab?.()}
              className="h-10 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm inline-flex items-center gap-2"
            >
              Ver Painel Omnichannel
            </button>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground">
          Dica: este histórico é um resumo. Para gestão completa (filtros, atendentes, regras e auditoria), use o Omnichannel.
        </div>
      </div>
    </CollapsibleCard>
  );
}
