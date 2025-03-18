
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart } from '@/components/dashboard/PieChart';
import { BarChart } from '@/components/dashboard/BarChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { parseExcelFile, type ParsedData, groupDataForChart, getColumnStatistics } from '@/utils/excelParser';
import { toast } from 'sonner';
import { BarChart3, PieChart as PieChartIcon, FileSpreadsheet, Table as TableIcon, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [labelColumn, setLabelColumn] = useState<number>(0);
  const [valueColumn, setValueColumn] = useState<number>(1);
  const [operation, setOperation] = useState<'sum' | 'count' | 'average'>('sum');
  const [chartData, setChartData] = useState<Array<{ label: string; value: number }>>([]);

  const handleFileSelected = async (file: File) => {
    try {
      setIsLoading(true);
      const data = await parseExcelFile(file);
      setParsedData(data);
      toast.success('File imported successfully!');

      // Set default columns for charts based on data
      if (data.headers.length > 0) {
        setLabelColumn(0);
        setValueColumn(data.headers.findIndex((header, index) => 
          index > 0 && typeof data.rows[0]?.[index] === 'number'
        ) || 1);
      }
    } catch (error) {
      toast.error('Failed to parse Excel file');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate chart data when parameters change
  useEffect(() => {
    if (parsedData?.rows && parsedData.rows.length > 0) {
      const data = groupDataForChart(parsedData.rows, labelColumn, valueColumn, operation);
      setChartData(data);
    }
  }, [parsedData, labelColumn, valueColumn, operation]);

  const renderColumnOptions = () => {
    if (!parsedData?.headers) return null;

    return parsedData.headers.map((header, index) => (
      <SelectItem key={index} value={index.toString()}>
        {header}
      </SelectItem>
    ));
  };

  // Calculate column statistics
  const columnStats = parsedData && valueColumn !== undefined
    ? getColumnStatistics(parsedData.rows, valueColumn)
    : null;

  return (
    <div className="section-container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Interactive Dashboard</h1>
          <p className="text-muted-foreground">
            Import your Excel file to generate interactive visualizations
          </p>
        </div>
        <div className="flex items-end">
          {user && (
            <div className="text-sm text-right">
              <p>{user.name}</p>
              <p className="text-muted-foreground">{user.role} · {user.institution}</p>
            </div>
          )}
        </div>
      </div>

      {!parsedData ? (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">Import Excel File</CardTitle>
            <CardDescription className="text-center">
              Upload your Excel spreadsheet to generate interactive visualizations
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <FileUpload 
              onFileSelected={handleFileSelected}
              className="max-w-xl w-full"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <div className="w-full lg:w-3/4">
              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value="charts" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Charts</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span className="hidden sm:inline">Insights</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="charts" className="mt-4 space-y-4">
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Chart Configuration</CardTitle>
                      <CardDescription>
                        Select columns and operation to customize the charts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Label Column</label>
                          <Select 
                            value={labelColumn.toString()} 
                            onValueChange={(val) => setLabelColumn(parseInt(val))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>{renderColumnOptions()}</SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Value Column</label>
                          <Select 
                            value={valueColumn.toString()} 
                            onValueChange={(val) => setValueColumn(parseInt(val))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>{renderColumnOptions()}</SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Operation</label>
                          <Select 
                            value={operation} 
                            onValueChange={(val) => setOperation(val as 'sum' | 'count' | 'average')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sum">Sum</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="count">Count</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <PieChart 
                      data={chartData}
                      title={`Pie Chart: ${parsedData.headers[labelColumn]} by ${parsedData.headers[valueColumn]}`}
                      loading={isLoading}
                    />
                    <BarChart 
                      data={chartData}
                      title={`Bar Chart: ${parsedData.headers[labelColumn]} by ${parsedData.headers[valueColumn]}`}
                      loading={isLoading}
                    />
                    <BarChart 
                      data={chartData}
                      title={`Horizontal Bar Chart: ${parsedData.headers[labelColumn]} by ${parsedData.headers[valueColumn]}`}
                      horizontal={true}
                      loading={isLoading}
                      className="col-span-1 lg:col-span-2"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="data" className="mt-4">
                  <ScrollArea className="w-full">
                    <DataTable 
                      headers={parsedData.headers} 
                      rows={parsedData.rows}
                    />
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="insights" className="mt-4 space-y-4">
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Data Insights</CardTitle>
                      <CardDescription>
                        Quick statistics and analysis from your data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              Rows
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{parsedData?.rows.length || 0}</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              Columns
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{parsedData?.headers.length || 0}</div>
                          </CardContent>
                        </Card>
                        
                        {columnStats?.sum !== null && (
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Sum of {parsedData?.headers[valueColumn]}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {columnStats?.sum?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        
                        {columnStats?.average !== null && (
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Average of {parsedData?.headers[valueColumn]}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {columnStats?.average?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                      
                      {columnStats?.min !== null && columnStats?.max !== null && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Minimum of {parsedData?.headers[valueColumn]}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {columnStats?.min?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Maximum of {parsedData?.headers[valueColumn]}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {columnStats?.max?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="w-full lg:w-1/4 space-y-4">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>File Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Columns:</span>
                    <span className="text-sm">{parsedData?.headers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Rows:</span>
                    <span className="text-sm">{parsedData?.rows.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={() => setParsedData(null)}>
                    Upload New File
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => {
                    // Re-generate chart data with current settings
                    if (parsedData) {
                      setIsLoading(true);
                      setTimeout(() => {
                        const data = groupDataForChart(parsedData.rows, labelColumn, valueColumn, operation);
                        setChartData(data);
                        setIsLoading(false);
                        toast.success('Charts refreshed');
                      }, 500);
                    }
                  }}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh Charts
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    XLS Panel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm opacity-90">
                    Interactive Excel Dashboard
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
