(function () {
  function cleanText(value) {
    return String(value || '')
      .trim()
      .replace(/^(?:\d+\s*,\s*)+\d+\s+/u, '')
      .trim();
  }

  function normalizeRecord(item) {
    if (!item || typeof item !== 'object') return item;
    return {
      ...item,
      city: cleanText(item.city),
      univ: cleanText(item.univ),
      fac: cleanText(item.fac),
      prog: cleanText(item.prog)
    };
  }

  window.DATA_LISANS = (window.DATA_LISANS || []).map(normalizeRecord);
  window.DATA_ONLISANS = (window.DATA_ONLISANS || []).map(normalizeRecord);

  try {
    const rawFavs = JSON.parse(localStorage.getItem('yks_tercih_favs') || '[]');
    localStorage.setItem(
      'yks_tercih_favs',
      JSON.stringify(Array.isArray(rawFavs) ? rawFavs.map(normalizeRecord) : [])
    );
  } catch (err) {
    localStorage.removeItem('yks_tercih_favs');
  }
})();
