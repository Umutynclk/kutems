"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { submitCustomerRequest } from "@/lib/firebase/requests";
import { RequestType } from "@/types/cms";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { X, Send, CheckCircle2, Tag, Building2, Phone, Mail, User } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productContext?: {
    id?: string;
    code?: string;
    articleNumber?: string;
    name?: string;
    type?: string;
  };
  defaultType?: RequestType;
}

export default function InquiryModal({
  isOpen,
  onClose,
  productContext,
  defaultType = "product_inquiry",
}: InquiryModalProps) {
  const { locale, t } = useLocale();
  const tr = locale === "tr";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState<RequestType>(defaultType);
  const [honeypot, setHoneypot] = useState(""); // Anti-spam
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(tr ? "Lütfen adınızı ve soyadınızı girin." : "Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError(tr ? "Geçerli bir e-posta adresi girin." : "Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
      const reqId = await submitCustomerRequest({
        requestType,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        message: message.trim() || undefined,
        productId: productContext?.id,
        productCode: productContext?.code,
        articleNumber: productContext?.articleNumber,
        productName: productContext?.name,
        sourcePage: currentUrl,
        locale: locale as "tr" | "en",
        honeypot,
      });

      setSuccessId(reqId);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(
        tr
          ? "Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
          : "Failed to send request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccessId(null);
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setMessage("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {productContext
                  ? tr ? "Ürün Bilgi & Teklif Talebi" : "Product Inquiry & Quote"
                  : tr ? "Teklif & İletişim Talebi" : "Request a Quote / Contact"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {productContext?.name || (tr ? "KUTEMS Profesyonel Destek" : "KUTEMS Professional Support")}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successId ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {tr ? "Talebiniz Alındı!" : "Request Received!"}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                {tr
                  ? "Talebiniz yetkili ekibimize başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz."
                  : "Your inquiry has been successfully delivered. Our team will contact you shortly."}
              </p>
              <div className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6">
                {tr ? "Takip No:" : "Request ID:"} {successId}
              </div>
              <div>
                <Button onClick={resetAndClose} variant="primary" className="w-full">
                  {tr ? "Tamam" : "Done"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Context Banner */}
              {productContext && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      {tr ? "İlgili Ürün:" : "Associated Product:"}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {productContext.name}
                    </span>
                  </div>
                  {productContext.articleNumber && (
                    <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded font-mono font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                      {productContext.articleNumber}
                    </span>
                  )}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Honeypot hidden input */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="inq-name"
                  label={tr ? "Ad Soyad *" : "Full Name *"}
                  placeholder={tr ? "Adınız Soyadınız" : "Your Name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
                <Input
                  id="inq-email"
                  type="email"
                  label={tr ? "E-posta Adresi *" : "Email Address *"}
                  placeholder={tr ? "ornek@sirket.com" : "example@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="inq-phone"
                  label={tr ? "Telefon" : "Phone"}
                  placeholder="+90 5XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <Input
                  id="inq-company"
                  label={tr ? "Firma Adı" : "Company Name"}
                  placeholder={tr ? "Şirketiniz" : "Company"}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  leftIcon={<Building2 className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {tr ? "Talep Türü" : "Request Type"}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { val: "product_inquiry", label: tr ? "Ürün Bilgisi" : "Product Inquiry" },
                    { val: "quote", label: tr ? "Fiyat Teklifi" : "Price Quote" },
                    { val: "contact", label: tr ? "Genel İletişim" : "General Contact" },
                    { val: "other", label: tr ? "Diğer" : "Other" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setRequestType(opt.val as RequestType)}
                      className={`py-2 px-3 rounded-xl border text-center transition-colors font-medium ${
                        requestType === opt.val
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="inq-message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {tr ? "Mesajınız / Talep Detayları" : "Message / Details"}
                </label>
                <textarea
                  id="inq-message"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    tr
                      ? "İhtiyacınız olan adet, montaj veya teknik detayları belirtebilirsiniz..."
                      : "Describe your quantity, mounting or technical requirements..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  <Send className="w-4 h-4" />
                  {loading
                    ? tr ? "Gönderiliyor..." : "Sending..."
                    : tr ? "Talebi Gönder" : "Submit Request"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
