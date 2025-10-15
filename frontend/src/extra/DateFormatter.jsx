// utils/dateFormatter.js
export const formatUserTableDate = (dateString) => {
  if (!dateString) return "-";
  
  try {
    // Handle the specific format: "10/4/2025, 2:57:21 PM"
    if (typeof dateString === 'string' && dateString.includes('/') && dateString.includes(':')) {
      const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/);
      
      if (match) {
        const [, month, day, year, hour, minute, second, period] = match;
        
        let hour24 = parseInt(hour, 10);
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        
        const date = new Date(year, month - 1, day, hour24, minute, second);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-GB');
        }
      }
    }
    
    // Fallback for other formats
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleDateString('en-GB') : "-";
  } catch {
    return "-";
  }
};