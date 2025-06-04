const API_BASE_URL = import.meta.env.VITE_DB_API

export async function uploadDate(axle_id, data) {
  const apiUrl = `${API_BASE_URL}/upload?axle_id=${axle_id}`
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: data }),
  })

  return response
}

export async function getData(axle_id) {
  const apiUrl = `${API_BASE_URL}/get?axle_id=${axle_id}`
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  return response
}
