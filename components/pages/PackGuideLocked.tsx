export default function PackGuideLocked() {
  return (
    <div className="min-h-[70vh] bg-[#faf8f3] flex items-center justify-center px-6 py-28">
      <div className="max-w-md text-center space-y-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[#868B7A]">FYBER pack guide</p>
        <h1
          className="text-3xl md:text-4xl font-medium text-[#1a1a1a] leading-tight"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          This page opens from your pack
        </h1>
        <p className="text-sm md:text-base text-[#5c5c5c] leading-relaxed">
          Scan the QR code printed with your FYBER sachets to read how to use it, what to expect,
          and which pack to continue with.
        </p>
      </div>
    </div>
  )
}
