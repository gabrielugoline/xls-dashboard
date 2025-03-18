
import * as XLSX from 'xlsx';

export interface ParsedData {
  headers: string[];
  rows: any[];
  summary: {
    rowCount: number;
    columnCount: number;
  };
}

export const parseExcelFile = async (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Extract headers and rows
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        
        const result: ParsedData = {
          headers,
          rows,
          summary: {
            rowCount: rows.length,
            columnCount: headers.length
          }
        };
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Function to get unique values from a column (for filtering)
export const getUniqueValues = (data: any[], columnIndex: number): any[] => {
  const uniqueValues = new Set<any>();
  
  data.forEach(row => {
    if (row[columnIndex] !== undefined) {
      uniqueValues.add(row[columnIndex]);
    }
  });
  
  return Array.from(uniqueValues);
};

// Function to get column statistics
export const getColumnStatistics = (data: any[], columnIndex: number) => {
  const numericValues = data
    .map(row => row[columnIndex])
    .filter(value => typeof value === 'number' && !isNaN(value));
  
  if (numericValues.length === 0) {
    return {
      min: null,
      max: null,
      average: null,
      sum: null
    };
  }
  
  return {
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
    average: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
    sum: numericValues.reduce((a, b) => a + b, 0)
  };
};

// Function to perform grouping operations for charts
export const groupDataForChart = (
  data: any[],
  labelColumnIndex: number,
  valueColumnIndex: number,
  operation: 'sum' | 'count' | 'average' = 'sum'
) => {
  const groupedData: Record<string, number[]> = {};
  
  // Group values by label
  data.forEach(row => {
    const label = String(row[labelColumnIndex] || 'Undefined');
    const value = row[valueColumnIndex];
    
    if (typeof value === 'number' && !isNaN(value)) {
      if (!groupedData[label]) {
        groupedData[label] = [];
      }
      groupedData[label].push(value);
    } else if (operation === 'count') {
      if (!groupedData[label]) {
        groupedData[label] = [];
      }
      groupedData[label].push(1);
    }
  });
  
  // Perform the requested operation on each group
  const result = Object.entries(groupedData).map(([label, values]) => {
    let resultValue: number;
    
    switch (operation) {
      case 'sum':
        resultValue = values.reduce((sum, value) => sum + value, 0);
        break;
      case 'count':
        resultValue = values.length;
        break;
      case 'average':
        resultValue = values.length > 0 
          ? values.reduce((sum, value) => sum + value, 0) / values.length 
          : 0;
        break;
      default:
        resultValue = values.reduce((sum, value) => sum + value, 0);
    }
    
    return {
      label,
      value: resultValue
    };
  });
  
  return result;
};
