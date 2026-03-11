import type { Segment, Code } from './db';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface HighlightRange {
  start: number;
  end: number;
  segmentId: string;
  color: string;
  codeName: string;
}

export function buildHighlightedHtml(
  content: string,
  segments: Segment[],
  codeMap: Map<string, Code>
): string {
  if (segments.length === 0) {
    return escapeHtml(content).replace(/\n/g, '<br>');
  }

  // Build ranges
  const ranges: HighlightRange[] = segments
    .map(seg => {
      const code = codeMap.get(seg.codeId);
      if (!code) return null;
      return {
        start: seg.startOffset,
        end: seg.endOffset,
        segmentId: seg.id,
        color: code.color,
        codeName: code.name
      };
    })
    .filter((r): r is HighlightRange => r !== null)
    .sort((a, b) => a.start - b.start || a.end - b.end);

  // Build output
  const parts: string[] = [];
  let cursor = 0;

  for (const range of ranges) {
    // Text before this range
    if (range.start > cursor) {
      parts.push(escapeHtml(content.slice(cursor, range.start)).replace(/\n/g, '<br>'));
    }

    // Skip if overlapping backwards
    if (range.start < cursor) continue;

    // Highlighted span
    const text = content.slice(range.start, range.end);
    const bgColor = range.color + '40'; // 25% opacity
    parts.push(
      `<span class="ql-segment" data-segment-id="${range.segmentId}" data-code-name="${escapeHtml(range.codeName)}" style="background:${bgColor};border-bottom:2px solid ${range.color};border-radius:2px;cursor:pointer" title="${escapeHtml(range.codeName)}">${escapeHtml(text).replace(/\n/g, '<br>')}</span>`
    );

    cursor = range.end;
  }

  // Remaining text
  if (cursor < content.length) {
    parts.push(escapeHtml(content.slice(cursor)).replace(/\n/g, '<br>'));
  }

  return parts.join('');
}

export function computeAbsoluteOffset(
  range: Range,
  container: HTMLElement
): { start: number; end: number } | null {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let startOffset = -1;
  let endOffset = -1;

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const len = textNode.length;

    if (node === range.startContainer) {
      startOffset = offset + range.startOffset;
    }
    if (node === range.endContainer) {
      endOffset = offset + range.endOffset;
      break;
    }

    offset += len;
  }

  if (startOffset === -1 || endOffset === -1 || startOffset === endOffset) {
    return null;
  }

  return { start: startOffset, end: endOffset };
}
