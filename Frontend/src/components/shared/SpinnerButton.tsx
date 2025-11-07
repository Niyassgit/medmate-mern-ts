import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface SpinnerButtonProps {
  compact?: boolean
  label?: string
  size?: "sm" | "lg" | "default"
}

export function SpinnerButton({
  compact = false,
  label = "Loading...",
  size = "default",
}: SpinnerButtonProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-center p-2">
        <Spinner className="h-5 w-5 animate-spin text-blue-500" />
        {label && <span className="ml-2 text-sm text-gray-600">{label}</span>}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Button disabled size={size} className="flex items-center gap-2">
        <Spinner className="h-5 w-5 animate-spin" />
        {label}
      </Button>
    </div>
  )
}
