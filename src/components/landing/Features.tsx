
import React from 'react';
import { FileSpreadsheet, BarChart4, PieChart, Table, Zap, LineChart, Lock } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <FileSpreadsheet className="h-10 w-10 text-primary" />,
      title: 'Excel Import',
      description: 'Seamlessly import Excel spreadsheets (.xlsx, .xls, .csv) with just a drag and drop.'
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: 'Bar Charts',
      description: 'Visualize your data with responsive bar charts that automatically adapt to your screen size.'
    },
    {
      icon: <PieChart className="h-10 w-10 text-primary" />,
      title: 'Pie Charts',
      description: 'Create beautiful pie charts to show proportions and percentages in your data.'
    },
    {
      icon: <Table className="h-10 w-10 text-primary" />,
      title: 'Data Tables',
      description: 'View and search through your raw data with powerful filtering and pagination.'
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: 'Instant Analysis',
      description: 'Get immediate insights with automatic data analysis and statistics calculation.'
    },
    {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: 'Secure',
      description: 'Your data never leaves your browser, ensuring complete privacy and security.'
    }
  ];

  return (
    <div className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground">
            Everything you need to transform your Excel data into interactive visualizations
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
