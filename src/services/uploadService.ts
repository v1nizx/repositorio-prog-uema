import { adminFirestore } from '@/config/firebase-admin.config';

export interface UploadDocument {
  id?: string;
  titulo: string;
  tipo: string;
  autor: string;
  setor: string;
  descricao: string;
  nomeArquivo: string;
  tamanhoArq: number;
  uploadedAt?: Date;
  updatedAt?: Date;
  versao: number;
  status: 'ativo' | 'arquivado';
  fileUrl?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class DocumentUploadService {
  private readonly collectionName = 'documents';
  private readonly CHUNK_SIZE = 900000; // 900KB por chunk (abaixo do limite de 1MB)

  /**
   * Upload um arquivo para o Firestore (dividido em chunks)
   */
  async uploadFile(
    file: File,
    metadata: Omit<UploadDocument, 'id' | 'uploadedAt' | 'updatedAt'>
  ): Promise<UploadDocument> {
    try {
      console.log('📤 Iniciando upload para Firestore:', file.name);
      
      // Converter arquivo para base64
      const arrayBuffer = await file.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);
      let binaryString = '';
      for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
      }
      const base64 = btoa(binaryString);
      console.log(`✅ Arquivo convertido para base64 (${Math.round(base64.length / 1024)}KB)`);

      // Dividir em chunks
      const chunks = [];
      for (let i = 0; i < base64.length; i += this.CHUNK_SIZE) {
        chunks.push(base64.substring(i, i + this.CHUNK_SIZE));
      }
      console.log(`📦 Dividido em ${chunks.length} chunk(s)`);

      const now = new Date();
      const documentData: UploadDocument = {
        ...metadata,
        nomeArquivo: file.name,
        tamanhoArq: file.size,
        uploadedAt: now,
        updatedAt: now,
        status: 'ativo',
      };

      console.log('💾 Salvando documento no Firestore');
      const docRef = await adminFirestore.collection(this.collectionName).add({
        ...documentData,
        uploadedAt: now,
        updatedAt: now,
        totalChunks: chunks.length,
      });
      console.log('✅ Documento criado com ID:', docRef.id);

      // Salvar chunks em subcoleção
      console.log('📦 Salvando chunks...');
      const chunksRef = adminFirestore.collection(this.collectionName).doc(docRef.id).collection('chunks');
      for (let i = 0; i < chunks.length; i++) {
        await chunksRef.add({
          index: i,
          data: chunks[i],
        });
        console.log(`  ✅ Chunk ${i + 1}/${chunks.length} salvo`);
      }

      console.log('✅ Upload concluído!');
      return {
        ...documentData,
        id: docRef.id,
      };
    } catch (error) {
      console.error('❌ Erro ao fazer upload:', error);
      throw new Error(`Erro ao fazer upload do arquivo: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    }
  }

  /**
   * Obter todos os documentos
   */
  async getAllDocuments(): Promise<UploadDocument[]> {
    try {
      const snapshot = await adminFirestore
        .collection(this.collectionName)
        .where('status', '==', 'ativo')
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UploadDocument;
      });
    } catch (error) {
      console.error('❌ Erro ao obter documentos:', error);
      throw new Error('Erro ao obter documentos');
    }
  }

  /**
   * Obter arquivo decodificado
   */
  async getFileContent(docId: string): Promise<{ buffer: ArrayBuffer; name: string } | null> {
    try {
      const chunksSnapshot = await adminFirestore
        .collection(this.collectionName)
        .doc(docId)
        .collection('chunks')
        .get();
      
      if (chunksSnapshot.empty) return null;

      // Reconstruir arquivo a partir dos chunks
      const chunks = chunksSnapshot.docs
        .sort((a, b) => a.data().index - b.data().index)
        .map((d) => d.data().data);

      const base64 = chunks.join('');
      
      // Converter base64 para ArrayBuffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const docSnapshot = await adminFirestore.collection(this.collectionName).doc(docId).get();
      const docData = docSnapshot.data();

      return {
        buffer: bytes.buffer,
        name: docData?.nomeArquivo || 'arquivo',
      };
    } catch (error) {
      console.error('❌ Erro ao obter arquivo:', error);
      return null;
    }
  }

  /**
   * Obter documentos por tipo
   */
  async getDocumentsByType(type: string): Promise<UploadDocument[]> {
    try {
      const snapshot = await adminFirestore
        .collection(this.collectionName)
        .where('tipo', '==', type)
        .where('status', '==', 'ativo')
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UploadDocument;
      });
    } catch (error) {
      console.error('❌ Erro ao obter documentos por tipo:', error);
      throw new Error('Erro ao obter documentos');
    }
  }

  /**
   * Obter documentos por setor
   */
  async getDocumentsBySector(sector: string): Promise<UploadDocument[]> {
    try {
      const snapshot = await adminFirestore
        .collection(this.collectionName)
        .where('setor', '==', sector)
        .where('status', '==', 'ativo')
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UploadDocument;
      });
    } catch (error) {
      console.error('❌ Erro ao obter documentos por setor:', error);
      throw new Error('Erro ao obter documentos');
    }
  }

  /**
   * Atualizar documento
   */
  async updateDocument(id: string, updates: Partial<UploadDocument>): Promise<void> {
    try {
      await adminFirestore.collection(this.collectionName).doc(id).update({
        ...updates,
        updatedAt: new Date(),
      });
      console.log('✅ Documento atualizado:', id);
    } catch (error) {
      console.error('❌ Erro ao atualizar documento:', error);
      throw new Error('Erro ao atualizar documento');
    }
  }

  /**
   * Deletar documento
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      await adminFirestore.collection(this.collectionName).doc(id).delete();
      console.log('✅ Documento deletado:', id);
    } catch (error) {
      console.error('❌ Erro ao deletar documento:', error);
      throw new Error('Erro ao deletar documento');
    }
  }

  /**
   * Arquivar documento (soft delete)
   */
  async archiveDocument(id: string): Promise<void> {
    try {
      await adminFirestore.collection(this.collectionName).doc(id).update({
        status: 'arquivado',
        updatedAt: new Date(),
      });
      console.log('✅ Documento arquivado:', id);
    } catch (error) {
      console.error('❌ Erro ao arquivar documento:', error);
      throw new Error('Erro ao arquivar documento');
    }
  }

  /**
   * Buscar documentos por título
   */
  async searchDocuments(searchTerm: string): Promise<UploadDocument[]> {
    try {
      const allDocs = await this.getAllDocuments();
      return allDocs.filter(
        (doc) =>
          doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('❌ Erro ao buscar documentos:', error);
      throw new Error('Erro ao buscar documentos');
    }
  }

  /**
   * Incrementar versão de um documento
   */
  async incrementVersion(id: string): Promise<void> {
    try {
      const docSnapshot = await adminFirestore.collection(this.collectionName).doc(id).get();
      const currentVersion = docSnapshot.data()?.version || 0;

      await adminFirestore.collection(this.collectionName).doc(id).update({
        version: currentVersion + 1,
        updatedAt: new Date(),
      });
      console.log('✅ Versão incrementada:', id);
    } catch (error) {
      console.error('❌ Erro ao incrementar versão:', error);
      throw new Error('Erro ao incrementar versão');
    }
  }
}

export default new DocumentUploadService();

