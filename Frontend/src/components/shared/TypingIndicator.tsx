
const TypingIndicator = ({ name }: { name?: string }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg w-fit">
      <span className="text-sm text-muted-foreground">
        {name || "Someone"} is typing
      </span>
      <div className="flex gap-1">
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
