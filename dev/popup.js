import { createGrid } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './style.css';
import { bookmarksAPI } from './bookmarks.js';
import { logger } from './logger.js';

function getFavicon(url) {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
  } catch (error) {
    logger.error(`Failed to get favicon for URL: ${url}`, error);
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="%23ddd"/></svg>';
  }
}

function faviconRenderer(params) {
  if (!params.value) return '';
  return `
    <div class="favicon-cell">
      <img src="${getFavicon(params.value)}" class="favicon" alt="favicon">
      <a href="${params.value}" target="_blank">${params.value}</a>
    </div>
  `;
}

function flattenBookmarks(bookmarks) {
  const flattened = [];
  
  function traverse(items, path = '') {
    for (const item of items) {
      if (item.url) {
        flattened.push({
          id: item.id,
          title: item.title,
          url: item.url,
          folder: path,
          dateAdded: item.dateAdded ? new Date(item.dateAdded) : new Date()
        });
      }
      
      if (item.children) {
        const newPath = path ? `${path} / ${item.title}` : item.title;
        traverse(item.children, newPath);
      }
    }
  }
  
  traverse(bookmarks);
  return flattened;
}

function exportToCsv(data, filename) {
  try {
    const headers = ['Folder', 'Title', 'URL', 'Date Added'];
    const rows = data.map(item => [
      item.folder,
      item.title,
      item.url,
      new Date(item.dateAdded).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (error) {
    logger.error('Failed to export CSV:', error);
  }
}

async function initializeGrid() {
  try {
    const gridDiv = document.querySelector('#grid');
    const bookmarks = await bookmarksAPI.getBookmarks();
    const rowData = flattenBookmarks(bookmarks);

    const gridOptions = {
      columnDefs: [
        {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 40,
          pinned: 'left',
          suppressSizeToFit: true,
          lockPosition: true
        },
        {
          field: 'folder',
          headerName: 'Folder',
          editable: false,
          flex: 1,
          minWidth: 150,
          suppressSizeToFit: false
        },
        {
          field: 'title',
          headerName: 'Title',
          editable: true,
          flex: 1,
          sort: 'asc',
          minWidth: 200,
          suppressSizeToFit: false
        },
        {
          field: 'dateAdded',
          headerName: 'Date Added',
          editable: false,
          sortable: true,
          filter: 'agDateColumnFilter',
          valueFormatter: params => params.value.toLocaleDateString(),
          minWidth: 120,
          suppressSizeToFit: false
        },
        {
          field: 'url',
          headerName: 'URL',
          editable: true,
          flex: 2,
          cellRenderer: faviconRenderer,
          minWidth: 300,
          suppressSizeToFit: false
        }
      ],
      rowData,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        suppressMovable: false
      },
      rowSelection: 'multiple',
      suppressCellFocus: true,
      rowHeight: 32,
      headerHeight: 32,
      onCellValueChanged: params => {
        if (bookmarksAPI.isExtension) {
          try {
            chrome.bookmarks.update(params.data.id, {
              title: params.data.title,
              url: params.data.url
            });
          } catch (error) {
            logger.error('Failed to update bookmark:', error);
          }
        }
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      onGridSizeChanged: params => {
        params.api.sizeColumnsToFit();
      }
    };

    const grid = createGrid(gridDiv, gridOptions);

    // Delete Selected Button
    document.getElementById('deleteSelected').addEventListener('click', () => {
      const selectedRows = gridOptions.api.getSelectedRows();
      if (selectedRows.length === 0) return;

      if (confirm(`Delete ${selectedRows.length} bookmark(s)?`)) {
        if (bookmarksAPI.isExtension) {
          selectedRows.forEach(row => {
            try {
              chrome.bookmarks.remove(row.id);
            } catch (error) {
              logger.error(`Failed to delete bookmark ${row.id}:`, error);
            }
          });
        }
        gridOptions.api.applyTransaction({ remove: selectedRows });
      }
    });

    // Export CSV Button
    document.getElementById('exportCsv').addEventListener('click', () => {
      const selectedRows = gridOptions.api.getSelectedRows();
      const filteredRows = gridOptions.api.getModel().rowsToDisplay;
      
      let dataToExport;
      let filename;
      
      if (selectedRows.length > 0) {
        dataToExport = selectedRows;
        filename = 'bookmarks-selected.csv';
      } else if (filteredRows.length < rowData.length) {
        dataToExport = filteredRows.map(row => row.data);
        filename = 'bookmarks-filtered.csv';
      } else {
        dataToExport = rowData;
        filename = 'bookmarks-all.csv';
      }
      
      exportToCsv(dataToExport, filename);
    });

    // Search Input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', e => {
      gridOptions.api.setQuickFilter(e.target.value);
    });

  } catch (error) {
    logger.error('Failed to initialize grid:', error);
  }
}

// Wait for DOM content to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGrid);
} else {
  initializeGrid();
}