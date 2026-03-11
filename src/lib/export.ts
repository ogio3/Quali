import type { Project, Document, Code, Segment, Memo } from './db';

// CSV export with BOM for Excel
export function exportSegmentsCsv(
  segments: Segment[],
  documents: Document[],
  codes: Code[]
): string {
  const docMap = new Map(documents.map(d => [d.id, d.name]));
  const codeMap = new Map(codes.map(c => [c.id, c.name]));

  const header = 'segment_id,document,code,start,end,text';
  const rows = segments.map(seg => {
    const docName = csvEscape(docMap.get(seg.documentId) ?? '');
    const codeName = csvEscape(codeMap.get(seg.codeId) ?? '');
    const text = csvEscape(seg.text);
    return `${seg.id},${docName},${codeName},${seg.startOffset},${seg.endOffset},${text}`;
  });

  return '\uFEFF' + header + '\n' + rows.join('\n');
}

function csvEscape(str: string): string {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Codebook JSON
export function exportCodebookJson(codes: Code[]): string {
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    codes: codes.map(c => ({
      id: c.id,
      name: c.name,
      color: c.color,
      shortcut: c.shortcut
    }))
  }, null, 2);
}

// Full project backup
export function exportProjectJson(
  project: Project,
  documents: Document[],
  codes: Code[],
  segments: Segment[],
  memos: Memo[] = []
): string {
  return JSON.stringify({
    version: '1.0',
    app: 'ogio-quali',
    exportedAt: new Date().toISOString(),
    project,
    documents,
    codes,
    segments,
    memos
  }, null, 2);
}

// Trigger download
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
