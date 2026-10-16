// Utility functions for localStorage management

export const clearAllData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('currentAssessment');
  // Clear any checklist data
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('checklist_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('All app data cleared from localStorage');
};

export const resetApp = () => {
  clearAllData();
  window.location.reload();
};

// Add a global function for debugging
(window as any).resetApp = resetApp;
