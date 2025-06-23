export async function getRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const data = Buffer.concat(chunks).toString();
  return JSON.parse(data);
}
