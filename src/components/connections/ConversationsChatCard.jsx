import React from "react";
import { LayoutList, MessageCircle } from "lucide-react";

import CollapsibleCard from "./CollapsibleCard";

export default function ConversationsChatCard({ collapsed, onToggle, onOpenPlansTab }) {
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
          <div className="flex items-start gap-3">
            <LayoutList className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">Painel Omnichannel</div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Para ver <strong className="text-foreground">todas as conversas</strong> em um só lugar e ter mais controle
                sobre a IA (regras, atendentes e histórico), recomendamos o Painel Omnichannel.
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
          Em breve, este card pode mostrar um resumo das últimas conversas diretamente aqui.
        </div>
      </div>
    </CollapsibleCard>
  );
}
