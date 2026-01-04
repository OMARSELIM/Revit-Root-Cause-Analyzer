import { WarningGroup } from '../types';

/**
 * Parses raw text or basic HTML content from a Revit Error report.
 * Returns grouped warnings with counts.
 */
export const parseWarnings = (input: string): WarningGroup[] => {
  const groups: Record<string, number> = {};
  
  // 1. Try to handle HTML content if it looks like an export
  if (input.includes('<html') || input.includes('<table')) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    
    // Revit HTML exports often put the warning message in a specific cell or list item
    // This is a heuristic approach
    const cells = doc.querySelectorAll('td, li, p'); 
    
    cells.forEach(cell => {
      const text = cell.textContent?.trim();
      if (text && text.length > 10 && !text.startsWith('Element ID')) {
        // Very basic heuristic to identify warning text vs headers
        // Real Revit exports are table-based: Error | Element | ID
        // We look for common warning phrases or just aggregate non-ID strings
        if (!text.match(/^\d+$/)) { // ignore simple numbers
           groups[text] = (groups[text] || 0) + 1;
        }
      }
    });
  } else {
    // 2. Handle Plain Text (Copy/Paste)
    // Split by newlines
    const lines = input.split(/\n/);
    lines.forEach(line => {
      const cleaned = line.trim();
      if (cleaned.length > 5) {
        // Exclude lines that look like IDs or generic headers if possible
        if (!cleaned.match(/^id \d+/i) && !cleaned.toLowerCase().includes('warning report')) {
          groups[cleaned] = (groups[cleaned] || 0) + 1;
        }
      }
    });
  }

  // Convert map to array
  return Object.entries(groups).map(([message, count]) => ({
    message,
    count
  })).sort((a, b) => b.count - a.count); // Sort by frequency
};
