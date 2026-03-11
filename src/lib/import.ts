import type { Project, Document, Code, Segment, Memo } from './db';
import { db, createProject, createDocument } from './db';

export async function parseFile(file: File): Promise<{ name: string; content: string }> {
  const name = file.name.replace(/\.[^.]+$/, '');

  if (file.name.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return { name, content: result.value.normalize('NFC') };
  }

  const content = await file.text();
  return { name, content: content.normalize('NFC') };
}

interface ProjectBackup {
  version: string;
  app: string;
  project: Project;
  documents: Document[];
  codes: Code[];
  segments: Segment[];
  memos?: Memo[];
}

export async function importProjectJson(json: string): Promise<string> {
  const data: ProjectBackup = JSON.parse(json);

  if ((data.app !== 'quali-lite' && data.app !== 'ogio-quali') || !data.version) {
    throw new Error('Invalid ogio Quali backup file');
  }

  await db.transaction('rw', [db.projects, db.documents, db.codes, db.segments, db.memos], async () => {
    await db.projects.put(data.project);
    await db.documents.bulkPut(data.documents);
    await db.codes.bulkPut(data.codes);
    await db.segments.bulkPut(data.segments);
    if (data.memos?.length) {
      await db.memos.bulkPut(data.memos);
    }
  });

  return data.project.id;
}
