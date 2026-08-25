export async function getMaterials() {
  const response = await fetch('http://localhost:3001/materials');

  if (!response.ok) {
    throw new Error('Не вдалося завантажити товари');
  }

  return response.json();
}