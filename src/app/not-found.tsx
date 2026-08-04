import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-brand">404</h1>
        <p className="mt-2 text-lg font-medium">Page Not Found</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Link>
        </Button>
        <Button asChild className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
