import { Bold, Italic, Heading, List, ListOrdered, Link, Code } from "lucide-react";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownToolbar({ textareaRef, value, onChange }: MarkdownToolbarProps) {
  const insertText = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    let newText = "";
    let newCursorPos = 0;

    if (start === end) {
      newText = beforeText + prefix + suffix + afterText;
      newCursorPos = start + prefix.length;
    } else {
      newText = beforeText + prefix + selectedText + suffix + afterText;
      newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    }

    onChange(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mb-2 border border-border p-1 rounded-md bg-muted/30">
      <button
        type="button"
        onClick={() => insertText("**", "**")}
        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => insertText("*", "*")}
        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => insertText("### ")}
        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Heading 3"
      >
        <Heading size={16} />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => insertText("- ")}
        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Bulleted List"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => insertText("1. ")}
        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => insertText("[", "](url)")}
        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Link"
      >
        <Link size={16} />
      </button>
      <button
        type="button"
        onClick={() => insertText("```\n", "\n```")}
        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Code Block"
      >
        <Code size={16} />
      </button>
    </div>
  );
}
