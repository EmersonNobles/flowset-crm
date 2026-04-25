import { Check } from "lucide-react"

const steps = [
  { label: "Workspace" },
  { label: "Time" },
  { label: "Primeiro lead" },
  { label: "Pipeline" },
]

export function Stepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex items-center gap-0 mb-8 w-full">
      {steps.map((step, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-primary/20 border-2 border-primary text-primary"
                    : "bg-white/5 border border-white/10 text-muted-foreground"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : num}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 mb-4 transition-colors ${
                  done ? "bg-primary/40" : "bg-white/10"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
