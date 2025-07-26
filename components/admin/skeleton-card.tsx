import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface SkeletonCardProps {
  header?: boolean
  footer?: boolean
  rows?: number
}

export default function SkeletonCard({ header = true, footer = false, rows = 3 }: SkeletonCardProps) {
  return (
    <Card className="overflow-hidden">
      {header && (
        <CardHeader className="pb-2 space-y-2">
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </CardContent>
      {footer && (
        <CardFooter>
          <div className="h-9 w-full bg-muted rounded animate-pulse" />
        </CardFooter>
      )}
    </Card>
  )
}
