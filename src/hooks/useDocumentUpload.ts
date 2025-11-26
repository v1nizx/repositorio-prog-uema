import { useState, useCallback } from 'react';
import { UploadDocument, UploadProgress } from '@/services/uploadService';
import axios, { AxiosProgressEvent } from 'axios';

interface UseDocumentUploadOptions {
  onSuccess?: (document: UploadDocument) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: UploadProgress) => void;
}

export function useDocumentUpload(options?: UseDocumentUploadOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  const upload = useCallback(
    async (
      file: File,
      metadata: {
        title: string;
        type: string;
        author: string;
        sector: string;
        description: string;
      }
    ) => {
      try {
        setIsLoading(true);
        setError(null);
        setProgress({ loaded: 0, total: 0, percentage: 0 });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title);
        formData.append('type', metadata.type);
        formData.append('author', metadata.author);
        formData.append('sector', metadata.sector);
        formData.append('description', metadata.description);

        const response = await axios.post('/api/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const total = progressEvent.total || 0;
            const loaded = progressEvent.loaded || 0;
            const percentage = total > 0 ? (loaded / total) * 100 : 0;

            const progressData: UploadProgress = {
              loaded,
              total,
              percentage,
            };

            setProgress(progressData);
            options?.onProgress?.(progressData);
          },
        });

        const uploadedDocument = response.data as UploadDocument;
        options?.onSuccess?.(uploadedDocument);
        return uploadedDocument;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro ao fazer upload');
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return {
    upload,
    isLoading,
    error,
    progress,
  };
}

/**
 * Hook para recuperar documentos
 */
export function useDocuments() {
  const [documents, setDocuments] = useState<UploadDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao obter documentos');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: string, fileUrl?: string) => {
    try {
      await axios.delete(`/api/documents/${id}`, {
        data: { fileUrl },
      });

      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar documento');
      setError(error);
      throw error;
    }
  }, []);

  const archiveDocument = useCallback(async (id: string) => {
    try {
      await axios.post(`/api/documents/archive/${id}`);

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === id ? { ...doc, status: 'arquivado' as const } : doc
        )
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao arquivar documento');
      setError(error);
      throw error;
    }
  }, []);

  const searchDocuments = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/api/documents/search', { query });
      return response.data as UploadDocument[];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar documentos');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    deleteDocument,
    archiveDocument,
    searchDocuments,
  };
}
