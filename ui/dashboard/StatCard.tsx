
interface StatCardProps {
    title: string,
    value: string,
    description: string,
    icon: React.ReactNode
}

export default function StatCard({title, value, description, icon} : StatCardProps) {
  return (
    <div className="bg-card p-6 shadow-sm hover:shadow-md transition-shadow rounded-2xl border border-border">
        <div className="flex items-start gap-4 justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">{value}</h3>
                <p className="text-xs text-muted-foreground mt-2">{description}</p>
            </div>
            <div className="text-primary/30">
                {icon}
            </div>
        </div>
    </div>
  )
}
