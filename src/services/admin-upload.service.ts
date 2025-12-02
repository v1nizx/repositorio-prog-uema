import { getStorageBucket, getFirestoreDb } from '@/config/firebase-admin.config';
import { Timestamp } from 'firebase-admin/firestore';

// Interface atualizada para bater com o padrão (Inglês)
export interface AcademicDocument {
  id?: string;
  title: string;      // era titulo
  type: string;       // era tipo
  author: string;     // era autor
  sector: string;     // era setor
  description: string;// era descricao
  fileName: string;   // era nomeArquivo
  fileSize: number;   // era tamanhoArq (novo, calculado auto)
  fileUrl: string;    // era urlArquivo
  uploadedAt?: Date;
  updatedAt?: Date;
  version: number;    // era versao
  status: 'active' | 'archived'; // era 'ativo'
}

/**
 * Serviço de upload para uso no servidor (RSC/API Routes)
 * Usa Firebase Admin SDK
 */
class AdminUploadService {
  private readonly collectionName = 'documents';
  private readonly storagePath = 'documents';
  
  private get storage() {
    return getStorageBucket();
  }
  
  private get db() {
    return getFirestoreDb();
  }

  /**
   * Upload um arquivo para o Firebase Storage (servidor)
   */
  async uploadFile(
    file: Buffer,
    originalFileName: string,
    metadata: Omit<AcademicDocument, 'id' | 'fileUrl' | 'fileName' | 'fileSize' | 'uploadedAt' | 'updatedAt' | 'version' | 'status'>
  ): Promise<AcademicDocument> {
    try {
      const bucket = this.storage.bucket();
      const timestamp = Date.now();
      
      // Limpeza de nome para evitar erros na URL (mesmo padrão do front)
      const cleanName = originalFileName.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileNameWithTimestamp = `${timestamp}_${cleanName}`;
      
      const file_ref = bucket.file(`${this.storagePath}/${fileNameWithTimestamp}`);

      // Upload do arquivo
      await file_ref.save(file, {
        metadata: {
          contentType: 'application/octet-stream', // ou detecte o mime-type se possível
        },
        public: true, // Atenção: Isso torna o arquivo acessível publicamente
      });

      // Gerar URL de download público
      // Nota: Dependendo da config do bucket, pode ser necessário usar getSignedUrl,
      // mas para arquivos públicos essa estrutura funciona.
      const fileUrl = `https://storage.googleapis.com/${bucket.name}/${this.storagePath}/${fileNameWithTimestamp}`;

      const now = new Date();
      
      // Preparar objeto com os nomes em INGLÊS
      const documentData: AcademicDocument = {
        title: metadata.title,
        type: metadata.type,
        author: metadata.author,
        sector: metadata.sector,
        description: metadata.description,
        fileName: originalFileName,
        fileSize: file.length, // Calcula o tamanho baseado no Buffer
        fileUrl: fileUrl,
        uploadedAt: now,
        updatedAt: now,
        version: 1,
        status: 'active', // 'ativo' -> 'active'
      };

      // Salva no Firestore
      const docRef = await this.db.collection(this.collectionName).add({
        ...documentData,
        uploadedAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });

      return {
        ...documentData,
        id: docRef.id,
      };
    } catch (error) {
      console.error('❌ Erro ao fazer upload (Admin):', error);
      throw new Error(`Erro ao fazer upload do arquivo: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    }
  }

  /**
   * Obter todos os documentos ativos
   */
  async getAllDocuments(): Promise<AcademicDocument[]> {
    try {
      // Busca apenas os status 'active'
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('status', '==', 'active') 
        .get();

      const documents: AcademicDocument[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({
          id: doc.id,
          title: data.title,
          type: data.type,
          author: data.author,
          sector: data.sector,
          description: data.description,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileUrl: data.fileUrl,
          version: data.version,
          status: data.status,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as AcademicDocument);
      });

      return documents;
    } catch (error) {
      console.error('❌ Erro ao obter documentos (Admin):', error);
      throw new Error('Erro ao obter documentos');
    }
  }

  /**
   * Deletar um documento (Metadados + Arquivo Opcional)
   * Agora busca o documento antes para tentar deletar o arquivo do Storage também
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      const docRef = this.db.collection(this.collectionName).doc(documentId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        throw new Error('Documento não encontrado');
      }

      const data = docSnap.data();

      // Tenta deletar o arquivo físico se tivermos o nome ou URL
      // Aqui usamos uma lógica reversa para achar o path no bucket
      if (data?.fileUrl && data?.fileName) {
        try {
            // Extrai o nome do arquivo salvo (que tem o timestamp) da URL ou salva no banco separadamente
            // Se você não salvar o "storagePath" no banco, terá que inferir da URL.
            // Simplificação: Se a URL contém o nome do bucket, tentamos extrair o path
            const bucketName = this.storage.bucket().name;
            if(data.fileUrl.includes(bucketName)) {
                const pathParts = data.fileUrl.split(`${bucketName}/`);
                if(pathParts[1]) {
                    const filePath = decodeURIComponent(pathParts[1]);
                    await this.storage.bucket().file(filePath).delete();
                }
            }
        } catch (err) {
            console.warn("⚠️ Não foi possível deletar o arquivo do Storage (pode já ter sido deletado):", err);
        }
      }

      // Deleta o registro do banco
      await docRef.delete();

    } catch (error) {
      console.error('❌ Erro ao deletar documento (Admin):', error);
      throw new Error('Erro ao deletar documento');
    }
  }
}

const adminUploadService = new AdminUploadService();
export default adminUploadService;