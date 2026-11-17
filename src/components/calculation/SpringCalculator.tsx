'use client';

import { useState, useCallback } from 'react';
import {
  calculate,
  suitableDrums,
  currentName,
  cableDia,
  springLabels,
  type CalcInput,
  type CalcResult,
  type Drum,
} from '@/lib/springEngine';

// ─── Renkler ve ikonlar ───
const SYSTEM_META = {
  'Normal Lift':    { icon: '↑',  color: '#3b82f6', label: 'NL' },
  'Low Headroom':   { icon: '↔',  color: '#8b5cf6', label: 'LH' },
  'High Lift':      { icon: '⬆',  color: '#f59e0b', label: 'HL' },
  'Vertical Lift':  { icon: '⬆⬆', color: '#10b981', label: 'VL' },
} as const;

type SystemType = keyof typeof SYSTEM_META;

const LIFE_COLORS: Record<number, { bg: string; text: string }> = {
  10000: { bg: '#fef3c7', text: '#92400e' },
  15000: { bg: '#dcfce7', text: '#166534' },
  25000: { bg: '#dbeafe', text: '#1e40af' },
  50000: { bg: '#f3e8ff', text: '#6b21a8' },
};

export default function SpringCalculator() {
  // ─── Form state ───
  const [sys, setSys]           = useState<SystemType>('Normal Lift');
  const [w, setW]               = useState('5000');
  const [h, setH]               = useState('5000');
  const [hl, setHl]             = useState('3000');
  const [kgm2, setKgm2]         = useState('10');
  const [qty, setQty]           = useState('2');
  const [manualDrum, setManualDrum] = useState<string>('');

  // ─── Sonuç state ───
  const [result, setResult]     = useState<CalcResult | null>(null);
  const [loading, setLoading]   = useState(false);

  // ─── Tambur listesi (dinamik) ───
  const getDrums = useCallback((): Drum[] => {
    const weight = (parseFloat(w) * parseFloat(h) / 1e6) * parseFloat(kgm2);
    const cable  = cableDia(isNaN(weight) ? 0 : weight);
    return suitableDrums(sys, isNaN(weight) ? 0 : weight, parseFloat(h) || 0, parseFloat(hl) || 0, cable);
  }, [sys, w, h, hl, kgm2]);

  // ─── Hesapla ───
  const handleCalc = () => {
    setLoading(true);
    setTimeout(() => {
      const input: CalcInput = {
        sys,
        w: parseFloat(w) || 0,
        h: parseFloat(h) || 0,
        hl: parseFloat(hl) || 0,
        kgm2: parseFloat(kgm2) || 10,
        qty: parseInt(qty) || 2,
        manualDrum: manualDrum || undefined,
      };
      setResult(calculate(input));
      setLoading(false);
    }, 80);
  };

  const handleReset = () => {
    setSys('Normal Lift');
    setW('5000'); setH('5000'); setHl('3000');
    setKgm2('10'); setQty('2'); setManualDrum('');
    setResult(null);
  };

  const meta = SYSTEM_META[sys];
  const drums = getDrums();
  const labels = springLabels(parseInt(qty) || 2);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", minHeight: '100vh' }}>

      {/* ── TOPBAR ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* KUTEMS Logo Placeholder */}
          <div style={{
            background: '#fff',
            borderRadius: 10,
            padding: '6px 16px',
            fontWeight: 900,
            fontSize: 20,
            color: '#e56b24',
            letterSpacing: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            KUTEMS
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>
              Seksiyonel Kapı Yay Hesaplama Programı
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
              Normal Lift · Low Headroom · High Lift · Vertical Lift
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(229, 107, 36, 0.15)',
          border: '1px solid rgba(229, 107, 36, 0.4)',
          color: '#fb923c',
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: 20,
          letterSpacing: 0.5,
        }}>
          WEB EDITION · v1.13
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' }}>

          {/* ══════════════════════════════════
              SOL: GİRİŞ FORMU
          ══════════════════════════════════ */}
          <div style={{
            background: '#fff',
            borderRadius: 18,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            position: 'sticky',
            top: 88,
          }}>
            {/* Form başlık */}
            <div style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid #f1f5f9',
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>
                Kapı Parametreleri
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Ölçüleri girin, uygun yay sistemi otomatik hesaplanır.
              </div>
            </div>

            <div style={{ padding: '20px 24px' }}>

              {/* Yataklama sistemi */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Yataklama Sistemi</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                  {(Object.keys(SYSTEM_META) as SystemType[]).map(s => {
                    const m = SYSTEM_META[s];
                    const active = sys === s;
                    return (
                      <button
                        key={s}
                        onClick={() => { setSys(s); setManualDrum(''); }}
                        style={{
                          padding: '10px 8px',
                          borderRadius: 10,
                          border: active ? `2px solid ${m.color}` : '2px solid #e2e8f0',
                          background: active ? `${m.color}15` : '#f8fafc',
                          color: active ? m.color : '#64748b',
                          fontWeight: active ? 700 : 500,
                          fontSize: 12,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 14 }}>{m.icon}</span>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ölçüler */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Genişlik (mm)</label>
                  <input
                    type="number" value={w} min={500} max={12000}
                    onChange={e => setW(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Yükseklik (mm)</label>
                  <input
                    type="number" value={h} min={1000} max={12000}
                    onChange={e => setH(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* High Lift alanı */}
              <div style={{
                marginBottom: 16,
                opacity: sys === 'High Lift' ? 1 : 0.35,
                pointerEvents: sys === 'High Lift' ? 'auto' : 'none',
                transition: 'opacity 0.2s',
              }}>
                <label style={labelStyle}>High Lift Yüksekliği (mm)</label>
                <input
                  type="number" value={hl} min={0} max={10000}
                  onChange={e => setHl(e.target.value)}
                  style={inputStyle}
                />
                {sys === 'High Lift' && parseFloat(hl) > parseFloat(h) && (
                  <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                    ⚠ High Lift kapı yüksekliğinden büyük olamaz
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Ağırlık (kg/m²)</label>
                  <input
                    type="number" value={kgm2} min={1} max={50} step={0.1}
                    onChange={e => setKgm2(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Yay Adedi</label>
                  <select value={qty} onChange={e => setQty(e.target.value)} style={inputStyle}>
                    <option value="1">1 Yay</option>
                    <option value="2">2 Yay</option>
                    <option value="3">3 Yay</option>
                    <option value="4">4 Yay</option>
                  </select>
                </div>
              </div>

              {/* Manuel tambur seçimi */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>
                  Tambur Seçimi
                  <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 6 }}>(isteğe bağlı)</span>
                </label>
                <select
                  value={manualDrum}
                  onChange={e => setManualDrum(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">🔄 Otomatik Seçim (Önerilen)</option>
                  {drums.map(d => (
                    <option key={d.Kabeltrommeltype} value={d.Kabeltrommeltype}>
                      {currentName(d.Kabeltrommeltype)} — maks. {d.MaxGewicht} kg / {d.MaxHoogte} mm
                    </option>
                  ))}
                </select>
                {drums.length === 0 && (
                  <div style={{ color: '#f59e0b', fontSize: 11, marginTop: 4 }}>
                    ⚠ Bu parametreler için uygun tambur bulunamadı
                  </div>
                )}
              </div>

              {/* Butonlar */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleCalc}
                  disabled={loading}
                  style={{
                    flex: 1,
                    height: 46,
                    background: loading
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #e56b24 0%, #c75516 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    border: 'none',
                    borderRadius: 12,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(229, 107, 36, 0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                      Hesaplanıyor...
                    </>
                  ) : '⚡ HESAPLA'}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    height: 46,
                    padding: '0 16px',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: 13,
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  Temizle
                </button>
                {result && !result.error && (
                  <button
                    onClick={() => window.print()}
                    style={{
                      height: 46,
                      padding: '0 14px',
                      background: '#f1f5f9',
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: 13,
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      cursor: 'pointer',
                    }}
                  >
                    🖨
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
              SAĞ: SONUÇLAR
          ══════════════════════════════════ */}
          <div>
            {!result && (
              <div style={{
                textAlign: 'center',
                padding: '80px 40px',
                background: '#fff',
                borderRadius: 18,
                border: '1px solid #e2e8f0',
                color: '#94a3b8',
              }}>
                <div style={{ fontSize: 60, marginBottom: 20 }}>⚙️</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#64748b', marginBottom: 8 }}>
                  Hesaplama Bekleniyor
                </div>
                <div style={{ fontSize: 13 }}>
                  Soldaki formu doldurun ve "Hesapla" butonuna basın.
                </div>
              </div>
            )}

            {result?.error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 18,
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
              }}>
                <div style={{ fontSize: 32 }}>⚠️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#991b1b', marginBottom: 6 }}>
                    Hesaplama Yapılamadı
                  </div>
                  <div style={{ color: '#b91c1c', fontSize: 14 }}>{result.error}</div>
                </div>
              </div>
            )}

            {result && !result.error && (
              <>
                {/* ── ÖZET KARTLAR ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                  marginBottom: 20,
                }}>
                  {[
                    { label: 'Kapı Ağırlığı', value: `${result.weight.toFixed(1)} kg`, icon: '⚖️', color: '#3b82f6' },
                    { label: 'Tambur (KUT)', value: currentName(result.drum.Kabeltrommeltype), icon: '🔩', color: meta.color },
                    { label: 'Yay Turu', value: result.turns.toFixed(1), icon: '🔄', color: '#8b5cf6' },
                    { label: 'Moment / Yay', value: `${(result.perTorque / 1000).toFixed(0)} Nm`, icon: '💪', color: '#f59e0b' },
                    { label: 'Rijitlik / Yay', value: `${result.targetRate.toFixed(0)} Nmm/tur`, icon: '📐', color: '#10b981' },
                    { label: 'Halat Çapı', value: `${result.cable} mm`, icon: '🪢', color: '#0891b2' },
                    { label: 'Halat Uzunluğu', value: `${result.cableLength} mm`, icon: '📏', color: '#6366f1' },
                    { label: 'Toplam Rijitlik', value: `${result.totalRate.toFixed(0)} Nmm/tur`, icon: '⚡', color: '#e56b24' },
                  ].map(card => (
                    <div key={card.label} style={{
                      background: '#fff',
                      borderRadius: 14,
                      border: `1px solid ${card.color}22`,
                      padding: '14px 16px',
                      boxShadow: `0 2px 8px ${card.color}10`,
                    }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>{card.icon}</div>
                      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {card.label}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: card.color, marginTop: 3 }}>
                        {card.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── YAY ÇÖZÜMLERİ ── */}
                <div style={{
                  background: '#fff',
                  borderRadius: 18,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    padding: '18px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>
                        Yay Çözümleri
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                        {result.springs.length} alternatif · artan maliyet sıralaması
                      </div>
                    </div>
                    <div style={{
                      background: `${meta.color}22`,
                      border: `1px solid ${meta.color}44`,
                      color: meta.color,
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {meta.label} · {parseInt(qty)} Yay
                    </div>
                  </div>

                  {result.springs.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#64748b', marginBottom: 6 }}>
                        Uygun yay bulunamadı
                      </div>
                      <div style={{ fontSize: 13 }}>
                        Farklı yay adedi veya tambur deneyin.
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {result.springs.map((spring, i) => (
                        <div
                          key={i}
                          style={{
                            border: i === 0
                              ? '2px solid #e56b24'
                              : '1px solid #e2e8f0',
                            borderRadius: 14,
                            overflow: 'hidden',
                            background: i === 0 ? '#fff7f3' : '#fafafa',
                          }}
                        >
                          {/* Satır başlık */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 16px',
                            borderBottom: '1px solid ' + (i === 0 ? '#fde8d8' : '#f1f5f9'),
                          }}>
                            <div style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: i === 0 ? '#e56b24' : '#e2e8f0',
                              color: i === 0 ? '#fff' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: 13,
                              flexShrink: 0,
                            }}>
                              {i === 0 ? '★' : i + 1}
                            </div>
                            <div style={{ flex: 1, display: 'flex', gap: 20 }}>
                              <div>
                                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>TEL ÇAPI × İÇ ÇAP × BOY</div>
                                <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                                  {spring.d.toFixed(2)} × {spring.D} × {spring.L} mm
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>RİJİTLİK</div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: '#475569' }}>
                                  {spring.rate.toFixed(0)} Nmm/tur
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>MOMENT</div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: '#475569' }}>
                                  {(spring.moment / 1000).toFixed(1)} Nm
                                </div>
                              </div>
                              {spring.life && (
                                <div>
                                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>ÇEVRİM</div>
                                  <div style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: LIFE_COLORS[spring.life]?.bg || '#f1f5f9',
                                    color: LIFE_COLORS[spring.life]?.text || '#475569',
                                  }}>
                                    {(spring.life / 1000).toFixed(0)}K
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Yay kartları (sağ/sol) */}
                          <div style={{
                            display: 'flex',
                            gap: 8,
                            padding: '10px 16px',
                            flexWrap: 'wrap',
                          }}>
                            {labels.map((label, li) => (
                              <div
                                key={li}
                                style={{
                                  flex: '1 1 140px',
                                  minWidth: 120,
                                  background: i === 0 ? '#fff' : '#f8fafc',
                                  border: '1px solid ' + (i === 0 ? '#fed7aa' : '#e2e8f0'),
                                  borderRadius: 10,
                                  padding: '10px 14px',
                                }}
                              >
                                <div style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  color: i === 0 ? '#c2410c' : '#64748b',
                                  textTransform: 'uppercase',
                                  letterSpacing: 0.5,
                                  marginBottom: 4,
                                }}>
                                  {label}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                                  {spring.d.toFixed(2)} × {spring.D} × {spring.L}
                                </div>
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                  {spring.rate.toFixed(0)} Nmm/tur
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Mühendislik notu ── */}
                <div style={{
                  marginTop: 16,
                  padding: '14px 20px',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#92400e',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <div>
                    <strong>Mühendislik Notu:</strong> Bu program bir tasarım destek aracıdır.
                    Yaylar yüksek enerji depolayan mekanik bileşenlerdir. Sonuçları yetkili bir
                    mühendisle doğrulayın. Fiyat bilgisi son kullanıcıya gösterilmemektedir.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          body { background: white !important; }
          button { display: none !important; }
        }
        @media (max-width: 900px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Stil sabitleri ──
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: '#374151',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 42,
  padding: '0 12px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  background: '#fff',
  color: '#0f172a',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};
