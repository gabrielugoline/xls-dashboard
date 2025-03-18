
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // em MB
  onFileSelected: (file: File) => void;
  className?: string;
}

export function FileUpload({
  accept = '.xlsx,.xls,.csv',
  maxSize = 5, // 5MB padrão
  onFileSelected,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Verifica tamanho do arquivo
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Tamanho do arquivo excede o limite de ${maxSize}MB`);
      return false;
    }

    // Verifica tipo de arquivo com base no prop accept
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const acceptedTypes = accept.split(',');
    
    if (!acceptedTypes.some(type => {
      // Manipula tipos mime wildcard como application/vnd.*
      if (type.includes('*')) {
        const typePrefix = type.split('*')[0];
        return file.type.startsWith(typePrefix);
      }
      // Manipula extensões
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      // Manipula tipos mime específicos
      return file.type === type;
    })) {
      setError(`Tipo de arquivo inválido. Aceitos: ${accept}`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ease-in-out",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30",
            className
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-muted">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Enviar arquivo Excel</h3>
              <p className="text-sm text-muted-foreground">
                Arraste e solte seu arquivo aqui ou clique para procurar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos suportados: .xlsx, .xls, .csv (Máx {maxSize}MB)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              Selecionar Arquivo
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[250px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
