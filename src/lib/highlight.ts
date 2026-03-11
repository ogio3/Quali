/**
 * Highlight Engine — Div Overlay Architecture
 *
 * Renders highlights as absolutely-positioned <div> elements overlaid on
 * top of plain text. The DOM text content is NEVER modified, preserving:
 *   - Arabic ligatures and RTL shaping
 *   - Devanagari/Thai complex text layout
 *   - Screen reader compatibility
 *   - REFI-QDA offset integrity
 *
 * Architecture:
 *   ┌─ reading-area (position: relative) ─┐
 *   │  plain text (DOM untouched)          │
 *   │  ┌─ highlight-layer (absolute) ─┐   │
 *   │  │  colored <div> rectangles     │   │
 *   │  └──────────────────────────────┘   │
 *   └─────────────────────────────────────┘
 */

import type { Segment, Code } from './db';

export interface HighlightRect {
  segmentId: string;
  codeId: string;
  color: string;
  codeName: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Convert plain text content to HTML with <br> for newlines.
 * No <span> injection — text stays as pure text nodes.
 */
export function contentToHtml(content: string): string {
  return escapeHtml(content).replace(/\n/g, '<br>');
}

/**
 * Compute overlay rectangles for all segments by creating DOM Ranges
 * and reading their client rects relative to the container.
 */
export function computeHighlightRects(
  container: HTMLElement,
  segments: Segment[],
  codeMap: Map<string, Code>
): HighlightRect[] {
  if (!container || segments.length === 0) return [];

  const containerRect = container.getBoundingClientRect();
  const rects: HighlightRect[] = [];

  for (const seg of segments) {
    const code = codeMap.get(seg.codeId);
    if (!code) continue;

    const range = createRangeFromOffsets(container, seg.startOffset, seg.endOffset);
    if (!range) continue;

    const clientRects = range.getClientRects();
    for (let i = 0; i < clientRects.length; i++) {
      const cr = clientRects[i];
      if (cr.width === 0 || cr.height === 0) continue;
      rects.push({
        segmentId: seg.id,
        codeId: seg.codeId,
        color: code.color,
        codeName: code.name,
        top: cr.top - containerRect.top,
        left: cr.left - containerRect.left,
        width: cr.width,
        height: cr.height
      });
    }
  }

  return rects;
}

/**
 * Create a DOM Range from character offsets within a container.
 * Walks text nodes to find the correct positions.
 */
function createRangeFromOffsets(
  container: HTMLElement,
  startOffset: number,
  endOffset: number
): Range | null {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let startNode: Text | null = null;
  let startNodeOffset = 0;
  let endNode: Text | null = null;
  let endNodeOffset = 0;

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const len = textNode.length;

    if (!startNode && offset + len > startOffset) {
      startNode = textNode;
      startNodeOffset = startOffset - offset;
    }

    if (offset + len >= endOffset) {
      endNode = textNode;
      endNodeOffset = endOffset - offset;
      break;
    }

    offset += len;
  }

  if (!startNode || !endNode) return null;

  try {
    const range = document.createRange();
    range.setStart(startNode, startNodeOffset);
    range.setEnd(endNode, endNodeOffset);
    return range;
  } catch {
    return null;
  }
}

/**
 * Compute absolute character offset from a browser Selection range.
 * Used when the user selects text to create a new coding segment.
 */
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

  if (startOffset === -1 || endOffset === -1 || startOffset >= endOffset) {
    return null;
  }

  return { start: startOffset, end: endOffset };
}

/**
 * Find which segment a click position belongs to, given the overlay rects.
 */
export function hitTestSegment(
  x: number,
  y: number,
  containerRect: DOMRect,
  rects: HighlightRect[]
): string | null {
  const relX = x - containerRect.left;
  const relY = y - containerRect.top;

  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (relX >= r.left && relX <= r.left + r.width &&
        relY >= r.top && relY <= r.top + r.height) {
      return r.segmentId;
    }
  }
  return null;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
