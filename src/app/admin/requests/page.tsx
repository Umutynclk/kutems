"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { subscribeToRequests, updateRequestStatus, logAdminActivity } from "@/lib/firebase/requests";
import { CustomerRequest, RequestStatus, RequestType } from "@/types/cms";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Inbox,
  Search,
  Filter,
  Download,
  Calendar,
  Mail,
  Phone,
  Building2,
  Tag,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Archive,
  Save,
  X,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminRequestsPage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tr = locale === "tr";

  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<CustomerRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Real-time listener
  useEffect(() => {
    const unsub = subscribeToRequests((data) => {
      setRequests(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Check URL query param for specific ID
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && requests.length > 0) {
      const found = requests.find((r) => r.id === id || r.requestId === id);
      if (found) {
        setSelectedReq(found);
        setInternalNote(found.internalNotes || "");
      }
    }
  }, [searchParams, requests]);

  // Filter & Search
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.requestId?.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.articleNumber?.toLowerCase().includes(q) ||
        r.productName?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchQuery]);

  const handleSelect = (req: CustomerRequest) => {
    setSelectedReq(req);
    setInternalNote(req.internalNotes || "");
  };

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (!selectedReq) return;
    try {
      await updateRequestStatus(selectedReq.id, newStatus);
      await logAdminActivity({
        adminUid: user?.uid || "admin",
        adminEmail: user?.email || undefined,
        action: `Talep durumu '${newStatus}' olarak güncellendi`,
        entityType: "request",
        entityId: selectedReq.requestId,
        details: `Müşteri: ${selectedReq.name} (${selectedReq.email})`,
      });
      setSelectedReq((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err) {
      console.error("Status update error:", err);
      alert(tr ? "Durum güncellenirken hata oluştu." : "Failed to update status.");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedReq) return;
    setSavingNote(true);
    try {
      await updateRequestStatus(selectedReq.id, selectedReq.status, internalNote);
      await logAdminActivity({
        adminUid: user?.uid || "admin",
        adminEmail: user?.email || undefined,
        action: "Talebe dahili not eklendi/güncellendi",
        entityType: "request",
        entityId: selectedReq.requestId,
      });
      setSelectedReq((prev) => (prev ? { ...prev, internalNotes: internalNote } : null));
      alert(tr ? "Not kaydedildi." : "Notes saved.");
    } catch (err) {
      console.error("Notes save error:", err);
      alert(tr ? "Not kaydedilemedi." : "Failed to save notes.");
    } finally {
      setSavingNote(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (requests.length === 0) return;
    const headers = [
      "Request ID",
      "Type",
      "Status",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Article Number",
      "Product Name",
      "Message",
      "Internal Notes",
      "Date",
    ];

    const rows = filteredRequests.map((r) => [
      r.requestId,
      r.requestType,
      r.status,
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.company || "").replace(/"/g, '""')}"`,
      `"${(r.articleNumber || "").replace(/"/g, '""')}"`,
      `"${(r.productName || "").replace(/"/g, '""')}"`,
      `"${(r.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${(r.internalNotes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      r.createdAt?.toDate ? r.createdAt.toDate().toISOString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kutems-talepler-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-blue-600" />
            {tr ? "Gelen Talepler & Teklifler" : "Incoming Requests & Quotes"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "Siteden gönderilen tüm ürün ve fiyat talepleri gerçek zamanlı burada listelenir."
              : "All customer inquiries and quote requests submitted through the website appear here in real time."}
          </p>
        </div>

        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="w-4 h-4" />
          {tr ? "CSV Dışa Aktar" : "Export CSV"}
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {[
            { id: "all", label: tr ? "Tümü" : "All", count: requests.length },
            { id: "new", label: tr ? "Yeni" : "New", count: requests.filter((r) => r.status === "new").length },
            { id: "in_review", label: tr ? "İnceleniyor" : "In Review", count: requests.filter((r) => r.status === "in_review").length },
            { id: "responded", label: tr ? "Yanıtlandı" : "Responded", count: requests.filter((r) => r.status === "responded").length },
            { id: "closed", label: tr ? "Kapatıldı" : "Closed", count: requests.filter((r) => r.status === "closed").length },
            { id: "spam", label: tr ? "Spam" : "Spam", count: requests.filter((r) => r.status === "spam").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder={tr ? "Talep No, isim, e-posta veya parça no..." : "Search ID, name, email, article..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Main Grid: List + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Requests Table / List */}
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${selectedReq ? "lg:col-span-2" : "lg:col-span-3"}`}>
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
              {tr ? "Talepler yükleniyor..." : "Loading inquiries..."}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                {tr ? "Kayıt bulunamadı" : "No requests found"}
              </h3>
              <p className="text-xs text-slate-500">
                {tr ? "Seçilen filtre veya aramaya uygun talep bulunmuyor." : "No requests match the selected filter or search."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Talep No</th>
                    <th className="py-3 px-4">Müşteri</th>
                    <th className="py-3 px-4">Tür</th>
                    <th className="py-3 px-4">İlgili Ürün</th>
                    <th className="py-3 px-4">Tarih</th>
                    <th className="py-3 px-4">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRequests.map((r) => {
                    const isSelected = selectedReq?.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => handleSelect(r)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-50/70 dark:bg-blue-900/30"
                            : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {r.requestId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {r.name}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">{r.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-slate-600 dark:text-slate-400">
                            {r.requestType?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {r.articleNumber ? (
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                              {r.articleNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          {r.createdAt?.toDate
                            ? r.createdAt.toDate().toLocaleDateString(tr ? "tr-TR" : "en-US")
                            : "Yeni"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.status === "new"
                                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                : r.status === "in_review"
                                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                                : r.status === "responded"
                                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                                : r.status === "spam"
                                ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Selected Request Detail View */}
        {selectedReq && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 relative animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  {tr ? "Talep Detayı" : "Inquiry Detail"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedReq.requestId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                {tr ? "Durumu Güncelle" : "Update Status"}
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                {[
                  { id: "new", label: tr ? "Yeni" : "New", color: "hover:bg-blue-50 text-blue-600 border-blue-200" },
                  { id: "in_review", label: tr ? "İnceleniyor" : "In Review", color: "hover:bg-amber-50 text-amber-600 border-amber-200" },
                  { id: "responded", label: tr ? "Yanıtlandı" : "Responded", color: "hover:bg-green-50 text-green-600 border-green-200" },
                  { id: "closed", label: tr ? "Kapatıldı" : "Closed", color: "hover:bg-slate-50 text-slate-600 border-slate-200" },
                  { id: "spam", label: tr ? "Spam" : "Spam", color: "hover:bg-red-50 text-red-600 border-red-200" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStatusChange(s.id as RequestStatus)}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                      selectedReq.status === s.id
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${selectedReq.email}?subject=KUTEMS Talep No: ${selectedReq.requestId}`}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline truncate"
                >
                  {selectedReq.email}
                </a>
              </div>
              {selectedReq.phone && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`tel:${selectedReq.phone}`} className="hover:underline">
                    {selectedReq.phone}
                  </a>
                </div>
              )}
              {selectedReq.company && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedReq.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {selectedReq.createdAt?.toDate
                    ? selectedReq.createdAt.toDate().toLocaleString(tr ? "tr-TR" : "en-US")
                    : "Yeni"}
                </span>
              </div>
            </div>

            {/* Associated Product if any */}
            {selectedReq.articleNumber && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs space-y-1">
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">
                  {tr ? "Talep Edilen Ürün" : "Associated Product"}
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedReq.productName}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                    Art. {selectedReq.articleNumber}
                  </span>
                  {selectedReq.sourcePage && (
                    <a
                      href={selectedReq.sourcePage}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      {tr ? "Ürün Sayfasına Git" : "Open Page"}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Customer Message */}
            {selectedReq.message && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  {tr ? "Müşteri Notu / Mesajı" : "Customer Message"}
                </label>
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedReq.message}
                </div>
              </div>
            )}

            {/* Private Internal Notes (Admins Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {tr ? "Dahili Yönetici Notları (Ziyaretçiye Görünmez)" : "Internal Notes (Private)"}
              </label>
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder={tr ? "Bu talep için dahili işlem notu girin..." : "Enter internal notes for this request..."}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm" onClick={handleSaveNotes} loading={savingNote}>
                  <Save className="w-3.5 h-3.5" />
                  {tr ? "Notu Kaydet" : "Save Notes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
