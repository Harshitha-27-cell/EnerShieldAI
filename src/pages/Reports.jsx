import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Clock, Shield, AlertTriangle, BarChart3, Truck, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import jsPDF from 'jspdf';

const reportTypes = [
  { id: "daily", icon: Clock, title: "Daily Risk Briefing", description: "Summary of today's threats, market movements, and supply status", frequency: "Daily", lastGenerated: "Today, 06:00 IST", color: "mint" },
  { id: "weekly", icon: Calendar, title: "Weekly Intelligence Report", description: "Comprehensive weekly analysis of geopolitical risks and supply chain performance", frequency: "Weekly", lastGenerated: "Mon, Jan 13", color: "lavender" },
  { id: "risk", icon: AlertTriangle, title: "Risk Intelligence Report", description: "Deep-dive analysis of active threats, risk trajectories, and mitigation status", frequency: "On-demand", lastGenerated: "Jan 12", color: "coral" },
  { id: "supplier", icon: Truck, title: "Supplier Performance Report", description: "Supplier reliability rankings, delivery metrics, and cost analysis", frequency: "Monthly", lastGenerated: "Jan 1", color: "mint" },
  { id: "economic", icon: BarChart3, title: "Economic Impact Assessment", description: "GDP impact, inflation analysis, and fiscal implications of current disruptions", frequency: "On-demand", lastGenerated: "Jan 10", color: "lavender" },
  { id: "reserve", icon: Shield, title: "Strategic Reserve Status", description: "Reserve levels, coverage analysis, and replenishment schedule", frequency: "Weekly", lastGenerated: "Mon, Jan 13", color: "mint" },
];

const recentReports = [
  { title: "Daily Risk Briefing — Jan 15, 2025", type: "daily", date: "Today", size: "2.4 MB" },
  { title: "Weekly Intelligence Report — W2 2025", type: "weekly", date: "Jan 13", size: "5.8 MB" },
  { title: "Red Sea Disruption Impact Assessment", type: "risk", date: "Jan 12", size: "3.1 MB" },
  { title: "Q4 2024 Supplier Performance", type: "supplier", date: "Jan 1", size: "8.2 MB" },
  { title: "OPEC+ Decision Economic Analysis", type: "economic", date: "Dec 28", size: "4.5 MB" },
  { title: "Monthly Reserve Status — December 2024", type: "reserve", date: "Dec 31", size: "1.8 MB" },
];

const colorMap = { daily: "mint", weekly: "lavender", risk: "coral", supplier: "mint", economic: "lavender", reserve: "mint" };

// --- PDF Generator ---
function generatePDF(title, content) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Header bar
  doc.setFillColor(20, 20, 22);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setFillColor(45, 221, 168);
  doc.rect(0, 0, 4, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('EnerShield AI', margin, 12);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text('India Energy Supply Chain Resilience Platform', margin, 19);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageW - margin, 19, { align: 'right' });

  y = 38;

  // Report title
  doc.setFillColor(30, 30, 32);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F');
  doc.setTextColor(45, 221, 168);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 4, y + 9);
  y += 22;

  // Parse and render content sections
  const lines = content.split('\n');
  doc.setFont('helvetica', 'normal');

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) { y += 3; continue; }

    // Check page overflow
    if (y > pageH - 24) {
      doc.addPage();
      y = margin;
      // Footer on page break
      doc.setFillColor(20, 20, 22);
      doc.rect(0, pageH - 10, pageW, 10, 'F');
    }

    // Section headers: lines starting with # or ALL CAPS or ending with :
    if (line.startsWith('#') || (line === line.toUpperCase() && line.length > 6 && line.length < 60) || /^[A-Z][A-Z\s&]+:$/.test(line)) {
      const headerText = line.replace(/^#+\s*/, '');
      y += 2;
      doc.setFillColor(35, 35, 40);
      doc.rect(margin, y - 4, contentW, 9, 'F');
      doc.setFillColor(45, 221, 168);
      doc.rect(margin, y - 4, 2, 9, 'F');
      doc.setTextColor(45, 221, 168);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(headerText, margin + 5, y + 1);
      y += 10;
    }
    // Bullet points
    else if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      const bulletText = line.replace(/^[-•*]\s*/, '');
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(45, 221, 168);
      doc.text('▸', margin + 2, y);
      doc.setTextColor(200, 200, 200);
      const wrapped = doc.splitTextToSize(bulletText, contentW - 10);
      doc.text(wrapped, margin + 8, y);
      y += wrapped.length * 5 + 1;
    }
    // Numbered points
    else if (/^\d+\./.test(line)) {
      doc.setTextColor(167, 139, 250);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      const num = line.match(/^\d+\./)[0];
      const rest = line.replace(/^\d+\.\s*/, '');
      doc.text(num, margin + 2, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      const wrapped = doc.splitTextToSize(rest, contentW - 10);
      doc.text(wrapped, margin + 8, y);
      y += wrapped.length * 5 + 1;
    }
    // Normal paragraph text
    else {
      doc.setTextColor(190, 190, 190);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      const wrapped = doc.splitTextToSize(line, contentW);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5 + 1;
    }
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(15, 15, 17);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('EnerShield AI — CONFIDENTIAL — India Energy Security Platform', margin, pageH - 4);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 4, { align: 'right' });
  }

  const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  doc.save(filename);
}

// --- Excel (CSV) Generator ---
function generateExcel(title, content) {
  const rows = [];
  rows.push(['EnerShield AI — Energy Supply Chain Report']);
  rows.push([title]);
  rows.push([`Generated: ${new Date().toLocaleString('en-IN')}`]);
  rows.push(['']);

  const lines = content.split('\n');
  let currentSection = '';

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { rows.push(['']); continue; }

    if (line.startsWith('#') || (line === line.toUpperCase() && line.length > 6 && line.length < 60)) {
      currentSection = line.replace(/^#+\s*/, '');
      rows.push(['']);
      rows.push([`SECTION: ${currentSection}`]);
      rows.push(['']);
    } else if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      rows.push(['', '•', line.replace(/^[-•*]\s*/, '')]);
    } else if (/^\d+\./.test(line)) {
      const num = line.match(/^\d+\./)[0];
      rows.push(['', num, line.replace(/^\d+\.\s*/, '')]);
    } else {
      // Try to detect key: value patterns for structured data
      if (line.includes(':') && line.indexOf(':') < 30) {
        const [key, ...rest] = line.split(':');
        rows.push([key.trim(), rest.join(':').trim()]);
      } else {
        rows.push([line]);
      }
    }
  }

  const csv = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [generatingId, setGeneratingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchReportContent = async (title, reportTypeName) => {
    return await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a comprehensive, well-structured intelligence report titled "${title}" for India's energy supply chain resilience platform (EnerShield AI).

Structure the report with the following clearly labeled sections:

# EXECUTIVE SUMMARY
(2-3 paragraph overview of the situation)

# KEY FINDINGS
(5 specific findings with quantified data points — numbers, percentages, dates)

# RISK ASSESSMENT
(3-4 identified risks with severity levels: Critical/High/Medium/Low)

# MARKET & SUPPLY ANALYSIS
(Current supply volumes, price trends, route status)

# STRATEGIC RECOMMENDATIONS
(5 numbered, actionable recommendations with expected outcomes)

# IMPLEMENTATION TIMELINE
(Short-term: 0-30 days, Medium-term: 30-90 days, Long-term: 90+ days)

Be specific to India's energy security context. Use real-world metrics like mbpd (million barrels per day), USD/barrel, coverage days, and % supply loss. Make it professional, data-driven, and actionable for senior government and corporate decision-makers.`,
    });
  };

  const generateReport = async (id) => {
    setGeneratingId(id);
    try {
      const type = reportTypes.find(r => r.id === id);
      const content = await fetchReportContent(type.title, type.title);
      generatePDF(type.title, content);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingId(null);
    }
  };

  const downloadReport = async (report, format) => {
    const key = `${report.title}-${format}`;
    setDownloadingId(key);
    try {
      const content = await fetchReportContent(report.title, report.type);
      if (format === 'pdf') {
        generatePDF(report.title, content);
      } else {
        generateExcel(report.title, content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Reporting</h1>
        <p className="text-white/40 text-sm mt-1">Generate intelligence reports, export analytics, and track performance</p>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reportTypes.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${r.color}/10`}>
                <r.icon className={`w-5 h-5 text-${r.color}`} />
              </div>
              <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{r.frequency}</span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{r.title}</h3>
            <p className="text-white/40 text-xs leading-relaxed mb-4">{r.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-white/20 text-xs">Last: {r.lastGenerated}</span>
              <Button
                size="sm"
                onClick={() => generateReport(r.id)}
                disabled={!!generatingId}
                className={`text-xs h-8 bg-${r.color}/10 text-${r.color} hover:bg-${r.color}/20 border-0`}
              >
                {generatingId === r.id
                  ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Generating...</>
                  : <><Download className="w-3 h-3 mr-1" />PDF</>}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="glass rounded-2xl">
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Recent Reports</h3>
          <span className="text-white/30 text-xs">Export: PDF · Excel (CSV)</span>
        </div>
        <div className="divide-y divide-white/5">
          {recentReports.map((r, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${colorMap[r.type]}/10`}>
                <FileText className={`w-4 h-4 text-${colorMap[r.type]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium">{r.title}</p>
                <p className="text-white/30 text-xs mt-0.5">{r.date} • {r.size}</p>
              </div>
              <div className="flex items-center gap-2">
                {['pdf', 'excel'].map(fmt => {
                  const key = `${r.title}-${fmt}`;
                  const loading = downloadingId === key;
                  return (
                    <Button
                      key={fmt}
                      size="sm"
                      variant="ghost"
                      disabled={!!downloadingId}
                      onClick={() => downloadReport(r, fmt)}
                      className="text-white/30 hover:text-white h-8 text-xs"
                    >
                      {loading
                        ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        : <Download className="w-3.5 h-3.5 mr-1" />}
                      {fmt === 'pdf' ? 'PDF' : 'Excel'}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}