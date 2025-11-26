/**
 * Tipos TypeScript para o sistema de upload de documentos
 */

export type DocumentType = 'ppc' | 'resolucao' | 'relatorio' | 'ata' | 'dados' | 'processo';

export type DocumentSector = 
  | 'coordenacao-eng' 
  | 'coordenacao-comp' 
  | 'secretaria' 
  | 'colegiado' 
  | 'cpa' 
  | 'registro';

export type DocumentStatus = 'active' | 'archived';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  author: string;
  sector: DocumentSector;
  description: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: Date;
  updatedAt: Date;
  version: number;
  status: DocumentStatus;
}

export interface DocumentMetadata {
  title: string;
  type: DocumentType;
  author: string;
  sector: DocumentSector;
  description: string;
}

export interface UploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

export interface SearchQuery {
  query: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface FilterOptions {
  type?: DocumentType;
  sector?: DocumentSector;
  status?: DocumentStatus;
  dateFrom?: Date;
  dateTo?: Date;
}
