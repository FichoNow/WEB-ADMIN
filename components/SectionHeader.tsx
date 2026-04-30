interface Props {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: Props) {
  return (
    <div className="flex flex-col gap-1 mt-2">
      <h2 className="text-lg font-medium text-text-primary">{title}</h2>
      {description && (
        <p className="text-sm text-text-hint">{description}</p>
      )}
    </div>
  )
}
