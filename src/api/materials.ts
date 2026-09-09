export async function getMaterials() {
  const response = await fetch('https://gardin-b2b.vercel.app/materials');

  if (!response.ok) {
    throw new Error('Не вдалося завантажити товари');
  }

  return response.json();
}