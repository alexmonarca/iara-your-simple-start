import React, { useMemo, useState } from "react";
import { RefreshCw, Save, DollarSign } from "lucide-react";

export default function AdminPricingOverridePanel({ supabaseClient, adminEmail }) {
  const [userId, setUserId] = useState("");
  const [overrideTotal, setOverrideTotal] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(null);

  const canLoad = useMemo(() => String(userId).trim().length > 10, [userId]);
  const canSave = useMemo(() => {
    const v = Number(overrideTotal);
    return canLoad && Number.isFinite(v) && v > 0;
  }, [canLoad, overrideTotal]);

  const handleLoad = async () => {
    if (!supabaseClient || !canLoad) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: qErr } = await supabaseClient
        .from("subscriptions")
        .select("user_id, plan_type, status, addons")
        .eq("user_id", userId.trim())
        .maybeSingle();
      if (qErr) throw qErr;
      setLoaded(data || null);
      if (data?.addons?.override_total) setOverrideTotal(String(data.addons.override_total));
    } catch (e) {
      setError(e?.message || "Erro ao carregar assinatura.");
      setLoaded(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!supabaseClient || !canSave) return;
    setSaving(true);
    setError("");
    try {
      const v = Number(overrideTotal);
      const existingAddons = (loaded?.addons && typeof loaded.addons === "object") ? loaded.addons : {};
      const nextAddons = {
        ...existingAddons,
        override_total: v,
        override_notes: notes || null,
        override_updated_at: new Date().toISOString(),
        override_updated_by: adminEmail || null,
      };

      const { error: upErr } = await supabaseClient
        .from("subscriptions")
        .upsert(
          {
            user_id: userId.trim(),
            plan_type: loaded?.plan_type ?? "trial_7_days",
            status: loaded?.status ?? "active",
            addons: nextAddons,
          },
          { onConflict: "user_id" }
        );

      if (upErr) throw upErr;
      setLoaded((prev) => ({ ...(prev || {}), addons: nextAddons }));
      setNotes("");
    } catch (e2) {
      setError(e2?.message || "Erro ao salvar override.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Override de valor contratado (fail-safe)</h3>
        </div>
        <button
          type="button"
          onClick={handleLoad}
          disabled={!canLoad || loading}
          className="text-xs px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Carregar
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">UUID do usuário</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ex: 2d7c..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 outline-none transition-all text-sm"
            />
            {loaded && (
              <p className="text-[10px] text-gray-500 mt-1">
                Plano: <span className="text-gray-300">{loaded.plan_type || "-"}</span> • Status:{" "}
                <span className="text-gray-300">{loaded.status || "-"}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Override total (R$)</label>
            <input
              type="number"
              min={1}
              value={overrideTotal}
              onChange={(e) => setOverrideTotal(e.target.value)}
              placeholder="Ex: 150"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 outline-none transition-all text-sm"
            />
            <p className="text-[10px] text-gray-500 mt-1">Se preenchido, substitui o total exibido no painel.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Observação (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Motivo do ajuste manual..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 outline-none transition-all text-sm min-h-[80px]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSave || saving}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              !canSave || saving
                ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600"
                : "bg-orange-400 hover:bg-orange-500 text-white shadow-md shadow-orange-500/20 border-b-2 border-orange-600 active:border-b-0 active:translate-y-0.5"
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar override"}
          </button>
        </div>
      </form>

      {loaded?.addons?.override_total && (
        <div className="mt-4 text-xs text-gray-400">
          Override atual: <span className="text-orange-300 font-bold">R$ {loaded.addons.override_total}</span>
        </div>
      )}
    </div>
  );
}
