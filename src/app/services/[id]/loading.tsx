import { Loader2 } from "lucide-react";

export default function ServiceDetailLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-32">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}