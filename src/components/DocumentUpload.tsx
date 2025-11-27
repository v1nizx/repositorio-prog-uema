'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

export function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    author: '',
    sector: '',
    description: ''
  });

  const { upload, isLoading, error, progress } = useDocumentUpload({
    onSuccess: () => {
      setShowSuccessMessage(true);
      setUploadSuccess(true);
      setSelectedFile(null);
      setFormData({
        title: '',
        type: '',
        author: '',
        sector: '',
        description: ''
      });
      setTimeout(() => setShowSuccessMessage(false), 5000);
    },
    onError: (err) => {
      console.error('Erro no upload:', err);
    },
  });

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.title || !formData.type || !formData.author || !formData.sector) {
      return;
    }

    try {
      await upload(selectedFile, {
        title: formData.title,
        type: formData.type,
        author: formData.author,
        sector: formData.sector,
        description: formData.description,
      });
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
    }
  };

  const isFormValid = selectedFile && formData.title && formData.type && formData.author && formData.sector;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-gray-900">Upload de Documentos</h2>
        <p className="text-gray-600">Adicione novos documentos ao sistema</p>
      </div>

      {uploadSuccess && showSuccessMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Documento enviado com sucesso! O versionamento foi aplicado automaticamente.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors"
          >
            {!selectedFile ? (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 mb-2">
                  Arraste e solte seu arquivo aqui
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ou clique para selecionar
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.xlsx"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isLoading}
                >
                  Selecionar Arquivo
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  Formatos aceitos: PDF, DOCX, XLSX (máx. 50MB)
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                      <p className="text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    disabled={isLoading}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {isLoading && progress.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Enviando...</span>
                      <span className="text-gray-600">{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-gray-900 font-semibold">Metadados Obrigatórios</h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="font-medium text-gray-700">
                Título *
              </Label>
              <Input
                id="title"
                placeholder="Digite o título do documento"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isLoading}
                required
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Select TIPO DE DOCUMENTO corrigido */}
              <div className="space-y-3">
                <Label htmlFor="type" className="font-medium text-gray-700">
                  Tipo de Documento *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="type" className="w-full bg-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  {/* Adicionado bg-white, z-50 e shadow */}
                  <SelectContent className="bg-white z-50 shadow-xl border border-gray-200">
                    <SelectItem value="ppc">PPC</SelectItem>
                    <SelectItem value="resolucao">Resolução</SelectItem>
                    <SelectItem value="relatorio">Relatório</SelectItem>
                    <SelectItem value="ata">Ata</SelectItem>
                    <SelectItem value="dados">Dados Estatísticos</SelectItem>
                    <SelectItem value="processo">Processo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select SETOR corrigido */}
              <div className="space-y-3">
                <Label htmlFor="sector" className="font-medium text-gray-700">
                  Setor *
                </Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => setFormData({ ...formData, sector: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="sector" className="w-full bg-white">
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  {/* Adicionado bg-white, z-50 e shadow */}
                  <SelectContent className="bg-white z-50 shadow-xl border border-gray-200">
                    <SelectItem value="coordenacao-eng">Coordenação de Engenharia</SelectItem>
                    <SelectItem value="coordenacao-comp">Coordenação de Computação</SelectItem>
                    <SelectItem value="secretaria">Secretaria Geral</SelectItem>
                    <SelectItem value="colegiado">Colegiado de Curso</SelectItem>
                    <SelectItem value="cpa">CPA</SelectItem>
                    <SelectItem value="registro">Registro Acadêmico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="author" className="font-medium text-gray-700">
                Autor *
              </Label>
              <Input
                id="author"
                placeholder="Nome do autor"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                disabled={isLoading}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="font-medium text-gray-700">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição ou observações sobre o documento"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviar Documento
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              setFormData({
                title: '',
                type: '',
                author: '',
                sector: '',
                description: ''
              });
            }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-blue-900 mb-2">Versionamento Automático</h4>
        <p className="text-sm text-blue-800">
          O sistema detecta automaticamente se um documento com o mesmo título já existe e cria uma nova versão, mantendo o histórico completo.
        </p>
      </div>
    </div>
  );
}