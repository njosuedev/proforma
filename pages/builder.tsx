import React, { useEffect, useRef, useState } from "react";

type FormData = {
  proformaNo: string;
  dateIssued: string;
  salesperson: string;
  fullName: string;
  idNo: string;
  tin: string;
  phone: string;
  address: string;
  email: string;
  country: string;
  company: string;
  make: string;
  model: string;
  year: string;
  colour: string;
  mileage: string;
  fuelType: string;
  chassis: string;
  transmission: string;
  condition: string;
  stockNo: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  paymentMethod: string;
  currency: string;
  deposit: string;
  balanceDue: string;
  companyName: string;
  companyTin: string;
  companyPhone: string;
  companyEmail: string;
  companyCity: string;
  companyAddress: string;
  accentColor: string;
  headingsColor: string;
  logoDataUrl: string;
  // new fields for seller signature and stamp
  sellerRepName: string;
  sellerSignatureDataUrl: string;
  sellerStampDataUrl: string;
  terms: string;
};

const defaultData: FormData = {
  proformaNo: "PRO-010",
  dateIssued: new Date().toISOString().slice(0, 10),
  salesperson: "MR CARS Ltd",
  fullName: "IRANKUNDA JEAN MARIE",
  idNo: "1199380100814283",
  tin: "156763105",
  phone: "+250788787358",
  address: "Kigali, Rwanda",
  email: "jmvyame@gmail.com",
  country: "RWANDA",
  company: "N/A",
  make: "AION Y plus",
  model: "AION Y plus",
  year: "2022",
  colour: "N/A",
  mileage: "N/A",
  fuelType: "Full electric",
  chassis: "LNAJDAB21N5064455",
  transmission: "AUTOMATIC",
  condition: "Used",
  stockNo: "010",
  quantity: "1",
  unitPrice: "25000000",
  totalPrice: "25000000",
  paymentMethod: "Cash",
  currency: "FRW",
  deposit: "300000",
  balanceDue: "24700000",
  companyName: "MR CARS Ltd",
  companyTin: "146479150",
  companyPhone: "+250787615702",
  companyEmail: "mrcarsltd5@gmail.com",
  companyCity: "KIGALI CITY - KICUKIRO",
  companyAddress: "Kigali, Rwanda",
  accentColor: "#8bc34a",
  headingsColor: "#0b3b61",
  logoDataUrl: "",
  // seller signature/stamp defaults
  sellerRepName: "Authorized Dealer Representative",
  sellerSignatureDataUrl: "",
  sellerStampDataUrl: "",
  // buyer signature
  buyerSignatureDataUrl: "",
  terms: "",
};

export default function Builder(): JSX.Element {
  const [data, setData] = useState<FormData>(defaultData);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("proforma_auth");
    if (!t) {
      window.location.href = "/login";
    }
    const saved = localStorage.getItem("proforma_data");
    if (saved) {
      try {
        setData((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = JSON.stringify({
      companyName: data.companyName,
      companyTin: data.companyTin,
      companyPhone: data.companyPhone,
      companyEmail: data.companyEmail,
      companyCity: data.companyCity,
      companyAddress: data.companyAddress,
      accentColor: data.accentColor,
      headingsColor: data.headingsColor,
      logoDataUrl: data.logoDataUrl,
      sellerRepName: data.sellerRepName,
      sellerSignatureDataUrl: data.sellerSignatureDataUrl,
      sellerStampDataUrl: data.sellerStampDataUrl,
      buyerSignatureDataUrl: data.buyerSignatureDataUrl,
      terms: data.terms,
    });
    localStorage.setItem("proforma_data", s);
  }, [
    data.companyName,
    data.companyTin,
    data.companyPhone,
    data.companyEmail,
    data.companyCity,
    data.companyAddress,
    data.accentColor,
    data.headingsColor,
    data.logoDataUrl,
    data.sellerRepName,
    data.sellerSignatureDataUrl,
    data.sellerStampDataUrl,
    data.buyerSignatureDataUrl,
    data.terms,
  ]);

  function update<K extends keyof FormData>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      update("logoDataUrl", String(reader.result || ""));
    };
    reader.readAsDataURL(f);
  }

  function onSellerSignature(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update('sellerSignatureDataUrl', String(reader.result || ''));
    reader.readAsDataURL(f);
  }

  function onSellerStamp(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update('sellerStampDataUrl', String(reader.result || ''));
    reader.readAsDataURL(f);
  }

  function onBuyerSignature(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update('buyerSignatureDataUrl', String(reader.result || ''));
    reader.readAsDataURL(f);
  }

  async function downloadPdf() {
    if (!containerRef.current) return;
    try {
      const root = containerRef.current as HTMLElement;
      // If the ref points to the page itself use it, otherwise find first .proforma-page inside
      const page = root.classList && root.classList.contains("proforma-page") ? root : (root.querySelector?.(".proforma-page") as HTMLElement | null);
      if (!page) return alert("Nothing to export");
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      // hide elements that should not be exported
      const excluded = Array.from(page.querySelectorAll('.no-export')) as HTMLElement[];
      const previousDisplays = excluded.map(el => el.style.display || '');
      excluded.forEach(el => { el.style.display = 'none'; });

      // render the single page
      page.style.backgroundColor = "#ffffff";
      const canvas = await html2canvas(page, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const imgProps: any = (pdf as any).getImageProperties(imgData);
      // Add a margin so content doesn't touch the paper edges
      const margin = 10; // millimeters
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      let pdfWidth = maxWidth;
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      if (pdfHeight > maxHeight) {
        const scale = maxHeight / pdfHeight;
        pdfHeight = pdfHeight * scale;
        pdfWidth = pdfWidth * scale;
      }
      const x = margin;
      const y = margin;
      pdf.addImage(imgData, "JPEG", x, y, pdfWidth, pdfHeight);

      const fileName = `${(data.companyName || "proforma").replace(/\s+/g, "_")}-${data.proformaNo || ""}.pdf`;
      pdf.save(fileName);

      // restore previously hidden elements
      excluded.forEach((el, i) => { el.style.display = previousDisplays[i] || ''; });
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. See console for details.");
    }
  }

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("proforma_auth");
      window.location.href = "/login";
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div className="container">
        <div className="header">
          <div className="logo" style={{ background: data.accentColor }}>{data.companyName.split(" ")[0] || "COMP"}</div>
          <div className="title">
            <h1 style={{ margin: 0 }}>{data.companyName} — Proforma Builder</h1>
            <p className="small">Professional, responsive A4 proforma invoice. Choose your brand color and preview before download.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ fontSize: 12, color: "#374151" }}>{data.companyPhone}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={logout} style={{ background: "#ef4444" }}>Logout</button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 18, marginTop: 18 }}>
          <div>
            <h3>Company & Branding</h3>
            <div className="grid">
              <div className="field"><label>Company Name</label><input value={data.companyName} onChange={e => update("companyName", e.target.value)} /></div>
              <div className="field"><label>Company TIN</label><input value={data.companyTin} onChange={e => update("companyTin", e.target.value)} /></div>
              <div className="field"><label>Phone</label><input value={data.companyPhone} onChange={e => update("companyPhone", e.target.value)} /></div>
              <div className="field"><label>Email</label><input value={data.companyEmail} onChange={e => update("companyEmail", e.target.value)} /></div>
              <div className="field"><label>City / Address</label><input value={data.companyCity} onChange={e => update("companyCity", e.target.value)} /></div>
              <div className="field"><label>Office Address</label><input value={data.companyAddress} onChange={e => update("companyAddress", e.target.value)} /></div>
              <div className="field"><label>Brand Color</label><input type="color" value={data.accentColor} onChange={e => update("accentColor", e.target.value)} /></div>
              <div className="field"><label>Headings Color</label><input type="color" value={data.headingsColor} onChange={e => update("headingsColor", e.target.value)} /></div>
              <div className="field"><label>Logo (PNG/JPG)</label><input type="file" accept="image/*" onChange={onLogo} /></div>
              <div className="field"><label>Seller Representative</label><input value={data.sellerRepName} onChange={e => update('sellerRepName', e.target.value)} /></div>
              <div className="field"><label>Seller Signature (PNG)</label><input type="file" accept="image/*" onChange={onSellerSignature} /></div>
              <div className="field"><label>Seller Stamp (PNG)</label><input type="file" accept="image/*" onChange={onSellerStamp} /></div>
            </div>

            <h3 style={{ marginTop: 12 }}>Customer & Invoice Details</h3>
            <div className="grid">
              <div className="field"><label>Proforma No.</label><input value={data.proformaNo} onChange={e => update("proformaNo", e.target.value)} /></div>
              <div className="field"><label>Date Issued</label><input type="date" value={data.dateIssued} onChange={e => update("dateIssued", e.target.value)} /></div>
              <div className="field"><label>Salesperson</label><input value={data.salesperson} onChange={e => update("salesperson", e.target.value)} /></div>
              <div className="field"><label>Full Name</label><input value={data.fullName} onChange={e => update("fullName", e.target.value)} /></div>
              <div className="field"><label>ID / Passport No.</label><input value={data.idNo} onChange={e => update("idNo", e.target.value)} /></div>
              <div className="field"><label>TIN</label><input value={data.tin} onChange={e => update("tin", e.target.value)} /></div>
              <div className="field"><label>Buyer Signature (PNG)</label><input type="file" accept="image/*" onChange={onBuyerSignature} /></div>
              <div className="field"><label>Phone</label><input value={data.phone} onChange={e => update("phone", e.target.value)} /></div>
              <div className="field"><label>Address</label><input value={data.address} onChange={e => update("address", e.target.value)} /></div>
              <div className="field"><label>Email</label><input value={data.email} onChange={e => update("email", e.target.value)} /></div>
              <div className="field"><label>Country</label><input value={data.country} onChange={e => update("country", e.target.value)} /></div>
              <div className="field"><label>Company (if any)</label><input value={data.company} onChange={e => update("company", e.target.value)} /></div>
            </div>

            <h3 style={{ marginTop: 12 }}>Vehicle Details</h3>
            <div className="grid">
              <div className="field"><label>Make / Brand</label><input value={data.make} onChange={e => update("make", e.target.value)} /></div>
              <div className="field"><label>Model</label><input value={data.model} onChange={e => update("model", e.target.value)} /></div>
              <div className="field"><label>Year</label><input value={data.year} onChange={e => update("year", e.target.value)} /></div>
              <div className="field"><label>Colour</label><input value={data.colour} onChange={e => update("colour", e.target.value)} /></div>
              <div className="field"><label>Mileage (km/mi)</label><input value={data.mileage} onChange={e => update("mileage", e.target.value)} /></div>
              <div className="field"><label>Fuel Type</label><input value={data.fuelType} onChange={e => update("fuelType", e.target.value)} /></div>
              <div className="field"><label>Chassis Number</label><input value={data.chassis} onChange={e => update("chassis", e.target.value)} /></div>
              <div className="field"><label>Transmission</label><input value={data.transmission} onChange={e => update("transmission", e.target.value)} /></div>
              <div className="field"><label>Condition</label><input value={data.condition} onChange={e => update("condition", e.target.value)} /></div>
              <div className="field"><label>Stock / Reg No.</label><input value={data.stockNo} onChange={e => update("stockNo", e.target.value)} /></div>
              <div className="field"><label>Quantity</label><input value={data.quantity} onChange={e => update("quantity", e.target.value)} /></div>
              <div className="field"><label>Unit Price</label><input value={data.unitPrice} onChange={e => update("unitPrice", e.target.value)} /></div>
              <div className="field"><label>Total Price</label><input value={data.totalPrice} onChange={e => update("totalPrice", e.target.value)} /></div>
            </div>

            <h3 style={{ marginTop: 12 }}>Payment & Finance Terms</h3>
            <div className="grid">
              <div className="field"><label>Payment Method</label><input value={data.paymentMethod} onChange={e => update("paymentMethod", e.target.value)} /></div>
              <div className="field"><label>Currency</label><input value={data.currency} onChange={e => update("currency", e.target.value)} /></div>
              <div className="field"><label>Deposit Amount</label><input value={data.deposit} onChange={e => update("deposit", e.target.value)} /></div>
              <div className="field"><label>Balance Due</label><input value={data.balanceDue} onChange={e => update("balanceDue", e.target.value)} /></div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>Terms & Conditions (editable)</label>
              <textarea value={data.terms} onChange={e => update("terms", e.target.value)} placeholder="Enter your terms, one per line" style={{ width: "100%", minHeight: 120, padding: 10, border: "1px solid var(--border)", borderRadius: 6 }} />
            </div>
          </div>

          <div>
            <div className="preview">
              <h3 style={{ marginTop: 0 }}>Preview (A4)</h3>
              <div style={{ height: 780, overflow: "auto", padding: 6 }}>
                <div ref={containerRef} className="proforma-page" style={{ padding: 0 }}>
                  <div style={{ padding: 12 }}>
                    <div className="mast" style={{ background: data.accentColor }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {data.logoDataUrl ? (
                          <img src={data.logoDataUrl} alt="logo" style={{ height: 56, objectFit: "contain" }} />
                        ) : (
                          <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>LOGO</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700 }}>{data.companyName}</div>
                          <div className="small">TIN: {data.companyTin} | Tel: {data.companyPhone}</div>
                          <div className="small">Email: {data.companyEmail}</div>
                          <div className="small">{data.companyCity}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>PROFORMA</div>
                        <div className="small">Non-binding Estimate</div>
                      </div>
                    </div>

                    <table className="table section" style={{ marginTop: 12 }}>
                      <tbody>
                        <tr>
                          <td>Proforma No.: {data.proformaNo}</td>
                          <td>Date Issued: {data.dateIssued}</td>
                        </tr>
                        <tr>
                          <td>Valid Until: N/A</td>
                          <td>Salesperson: {data.salesperson}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="no-export" style={{ textAlign: 'right', fontSize: 11, color: '#6b7280', paddingTop: 8 }}>
                            System: Developed by NIYOMWUNGERI Josue - Support: 0790206517- njosuedev@gmail.com
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h2 style={{ color: data.headingsColor }}>Customer Information</h2>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Full Name: {data.fullName}</td>
                          <td>ID / Passport No.: {data.idNo}</td>
                        </tr>
                        <tr>
                          <td>TIN: {data.tin}</td>
                          <td>Phone: {data.phone}</td>
                        </tr>
                        <tr>
                          <td>Address: {data.address}</td>
                          <td>Email: {data.email}</td>
                        </tr>
                        <tr>
                          <td>Country: {data.country}</td>
                          <td>Company (if any): {data.company}</td>
                        </tr>
                      </tbody>
                    </table>

                    <h2 style={{ color: data.headingsColor }}>Vehicle Details</h2>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Make / Brand: {data.make}</td>
                          <td>Model: {data.model}</td>
                        </tr>
                        <tr>
                          <td>Year: {data.year}</td>
                          <td>Colour: {data.colour}</td>
                        </tr>
                        <tr>
                          <td>Mileage: {data.mileage}</td>
                          <td>Fuel Type: {data.fuelType}</td>
                        </tr>
                        <tr>
                          <td>Chassis Number: {data.chassis}</td>
                          <td>Transmission: {data.transmission}</td>
                        </tr>
                        <tr>
                          <td>Condition: {data.condition}</td>
                          <td>Stock / Reg No.: {data.stockNo}</td>
                        </tr>
                        <tr>
                          <td>Unit Price: {formatCurrency(data.unitPrice, data.currency)}</td>
                          <td>Total Price: {formatCurrency(data.totalPrice, data.currency)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <h2 style={{ color: data.headingsColor, marginTop: 12 }}>Payment & Finance Terms</h2>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Payment Method: {data.paymentMethod}</td>
                          <td>Currency: {data.currency}</td>
                        </tr>
                        <tr>
                          <td>Deposit Amount: {formatCurrency(data.deposit, data.currency)}</td>
                          <td>Balance Due: {formatCurrency(data.balanceDue, data.currency)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="section">
                      <h2 style={{ color: data.headingsColor }}>Terms & Conditions</h2>
                      <div className="terms small">{data.terms ? data.terms.split('\n').map((l, i) => (<div key={i} style={{ marginBottom: 6 }}>{l}</div>)) : <div style={{ color: '#6b7280' }}>No terms supplied. Add your terms in the editor.</div>}</div>
                    </div>

                    <div className="section signatures" style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div className="signature-box">
                            {data.buyerSignatureDataUrl ? (
                              <img src={data.buyerSignatureDataUrl} alt="buyer-signature" style={{ maxWidth: '220px', maxHeight: '80px' }} />
                            ) : (
                              <div style={{ height: 56 }} />
                            )}
                            <div className="line" style={{ marginTop: 8 }}>{data.fullName}<br /><span className="small">Buyer - Full Name & Date</span></div>
                          </div>
                        </div>

                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div className="signature-box" style={{ display: 'inline-block', minWidth: 220 }}>
                            {data.sellerSignatureDataUrl ? (
                              <img src={data.sellerSignatureDataUrl} alt="seller-signature" style={{ maxWidth: '220px', maxHeight: '80px' }} />
                            ) : (
                              <div style={{ height: 56 }} />
                            )}
                            <div style={{ marginTop: 8, fontWeight: 600 }}>{data.sellerRepName}</div>
                            <div className="small">{data.companyName}</div>

                            <div style={{ marginTop: 12 }}>
                              {data.sellerStampDataUrl ? (
                                <img src={data.sellerStampDataUrl} alt="stamp" style={{ maxWidth: '160px', maxHeight: '100px', objectFit: 'contain' }} />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 18, fontSize: 11, color: '#667085' }}>Thank you for choosing {data.companyName}. We look forward to serving you.</div>

                    <div className="footer no-export" style={{ marginTop: 24, paddingTop: 8, borderTop: '1px solid #e6e6e6', fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
                      Developed by NIYOMWUNGERI Josue - Support: 0790206517- njosuedev@gmail.com
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <div className="small">Preview shows approximate print layout</div>
                <div className="actions">
                  <button className="btn" onClick={downloadPdf}>Download PDF (A4)</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: string, currency: string) {
  const num = Number(value.replace(/[^0-9.-]+/g, '')) || 0;
  try {
    if (currency === 'FRW') {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(num) + ` ${currency}`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(num);
  } catch {
    return num.toString();
  }
}

function printStyles(accent: string, heading: string) {
  const safe = accent || '#8bc34a';
  const head = heading || '#0b3b61';
  return `:root{--accent:${safe};--heading:${head};--border:#e5e7eb;--muted:#6b7280}
  body{font-family:Arial,Helvetica,sans-serif;color:#0b1724}
  .proforma{width:210mm;min-height:297mm;padding:18mm;margin:0 auto;box-sizing:border-box}
  .mast{background:var(--accent);color:white;padding:16px;border-radius:4px;display:flex;justify-content:space-between}
  .table{width:100%;border-collapse:collapse;margin-bottom:8px}
  .table td{border:1px solid var(--border);padding:6px;font-size:12px}
  h2{color:var(--heading);margin:14px 0 6px}
  .small{font-size:11px;color:var(--muted)}
  .signature-box{min-height:80px}
  .footer{margin-top:24px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);text-align:center}
  @page{size:A4;margin:10mm}
  `;
}
