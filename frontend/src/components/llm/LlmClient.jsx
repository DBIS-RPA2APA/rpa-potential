// src/services/llm/llmClient.js

/**
 * messageHistory: [{ role: "user" | "assistant", content: string }]
 * returns: { role: "assistant", content: string }
 */
export async function sendChatMessageMock(messageHistory) {
  const lastUser =
    [...messageHistory].reverse().find((m) => m.role === "user")?.content ?? "";

  // kleine Fake-Latenz
  await new Promise((r) => setTimeout(r, 400));

  return {
    role: "assistant",
    content: `Mock-Antwort! \n\nDu hast geschrieben:\n"${lastUser}"\n\n(Später wird das durch echtes LLM ersetzt.)`,
  };
}
