export interface ResearchRequest {
  question: string;
  user_id?: string;
  session_id?: string;
}

export interface ResearchResponse {
  response: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export async function askResearch(
  payload: ResearchRequest
): Promise<ResearchResponse> {
  const res = await fetch(`${API_BASE_URL}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = "Failed to fetch research response";
    try {
      const error = (await res.json()) as { detail?: string };
      if (error.detail) detail = error.detail;
    } catch {}
    throw new Error(detail);
  }

  return (await res.json()) as ResearchResponse;
}
