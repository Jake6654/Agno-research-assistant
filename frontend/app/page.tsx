"use client";

import { FormEvent, useState } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

type ResearchResponse = {
  response: string;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch(`${apiBaseUrl}/research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = (await res.json()) as ResearchResponse;
      setAnswer(data.response);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unknown error occurred while requesting research.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="hero-kicker">Next.js Frontend</p>
        <h1>Agno Research Assistant</h1>
        <p className="hero-copy">
          질문을 입력하면 FastAPI의 <code>/research</code> 엔드포인트를 호출해
          리서치 응답을 보여줍니다.
        </p>

        <form onSubmit={onSubmit} className="research-form">
          <label htmlFor="question">질문</label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="예: RAG의 최신 트렌드와 실무 도입 체크리스트를 정리해줘"
            rows={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "분석 중..." : "리서치 요청"}
          </button>
        </form>

        {error && <p className="error-box">{error}</p>}

        {answer && (
          <article className="answer-box">
            <h2>응답</h2>
            <pre>{answer}</pre>
          </article>
        )}
      </section>
    </main>
  );
}
