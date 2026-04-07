interface ChatEmptyStateProps {
  name: string;
}

export default function ChatEmptyState({ name }: ChatEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight text-[#111111]">
          Hi, {name}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-[#6b7280]">
          What would you like to research today?
        </p>
      </div>
    </div>
  );
}
