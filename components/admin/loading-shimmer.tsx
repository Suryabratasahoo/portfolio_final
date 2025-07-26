interface LoadingShimmerProps {
  className?: string
}

export default function LoadingShimmer({ className = "h-4 w-full" }: LoadingShimmerProps) {
  return (
    <div className={`${className} bg-muted rounded overflow-hidden relative`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
    </div>
  )
}
