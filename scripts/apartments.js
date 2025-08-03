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
    // Fetch first page to get meta info
    const firstPage = await fetchApartmentsPage(1, perPage);
    if (!firstPage) return null;

    const apartments = [...(firstPage.data || [])];
    const { pageCount } = firstPage.meta || {};

    if (pageCount && pageCount > 1) {
      // Fetch remaining pages in parallel
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

// Example usage:
fetchAllApartments().then(allApartments => {
  if (allApartments) {
    console.log('All apartments:', allApartments);
  }
});