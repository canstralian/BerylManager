interface ProgressBarProps {
  progress: number;
  variant?: "primary" | "success" | "warning" | "destructive";
  className?: string;
}

export default function ProgressBar({ progress, variant = "primary", className = "" }: ProgressBarProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "destructive":
        return "bg-destructive";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={`h-2 bg-muted rounded-full overflow-hidden ${className}`} data-testid="progress-bar">
      <div
        className={`h-full transition-all duration-300 ease-out ${getVariantClasses()}`}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        data-testid="progress-fill"
      />
    </div>
  );
}
