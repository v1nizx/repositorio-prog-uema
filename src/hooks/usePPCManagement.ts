import { useState, useCallback } from 'react';
import { UploadDocument } from '@/services/uploadService';
import axios from 'axios';

/**
 * Hook para gerenciar PPCs (Projetos Pedagógicos de Curso)
 */
export function usePPCManagement() {
  const [ppcs, setPPCs] = useState<UploadDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPPCs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar documentos do tipo 'ppc' (minúscula, como é gravado)
      console.log('🔍 Buscando PPCs...');
      const response = await axios.get('/api/documents/type/ppc');
      const documents = response.data as UploadDocument[];
      console.log('✅ PPCs encontrados:', documents.length);
      
      setPPCs(documents);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao obter PPCs');
      setError(error);
      console.error('❌ Erro ao buscar PPCs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePPC = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/documents/${id}`);
      setPPCs(ppcs.filter(p => p.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar PPC');
      setError(error);
      throw error;
    }
  }, [ppcs]);

  const archivePPC = useCallback(async (id: string) => {
    try {
      await axios.put(`/api/documents/archive/${id}`, {});
      setPPCs(ppcs.map(p => 
        p.id === id ? { ...p, status: 'arquivado' } : p
      ));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao arquivar PPC');
      setError(error);
      throw error;
    }
  }, [ppcs]);

  return {
    ppcs,
    isLoading,
    error,
    fetchPPCs,
    deletePPC,
    archivePPC,
  };
}
