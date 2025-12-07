exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      ok: true,
      message: 'Test handler working',
      timestamp: new Date().toISOString(),
      x_api_configured: !!process.env.X_API
    })
  };
};
