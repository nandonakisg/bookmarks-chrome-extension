// Simple error logging utility
export const logger = {
  errors: [],
  
  error(message, error) {
    const timestamp = new Date().toISOString();
    const errorObj = {
      timestamp,
      message,
      error: error?.message || error,
      stack: error?.stack
    };
    
    this.errors.push(errorObj);
    this.display(errorObj);
    
    // Also log to console
    console.error(message, error);
  },
  
  display(errorObj) {
    let container = document.getElementById('error-log');
    if (!container) {
      container = document.createElement('div');
      container.id = 'error-log';
      container.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 200px;
        overflow-y: auto;
        background: #fee;
        border-top: 2px solid #f66;
        font-family: monospace;
        font-size: 12px;
        padding: 8px;
        z-index: 9999;
      `;
      document.body.appendChild(container);
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'margin-bottom: 8px; border-bottom: 1px solid #fcc; padding-bottom: 4px;';
    errorDiv.innerHTML = `
      <div style="color: #666;">[${errorObj.timestamp}]</div>
      <div style="color: #c00; margin: 4px 0;">${errorObj.message}</div>
      ${errorObj.stack ? `<pre style="margin: 0; color: #666; font-size: 11px;">${errorObj.stack}</pre>` : ''}
    `;
    
    container.appendChild(errorDiv);
    container.scrollTop = container.scrollHeight;
  },
  
  getErrors() {
    return this.errors;
  },
  
  clear() {
    this.errors = [];
    const container = document.getElementById('error-log');
    if (container) {
      container.innerHTML = '';
    }
  }
};