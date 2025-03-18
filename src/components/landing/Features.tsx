
import React from 'react';
import { FileSpreadsheet, BarChart4, PieChart, Table, Zap, Lock } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <FileSpreadsheet className="h-10 w-10 text-primary" />,
      title: 'Importação de Excel',
      description: 'Importe planilhas Excel (.xlsx, .xls, .csv) facilmente com arrastar e soltar.'
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: 'Gráficos de Barras',
      description: 'Visualize seus dados com gráficos de barras responsivos que se adaptam automaticamente ao tamanho da tela.'
    },
    {
      icon: <PieChart className="h-10 w-10 text-primary" />,
      title: 'Gráficos de Pizza',
      description: 'Crie belos gráficos de pizza para mostrar proporções e porcentagens em seus dados.'
    },
    {
      icon: <Table className="h-10 w-10 text-primary" />,
      title: 'Tabelas de Dados',
      description: 'Visualize e pesquise seus dados brutos com filtragem e paginação poderosas.'
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: 'Análise Instantânea',
      description: 'Obtenha insights imediatos com análise automática de dados e cálculo de estatísticas.'
    },
    {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: 'Segurança',
      description: 'Seus dados nunca saem do seu navegador, garantindo total privacidade e segurança.'
    }
  ];

  return (
    <div className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recursos Poderosos
          </h2>
          <p className="text-muted-foreground">
            Tudo o que você precisa para transformar seus dados Excel em visualizações interativas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-background rounded-xl p-6 border shadow-sm card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 p-2 w-fit rounded-full bg-primary/10">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
