const API = import.meta.env.VITE_API_BASE_URL;

// GET all stats
export async function fetchStats() {
  const res = await fetch(`${API}/trafficStats`);
  try {
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.stats ?? []; // { stats: [...] }
  } catch (err) {
    console.error("Fetch error: " + err);
  }
 
}

// POST new stat
export async function createStat(stat) {
  const res = await fetch(`${API}/trafficStat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stat),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json(); // { id, ...stat }
}

// POST multiple new stats
export async function createMultipleStats(stats) {
    const res = await fetch(`${API}/trafficStats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json(); // { id, ...stat }
  }

// PUT update stat
export async function updateStat(id, changes) {
  const res = await fetch(`${API}/trafficStats/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json(); // { id, ...changes }
}

// DELETE stat
export async function deleteStat(id) {
  const res = await fetch(`${API}/trafficStats/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// DELETE multiple stats
export async function deleteMultipleStats(ids) {
  const res = await fetch(`${API}/trafficStats`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('Failed to delete stats');
  return res.json();
}