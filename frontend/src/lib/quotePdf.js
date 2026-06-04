import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const YELLOW = [234, 179, 8]; // tailwind yellow-500
const DARK = [24, 24, 27]; // zinc-900
const MUTED = [113, 113, 122]; // zinc-500

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 })
    : "—";

export function generateQuotePdf({ quote, customer, selectedJobs, business }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header band
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setFillColor(...YELLOW);
  doc.rect(0, 0, 6, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TERRAIN", margin, 38);
  const tw = doc.getTextWidth("TERRAIN");
  doc.setTextColor(...YELLOW);
  doc.text("PRO", margin + tw + 2, 38);
  doc.setTextColor(180, 180, 185);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("AI QUOTE ESTIMATOR", margin, 54);

  doc.setTextColor(180, 180, 185);
  doc.setFontSize(9);
  doc.text(`Quote #${(quote.id || "").slice(0, 8).toUpperCase()}`, pageW - margin, 34, { align: "right" });
  doc.text(new Date().toLocaleDateString("en-AU"), pageW - margin, 50, { align: "right" });

  let y = 100;

  // Business + customer
  doc.setTextColor(...MUTED);
  doc.setFontSize(8);
  doc.text("PREPARED FOR", margin, y);
  doc.text("PREPARED BY", pageW / 2, y);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  y += 16;
  doc.text(customer?.full_name || "Customer", margin, y);
  doc.text(business?.name || "TerrainPRO", pageW / 2, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  y += 14;
  if (customer?.address) doc.text(doc.splitTextToSize(customer.address, pageW / 2 - margin - 10), margin, y);
  if (business?.abn) doc.text(business.abn, pageW / 2, y);

  y += 28;

  // Summary
  if (quote.summary) {
    doc.setTextColor(...MUTED);
    doc.setFontSize(8);
    doc.text("SCOPE SUMMARY", margin, y);
    y += 14;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(quote.summary, pageW - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 12 + 10;
  }

  // Line items grouped by scope
  const groups = {};
  (quote.line_items || []).forEach((li) => {
    const k = li.scope || "general";
    (groups[k] = groups[k] || []).push(li);
  });
  const order = [
    ...selectedJobs.map((j) => j.id).filter((id) => groups[id]),
    ...Object.keys(groups).filter((k) => !selectedJobs.some((j) => j.id === k)),
  ];

  order.forEach((scopeId) => {
    const items = groups[scopeId];
    const job = selectedJobs.find((j) => j.id === scopeId);
    autoTable(doc, {
      startY: y,
      head: [[(job ? job.label : scopeId).toUpperCase(), "QTY", "RATE", "TOTAL"]],
      body: items.map((li) => [
        `${li.label}${li.detail ? `\n${li.detail}` : ""}`,
        `${li.qty ?? ""} ${li.unit ?? ""}`.trim(),
        fmt(li.unit_cost),
        fmt(li.total),
      ]),
      theme: "grid",
      headStyles: { fillColor: DARK, textColor: YELLOW, fontSize: 8, halign: "left" },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { halign: "right", cellWidth: 70 },
        2: { halign: "right", cellWidth: 70 },
        3: { halign: "right", cellWidth: 80, textColor: [160, 120, 0], fontStyle: "bold" },
      },
      bodyStyles: { fontSize: 8.5, textColor: [40, 40, 40] },
      margin: { left: margin, right: margin },
      styles: { lineColor: [228, 228, 231], lineWidth: 0.5 },
    });
    y = doc.lastAutoTable.finalY + 18;
  });

  // Totals
  autoTable(doc, {
    startY: y,
    body: [
      ["Labour", fmt(quote.labor_total)],
      ["Materials", fmt(quote.materials_total)],
      ["Contingency", fmt(quote.contingency_total)],
      ["GST", fmt(quote.gst)],
    ],
    theme: "plain",
    columnStyles: { 0: { textColor: MUTED, fontSize: 9 }, 1: { halign: "right", fontStyle: "bold", fontSize: 9 } },
    margin: { left: pageW / 2, right: margin },
    tableWidth: pageW / 2 - margin,
  });
  y = doc.lastAutoTable.finalY + 10;

  // Total range band
  doc.setFillColor(...YELLOW);
  doc.rect(margin, y, pageW - margin * 2, 44, "F");
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TOTAL RANGE (INCL. GST)", margin + 14, y + 18);
  doc.setFontSize(16);
  doc.text(`${fmt(quote.total_low)}  —  ${fmt(quote.total_high)}`, pageW - margin - 14, y + 28, { align: "right" });
  y += 64;

  // Assumptions
  if (quote.assumptions?.length) {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("ASSUMPTIONS", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    quote.assumptions.forEach((a) => {
      const lines = doc.splitTextToSize(`• ${a}`, pageW - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 11;
    });
  }

  // Footer
  const ph = doc.internal.pageSize.getHeight();
  doc.setTextColor(...MUTED);
  doc.setFontSize(7.5);
  doc.text(
    "Generated by TerrainPRO AI · Indicative estimate, subject to site inspection · Prices in AUD incl. GST",
    margin,
    ph - 24
  );

  const ref = (quote.id || "quote").slice(0, 8);
  doc.save(`TerrainPRO-Quote-${ref}.pdf`);
}
