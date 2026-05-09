import { cn } from "@/lib/cn";

interface TagListProps {
  tags: string[];
  className?: string;
  itemClassName?: string;
}

export function TagList({ tags, className, itemClassName }: TagListProps) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <li
          key={tag}
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.18em] border border-[var(--line)] rounded-full px-2 py-0.5",
            itemClassName,
          )}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
