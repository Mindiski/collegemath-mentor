import { Brain } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Chargement..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-primary rounded-full animate-pulse"></div>
        <Brain className="absolute inset-0 m-auto h-6 w-6 text-white animate-bounce" />
      </div>
      <p className="mt-4 text-muted-foreground font-medium">{message}</p>
    </div>
  );
}