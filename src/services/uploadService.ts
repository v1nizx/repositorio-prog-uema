import { storage, firestore } from '@/config/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';

export interface UploadDocument {
  id?: string;
  titulo: string;
  tipo: string;
  autor: string;
  setor: string;
  descricao: string;
  nomeArquivo: string;
  tamanhoArq: number;
  urlArquivo?: string;
  uploadedAt?: Date;
  updatedAt?: Date;
  versao: number;
  status: 'ativo' | 'arquivado';
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class DocumentUploadService {
  private readonly collectionName = 'documents';
  private readonly storagePath = 'documents';

  /**
   * Upload um arquivo para o Firebase Storage
   */
  async uploadFile(
    file: File,
    metadata: Omit<UploadDocument, 'id' | 'fileUrl' | 'uploadedAt' | 'updatedAt'>
  ): Promise<UploadDocument> {
    try {
      // Criar referência no storage
      const timestamp = Date.now();
      const fileNameWithTimestamp = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${this.storagePath}/${fileNameWithTimestamp}`);

      // Fazer upload
      await uploadBytes(storageRef, file);

      // Obter URL de download
      const fileUrl = await getDownloadURL(storageRef);

      // Salvar metadados no Firestore
      const now = new Date();
      const documentData: UploadDocument = {
        ...metadata,
        urlArquivo: fileUrl,
        nomeArquivo: file.name,
        tamanhoArq: file.size,
        uploadedAt: now,
        updatedAt: now,
        status: 'ativo',
      };

      const docRef = await addDoc(
        collection(firestore, this.collectionName),
        {
          ...documentData,
          uploadedAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now),
        }
      );

      return {
        ...documentData,
        id: docRef.id,
      };
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw new Error(`Erro ao fazer upload do arquivo: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    }
  }

  /**
   * Obter todos os documentos
   */
  async getAllDocuments(): Promise<UploadDocument[]> {
    try {
      const q = query(collection(firestore, this.collectionName), where('status', '==', 'ativo'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UploadDocument;
      });
    } catch (error) {
      console.error('Erro ao obter documentos:', error);
      throw new Error('Erro ao obter documentos');
    }
  }

  /**
   * Obter documentos por tipo
   */
  async getDocumentsByType(type: string): Promise<UploadDocument[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('tipo', '==', type),
        where('status', '==', 'ativo')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UploadDocument;
      });
    } catch (error) {
      console.error('Erro ao obter documentos por tipo:', error);
      throw new Error('Erro ao obter documentos');
    }
  }

  /**
   * Obter documentos por setor
   */
  async getDocumentsBySector(sector: string): Promise<UploadDocument[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('setor', '==', sector),
        where('status', '==', 'ativo')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UploadDocument;
      });
    } catch (error) {
      console.error('Erro ao obter documentos por setor:', error);
      throw new Error('Erro ao obter documentos');
    }
  }

  /**
   * Atualizar documento
   */
  async updateDocument(id: string, updates: Partial<UploadDocument>): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw new Error('Erro ao atualizar documento');
    }
  }

  /**
   * Deletar documento
   */
  async deleteDocument(id: string, fileUrl?: string): Promise<void> {
    try {
      // Deletar arquivo do storage
      if (fileUrl) {
        try {
          const fileRef = ref(storage, fileUrl);
          await deleteObject(fileRef);
        } catch (storageError) {
          console.warn('Erro ao deletar arquivo do storage:', storageError);
          // Continuar mesmo se não conseguir deletar o arquivo
        }
      }

      // Deletar metadados do Firestore
      const docRef = doc(firestore, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw new Error('Erro ao deletar documento');
    }
  }

  /**
   * Arquivar documento (soft delete)
   */
  async archiveDocument(id: string): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      await updateDoc(docRef, {
        status: 'arquivado',
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Erro ao arquivar documento:', error);
      throw new Error('Erro ao arquivar documento');
    }
  }

  /**
   * Buscar documentos por título
   */
  async searchDocuments(searchTerm: string): Promise<UploadDocument[]> {
    try {
      const allDocs = await this.getAllDocuments();
      return allDocs.filter((doc) =>
        doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw new Error('Erro ao buscar documentos');
    }
  }

  /**
   * Incrementar versão de um documento
   */
  async incrementVersion(id: string): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      const currentDoc = (await getDocs(query(collection(firestore, this.collectionName)))).docs.find(
        (d) => d.id === id
      );

      const currentVersion = currentDoc?.data().version || 0;

      await updateDoc(docRef, {
        version: currentVersion + 1,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Erro ao incrementar versão:', error);
      throw new Error('Erro ao incrementar versão');
    }
  }
}

export default new DocumentUploadService();
