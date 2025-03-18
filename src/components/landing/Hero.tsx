
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Decorações de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-[200px] h-[200px] bg-blue-400/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-purple-400/10 rounded-full blur-2xl" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2 animate-fade-in">
            <span>Dashboard Interativo para Excel</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
            Transforme seus dados Excel em <span className="text-primary">insights valiosos</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl animate-fade-in">
            XLS Panel transforma suas planilhas Excel em dashboards interativos com apenas alguns cliques.
            Sem necessidade de programação. Faça upload dos seus dados e comece a visualizar instantaneamente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button size="lg" className="gap-2 rounded-full">
                Começar Agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="pt-8 w-full max-w-2xl">
            <div className="relative w-full aspect-video overflow-hidden rounded-xl border shadow-xl animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-panel p-6 rounded-xl max-w-xs">
                  <div className="flex items-center justify-center mb-2">
                    <FileSpreadsheet className="h-8 w-8 text-primary mr-2" />
                    <h3 className="text-xl font-bold">XLS Panel</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Transformando planilhas em visualizações interativas
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-12 bg-primary/20 rounded-md animate-pulse" />
                    <div className="h-12 bg-blue-400/20 rounded-md animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="h-12 bg-purple-400/20 rounded-md animate-pulse" style={{ animationDelay: '0.4s' }} />
                    <div className="h-12 bg-primary/20 rounded-md animate-pulse" style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
