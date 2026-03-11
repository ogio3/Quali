import Dexie, { type EntityTable } from 'dexie';
import { nanoid } from 'nanoid';

// Types
export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  content: string;
  createdAt: number;
}

export interface Code {
  id: string;
  projectId: string;
  name: string;
  color: string;
  shortcut: number | null;
  createdAt: number;
}

export interface Segment {
  id: string;
  projectId: string;
  documentId: string;
  codeId: string;
  startOffset: number;
  endOffset: number;
  text: string;
  createdAt: number;
}

export interface Memo {
  id: string;
  projectId: string;
  codeId: string | null;  // null = project-level memo
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// Database
class QualiLiteDB extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  documents!: EntityTable<Document, 'id'>;
  codes!: EntityTable<Code, 'id'>;
  segments!: EntityTable<Segment, 'id'>;
  memos!: EntityTable<Memo, 'id'>;

  constructor() {
    super('quali-lite');
    this.version(1).stores({
      projects: 'id, updatedAt',
      documents: 'id, projectId, createdAt',
      codes: 'id, projectId, shortcut',
      segments: 'id, projectId, documentId, codeId, startOffset'
    });
    this.version(2).stores({
      projects: 'id, updatedAt',
      documents: 'id, projectId, createdAt',
      codes: 'id, projectId, shortcut',
      segments: 'id, projectId, documentId, codeId, startOffset',
      memos: 'id, projectId, codeId, updatedAt'
    });
  }
}

export const db = new QualiLiteDB();

// CRUD Operations
export async function createProject(name: string): Promise<Project> {
  const project: Project = {
    id: nanoid(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await db.projects.add(project);
  return project;
}

export async function listProjects(): Promise<Project[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function deleteProject(id: string): Promise<void> {
  await db.transaction('rw', [db.projects, db.documents, db.codes, db.segments, db.memos], async () => {
    await db.memos.where('projectId').equals(id).delete();
    await db.segments.where('projectId').equals(id).delete();
    await db.codes.where('projectId').equals(id).delete();
    await db.documents.where('projectId').equals(id).delete();
    await db.projects.delete(id);
  });
}

export async function updateProjectName(id: string, name: string): Promise<void> {
  await db.projects.update(id, { name, updatedAt: Date.now() });
}

export async function touchProject(id: string): Promise<void> {
  await db.projects.update(id, { updatedAt: Date.now() });
}

export async function createDocument(projectId: string, name: string, content: string): Promise<Document> {
  const doc: Document = {
    id: nanoid(),
    projectId,
    name,
    content,
    createdAt: Date.now()
  };
  await db.documents.add(doc);
  await touchProject(projectId);
  return doc;
}

export async function listDocuments(projectId: string): Promise<Document[]> {
  return db.documents.where('projectId').equals(projectId).sortBy('createdAt');
}

export async function getDocument(id: string): Promise<Document | undefined> {
  return db.documents.get(id);
}

export async function deleteDocument(id: string, projectId: string): Promise<void> {
  await db.transaction('rw', [db.documents, db.segments], async () => {
    await db.segments.where('documentId').equals(id).delete();
    await db.documents.delete(id);
  });
  await touchProject(projectId);
}

export async function updateDocumentName(id: string, name: string): Promise<void> {
  await db.documents.update(id, { name });
}

export async function createCode(projectId: string, name: string, color: string): Promise<Code> {
  const code: Code = {
    id: nanoid(),
    projectId,
    name,
    color,
    shortcut: null,
    createdAt: Date.now()
  };
  await db.codes.add(code);
  return code;
}

export async function listCodes(projectId: string): Promise<Code[]> {
  return db.codes.where('projectId').equals(projectId).sortBy('createdAt');
}

export async function updateCode(id: string, updates: Partial<Pick<Code, 'name' | 'color' | 'shortcut'>>): Promise<void> {
  await db.codes.update(id, updates);
}

export async function deleteCode(id: string): Promise<void> {
  await db.transaction('rw', [db.codes, db.segments, db.memos], async () => {
    await db.memos.where('codeId').equals(id).delete();
    await db.segments.where('codeId').equals(id).delete();
    await db.codes.delete(id);
  });
}

export async function createSegment(
  projectId: string,
  documentId: string,
  codeId: string,
  startOffset: number,
  endOffset: number,
  text: string
): Promise<Segment> {
  const segment: Segment = {
    id: nanoid(),
    projectId,
    documentId,
    codeId,
    startOffset,
    endOffset,
    text,
    createdAt: Date.now()
  };
  await db.segments.add(segment);
  await touchProject(projectId);
  return segment;
}

export async function listSegmentsByDocument(documentId: string): Promise<Segment[]> {
  return db.segments.where('documentId').equals(documentId).sortBy('startOffset');
}

export async function listSegmentsByCode(codeId: string): Promise<Segment[]> {
  return db.segments.where('codeId').equals(codeId).toArray();
}

export async function listSegmentsByProject(projectId: string): Promise<Segment[]> {
  return db.segments.where('projectId').equals(projectId).sortBy('startOffset');
}

export async function deleteSegment(id: string): Promise<void> {
  await db.segments.delete(id);
}

export async function mergeCodes(sourceId: string, targetId: string): Promise<number> {
  return db.transaction('rw', [db.codes, db.segments], async () => {
    const count = await db.segments.where('codeId').equals(sourceId).modify({ codeId: targetId });
    await db.codes.delete(sourceId);
    return count;
  });
}

// Memo CRUD
export async function createMemo(projectId: string, codeId: string | null, title: string): Promise<Memo> {
  const memo: Memo = {
    id: nanoid(),
    projectId,
    codeId,
    title,
    content: '',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await db.memos.add(memo);
  return memo;
}

export async function updateMemo(id: string, updates: Partial<Pick<Memo, 'title' | 'content'>>): Promise<void> {
  await db.memos.update(id, { ...updates, updatedAt: Date.now() });
}

export async function deleteMemo(id: string): Promise<void> {
  await db.memos.delete(id);
}

export async function listMemosByProject(projectId: string): Promise<Memo[]> {
  return db.memos.where('projectId').equals(projectId).reverse().sortBy('updatedAt');
}

export async function listMemosByCode(codeId: string): Promise<Memo[]> {
  return db.memos.where('codeId').equals(codeId).toArray();
}
