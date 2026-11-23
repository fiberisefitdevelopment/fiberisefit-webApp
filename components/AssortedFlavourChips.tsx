const FLAVOURS = [
  { name: 'Watermelon', className: 'border-[#e8a0b8] bg-[#f8d4e0] text-[#9f1239]' },
  { name: 'Lime n Lemon', className: 'border-[#c5d86a] bg-[#eaf4b8] text-[#3f6212]' },
  { name: 'Unflavoured', className: 'border-[#d6d0c4] bg-[#f4f0e6] text-[#44403c]' },
] as const

export default function AssortedFlavourChips() {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
        Assorted flavours in every pack
      </p>
      <ul className="flex flex-wrap gap-2" aria-label="Available flavours">
        {FLAVOURS.map((flavour) => (
          <li
            key={flavour.name}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${flavour.className}`}
          >
            {flavour.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
