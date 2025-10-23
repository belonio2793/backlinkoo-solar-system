export const config = { schedule: '0 3 * * *' };

export default async () => {
  return new Response(
    JSON.stringify({ success: true, updated: 0, message: 'Beautification disabled; serving raw HTML as-is.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
