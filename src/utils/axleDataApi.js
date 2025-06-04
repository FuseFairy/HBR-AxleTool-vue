const API_BASE_URL = 'https://hbr-axle-db.vercel.app'
const API_KEY = import.meta.env.VITE_DB_API_KEY

export async function uploadDate(axle_id, data) {
  const apiUrl = `${API_BASE_URL}/upload?axle_id=${axle_id}`
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
       'x-api-key': `${API_KEY}`, 
     },
    body: JSON.stringify({ data: data }),
  })

  return response
}

export async function getData(axle_id) {
  const apiUrl = `${API_BASE_URL}/get?axle_id=${axle_id}`
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': `${API_KEY}`, 
    },
  })

  return response
}
