import axios from "axios";

// Generate or retrieve session ID from localStorage
function getSessionId() {
  let sessionId = localStorage.getItem("chatSessionId");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chatSessionId", sessionId);
  }
  return sessionId;
}

// Clear session (for starting fresh)
export function clearSession() {
  localStorage.removeItem("chatSessionId");
}

// Standard request (non-streaming)
export async function requestNavigationGuidance(question) {
  const response = await axios.post("/api/navigate", {
    question,
    sessionId: getSessionId(),
  });
  return response.data;
}

// Streaming request
export async function requestNavigationGuidanceStream(question, onDelta, onComplete, onError) {
  const sessionId = getSessionId();

  try {
    const response = await fetch("/api/navigate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        sessionId,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Process complete lines, keep incomplete line in buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));

          if (data.type === "delta") {
            onDelta?.(data);
          } else if (data.type === "complete") {
            onComplete?.(data.data);
            return;
          } else if (data.type === "error") {
            onError?.(new Error(data.error));
            return;
          }
        }
      }
    }
  } catch (error) {
    console.error("Streaming error:", error);
    onError?.(error);
  }
}
