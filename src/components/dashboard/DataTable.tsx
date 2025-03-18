
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  headers: string[];
  rows: any[][];
  className?: string;
}

export function DataTable({ headers, rows, className }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtra as linhas com base no termo de pesquisa
  const filteredRows = rows.filter(row =>
    row.some(cell => 
      String(cell).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calcula a paginação
  const totalRows = filteredRows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const currentRows = filteredRows.slice(startIndex, endIndex);

  // Gerencia a paginação
  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className={cn("w-full rounded-xl bg-white p-4 flex flex-col", className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h3 className="text-xl font-medium">Tabela de Dados</h3>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar dados..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reseta para a primeira página ao pesquisar
            }}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex-1 rounded-md border relative overflow-hidden">
        <ScrollArea className="h-[400px] md:h-[500px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index} className="font-medium bg-muted/30 py-4 px-2 min-w-[150px]">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="hover:bg-muted/50 animate-fade-in" style={{ animationDelay: `${rowIndex * 50}ms` }}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} className="py-3 px-2 whitespace-nowrap">{String(cell || '')}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={headers.length} className="h-24 text-center">
                      {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhum dado disponível.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      {totalRows > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4 flex-wrap">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{endIndex} de {totalRows} linhas
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
