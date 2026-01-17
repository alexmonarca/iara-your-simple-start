import React, { useEffect, useMemo, useState } from "react";
import { Clock, Gift } from "lucide-react";

function getWhatsAppLink(phoneE164, text) {
  const digits = String(phoneE164 || "").replace(/\D/g, "");
  if (!digits) return "";
  const encoded = encodeURIComponent(text || "");
  return `https://wa.me/${digits}?text=${encoded}`;
}

export default function TrialBanner({
  planName,
  endsAt,
  onExpire,
  isExpired,
  trialSource,
  supportWhatsApp,
}) {
  const [timeLeft, setTimeLeft] = useState("");

  const endDate = useMemo(() => {
    if (!endsAt) return null;
    const d = new Date(endsAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [endsAt]);

  useEffect(() => {
    if (!endDate) return;

    const tick = () => {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expirado");
        return true;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (totalDays > 0) setTimeLeft(`${totalDays}d ${hours}h ${minutes}m`);
      else setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

      return false;
    };

    // primeira renderização
    const expiredNow = tick();
    if (expiredNow) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      const expired = tick();
      if (expired) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, onExpire]);

  const showExpired = isExpired || timeLeft === "Expirado";

  const requestMoreHoursLink = getWhatsAppLink(
    supportWhatsApp,
    "Olá! Meu Trial Grátis expirou. Pode liberar mais algumas horas para eu testar? Vi que ganho um brinde 🙂"
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_-20px_hsl(var(--primary)/0.35)]">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Plano Atual</p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">{planName}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Seu plano é grátis{trialSource === "custom" ? " (trial customizado)" : ""}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span
            className={
              "font-mono text-lg font-semibold " +
              (showExpired ? "text-destructive" : "text-foreground")
            }
            aria-label="Tempo restante do trial"
          >
            {timeLeft || "—"}
          </span>
        </div>
      </header>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Tempo restante</p>
          <div
            className={
              "font-mono leading-none tracking-tight " +
              (showExpired
                ? "text-destructive"
                : "text-foreground")
            }
            style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
          >
            {timeLeft || "—"}
          </div>
        </div>

        {showExpired && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/30 bg-background">
                <Gift className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Seu trial expirou.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Solicite mais algumas horas para testar e ganhe um brinde.
                </p>
              </div>
            </div>

            {requestMoreHoursLink ? (
              <a
                href={requestMoreHoursLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Pedir mais horas no WhatsApp
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">
                Configure um número de suporte para ativar o botão de WhatsApp.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
