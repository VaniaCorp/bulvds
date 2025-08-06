const API_URL = 'https://api.bulvds.com/guest/property';

async function fetchApartmentsPage(page = 1, perPage = 10) {
  try {
    const url = new URL(API_URL);
    url.searchParams.append('page', page);
    url.searchParams.append('perPage', perPage);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.status) {
      throw new Error(result.message || 'Unknown error from API');
    }

    return result;
  } catch (error) {
    console.error(`Failed to fetch apartments page ${page}:`, error);
    return null;
  }
}

async function fetchAllApartments(perPage = 10) {
  try {
    const firstPage = await fetchApartmentsPage(1, perPage);
    if (!firstPage) return null;

    const apartments = [...(firstPage.data || [])];
    const { pageCount } = firstPage.meta || {};

    if (pageCount && pageCount > 1) {
      const pagePromises = [];
      for (let page = 2; page <= pageCount; page++) {
        pagePromises.push(fetchApartmentsPage(page, perPage));
      }
      const pages = await Promise.all(pagePromises);

      pages.forEach(pageResult => {
        if (pageResult && Array.isArray(pageResult.data)) {
          apartments.push(...pageResult.data);
        }
      });
    }

    return apartments;
  } catch (error) {
    console.error('Failed to fetch all apartments:', error);
    return null;
  }
}

function createApartmentCard(apartment, size = 'mid') {
  const card = document.createElement('div');
  card.className = `apartment-card ${size}`;
  
  const imageUrl = apartment.images && apartment.images.length > 0 
    ? apartment.images[0].url 
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
  
  const title = apartment.title && apartment.title.length > 30 
    ? apartment.title.substring(0, 30) + '...' 
    : apartment.title || 'Untitled Property';
  
  const location = apartment.region && apartment.city 
    ? `${apartment.city}, ${apartment.region.toUpperCase()}.`
    : apartment.region || apartment.city || 'Location not specified';

  card.innerHTML = `
    <div class="apartment-image">
      <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+">
    </div>
    <div class="apartment-info">
      <h3 class="apartment-title">${title}</h3>
      <p class="apartment-location">${location}</p>
    </div>
  `;

  return card;
}

function createColumn(apartments, startIndex) {
  const column = document.createElement('div');
  column.className = 'apartment-column';
  
  // Get 3 apartments for this column
  const columnApartments = apartments.slice(startIndex, startIndex + 3);
  
  if (columnApartments.length === 0) return null;
  
  // Define column layouts - each column has 3 items with specific size combinations
  const layouts = [
    ['big', 'mid', 'small'],
    ['mid', 'big', 'small'],
    ['small', 'big', 'mid'],
    ['mid', 'small', 'big'],
    ['small', 'mid', 'big'],
    ['big', 'small', 'mid']
  ];
  
  // Randomly select a layout for this column
  const layout = layouts[Math.floor(Math.random() * layouts.length)];
  
  columnApartments.forEach((apartment, index) => {
    if (index < 3) {
      const card = createApartmentCard(apartment, layout[index]);
      column.appendChild(card);
    }
  });
  
  return column;
}

function createMarqueeContent(apartments) {
  const marqueeContent = document.createElement('div');
  marqueeContent.className = 'marquee-content';
  
  // Create columns with 3 apartments each
  for (let i = 0; i < apartments.length; i += 3) {
    const column = createColumn(apartments, i);
    if (column) {
      marqueeContent.appendChild(column);
    }
  }
  
  // Ensure we have enough content for smooth looping
  // If we have less than 6 columns, duplicate some to ensure smooth animation
  let columnCount = marqueeContent.children.length;
  if (columnCount < 6) {
    const additionalColumns = [];
    for (let i = 0; i < apartments.length && additionalColumns.length < (6 - columnCount); i += 3) {
      const column = createColumn(apartments, i);
      if (column) {
        additionalColumns.push(column);
      }
    }
    additionalColumns.forEach(column => marqueeContent.appendChild(column));
  }
  
  // Duplicate the content for seamless looping
  const duplicate = marqueeContent.cloneNode(true);
  marqueeContent.appendChild(duplicate);
  
  // Calculate the exact width of the first set of columns for proper animation
  columnCount = marqueeContent.children.length / 2;
  const getColumnWidth = () => {
    if (window.innerWidth <= 480) return 260;
    if (window.innerWidth <= 768) return 280;
    if (window.innerWidth <= 1200) return 300;
    return 320;
  };
  
  const getGapWidth = () => {
    if (window.innerWidth <= 480) return 24; // 1.5rem
    if (window.innerWidth <= 768) return 32; // 2rem
    if (window.innerWidth <= 1200) return 48; // 3rem
    return 64; // 4rem
  };
  
  const columnWidth = getColumnWidth();
  const gapWidth = getGapWidth();
  const firstSetWidth = columnCount * columnWidth + (columnCount - 1) * gapWidth;
  
  // Set custom property for animation
  marqueeContent.style.setProperty('--marquee-width', `${firstSetWidth}px`);
  
  return marqueeContent;
}

function initializeApartmentsMarquee() {
  const apartmentsDisplay = document.getElementById('apartments-display');
  if (!apartmentsDisplay) {
    console.error('Apartments display element not found');
    return;
  }

  apartmentsDisplay.innerHTML = '<div class="loading">Loading apartments...</div>';

  fetchAllApartments(15).then(apartments => {
    if (!apartments || apartments.length === 0) {
      apartmentsDisplay.innerHTML = '<div class="no-apartments">No apartments available</div>';
      return;
    }

    apartmentsDisplay.innerHTML = '';
    
    const marqueeContainer = document.createElement('div');
    marqueeContainer.className = 'apartments-marquee';
    
    const marqueeContent = createMarqueeContent(apartments);
    marqueeContainer.appendChild(marqueeContent);
    
    apartmentsDisplay.appendChild(marqueeContainer);
  });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApartmentsMarquee);
} else {
  initializeApartmentsMarquee();
}

