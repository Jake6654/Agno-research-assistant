interface ChatHeaderProps {
  title: string;
}

export default function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="flex h-[72px] items-center justify-between border-b border-black/8 px-6">
      <div className="min-w-0">
        <h1 className="truncate text-[15px] font-medium text-[#111111]">
          {title}
        </h1>
      </div>

      <button className="rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-medium text-[#111111] transition hover:bg-black/[0.03]">
        Refresh
      </button>
    </div>
  );
}
