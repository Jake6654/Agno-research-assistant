export default function ChatMessageList() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8">
      <div className="ml-auto max-w-[80%] rounded-2xl bg-[#111111] px-4 py-3 text-sm text-white">
        Help me compare serverless GPU options for LLM inference.
      </div>

      <div className="max-w-[85%] rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm leading-7 text-[#111111]">
        I can help with that. I would compare cold start latency, cost per
        request, concurrency limits, GPU availability, and deployment complexity
        across providers.
      </div>
    </div>
  );
}
