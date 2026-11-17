"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getRecentAuditLogs } from "@/lib/firebase/requests";
import { AdminAuditLog } from "@/types/cms";
import { History, Activity, Shield, Calendar, User } from "lucide-react";

export default function AdminAuditPage() {
  const { locale } = useLocale();
  const tr = locale === "tr";

  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getRecentAuditLogs(50);
        setLogs(data);
      } catch (err) {
        console.error("Fetch audit logs error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-blue-600" />
          {tr ? "Yönetici Denetim Günlüğü (Audit Log)" : "Admin Activity & Audit Log"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {tr
            ? "Yönetim panelinde gerçekleştirilen tüm içerik, ürün, kategori ve talep durumu değişikliklerinin geçmişi."
            : "Audit trail of all administrative actions, content updates, and status changes."}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            {tr ? "Denetim kayıtları yükleniyor..." : "Loading audit log..."}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Activity className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              {tr ? "Kayıtlı İşlem Bulunmuyor" : "No Activity Recorded Yet"}
            </h3>
            <p className="text-xs text-slate-400">
              {tr
                ? "Yönetim panelinde ürün veya içerik güncellendikçe denetim kayıtları buraya otomatik olarak düşecektir."
                : "Activity logs will appear here as administrative updates occur."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {log.action}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-blue-600 font-semibold uppercase text-[10px] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                        {log.entityType}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{log.entityId}</span>
                    </div>
                    {log.details && (
                      <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px]">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                  <div className="flex items-center gap-1 justify-end font-semibold text-slate-700 dark:text-slate-300">
                    <User className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    <span>{log.adminEmail || log.adminUid}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    <span>
                      {log.createdAt?.toDate
                        ? log.createdAt.toDate().toLocaleString(tr ? "tr-TR" : "en-US")
                        : "Yeni"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
