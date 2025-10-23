const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      success: false,
      error: "Method not allowed. Use POST to dispatch directory submissions.",
    });
  }

  try {
    const payload = parseJson(event.body);
    const { directory, slug, submissionMethod, supportsApiSubmission, apiEndpoint, payload: submissionPayload } = payload;

    if (!directory || !slug || typeof submissionPayload !== "object" || submissionPayload === null) {
      return jsonResponse(400, {
        success: false,
        error: "Missing directory metadata or payload object.",
      });
    }

    const auditEntry = {
      directory,
      slug,
      submissionMethod: submissionMethod ?? "manual",
      supportsApiSubmission: Boolean(supportsApiSubmission),
      apiEndpoint: apiEndpoint ?? null,
      receivedAt: new Date().toISOString(),
      fieldCount: Object.keys(submissionPayload).length,
    };

    console.info("📬 Directory submission payload received", auditEntry);

    // If an apiEndpoint is provided and the directory supports API submission, attempt to forward the payload.
    const forwardResults = [];
    if (apiEndpoint && supportsApiSubmission) {
      try {
        const headers = { "Content-Type": "application/json" };
        if (process.env.X_API) {
          // pass along the X_API secret as a header expected by some directory APIs
          headers["X-API"] = process.env.X_API;
          headers["x-api-key"] = process.env.X_API;
          headers["Authorization"] = `Bearer ${process.env.X_API}`;
        }

        const forwardResp = await fetch(apiEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(submissionPayload),
        });

        let forwardBody = null;
        try {
          forwardBody = await forwardResp.json();
        } catch (e) {
          forwardBody = await forwardResp.text();
        }

        forwardResults.push({ url: apiEndpoint, status: forwardResp.status, body: forwardBody });
      } catch (err) {
        console.error("❌ Forwarding to apiEndpoint failed", err);
        forwardResults.push({ url: apiEndpoint, error: err instanceof Error ? err.message : String(err) });
      }
    }

    return jsonResponse(200, {
      success: true,
      message: `${directory} payload captured. Forward to your automation runner to complete submission.`,
      audit: auditEntry,
      forwarded: forwardResults,
    });
  } catch (error) {
    console.error("❌ Directory submission handler error", error);
    return jsonResponse(500, {
      success: false,
      error: error instanceof Error ? error.message : "Internal error while processing submission.",
    });
  }
}

function parseJson(body) {
  if (!body) {
    throw new Error("Request body cannot be empty.");
  }
  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON payload.");
  }
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
