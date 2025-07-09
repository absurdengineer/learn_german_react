// Helper function to parse CSV line considering quoted fields and commas
export const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
  
    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];
  
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote within quoted field
          current += '"';
          i += 2;
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
  
    // Add the last field
    result.push(current.trim());
    return result;
  };
  