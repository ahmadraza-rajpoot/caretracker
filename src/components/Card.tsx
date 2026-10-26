import { type LucideIcon } from "lucide-react";

type ItemType = {
  title: string;
  count: number;
  icon: LucideIcon;
};

const Card = ({ title, count, icon: Icon }: ItemType) => {
  return (
    <div className="w-full max-w-62.5 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {count}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default Card;