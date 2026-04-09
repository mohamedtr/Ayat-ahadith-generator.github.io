import { useEffect, useMemo, useState } from 'react';

export function useContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    fetch('/data/lib.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load the local content library.');
        }
        return response.json();
      })
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((fetchError) => {
        if (!mounted) return;
        setError(fetchError.message || 'Unable to load content.');
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const collections = useMemo(() => {
    const ayat = items.filter((item) => item.type === 'ayah');
    const hadith = items.filter((item) => item.type === 'hadith');
    return { ayat, hadith, all: items };
  }, [items]);

  const getRandomItem = (type = 'random', excludeId) => {
    const pool =
      type === 'ayah'
        ? collections.ayat
        : type === 'hadith'
          ? collections.hadith
          : collections.all;

    const filteredPool = excludeId ? pool.filter((item) => item.id !== excludeId) : pool;
    if (!filteredPool.length) return null;
    return filteredPool[Math.floor(Math.random() * filteredPool.length)];
  };

  return {
    items,
    loading,
    error,
    collections,
    getRandomItem,
  };
}
