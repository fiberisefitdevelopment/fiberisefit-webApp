import { cn } from '@/lib/utils'

export default function RichText({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn(
        // Core typography plugin setup
        'prose prose-lg max-w-none w-full prose-stone break-words',
        '[&>*]:max-w-full [&>table]:overflow-x-auto',

        // Typography custom overrides for Fiberise
        'prose-headings:font-sans prose-headings:text-gray-900',
        'prose-h2:font-bold prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-8 prose-h2:mb-5 prose-h2:scroll-m-24', 
        'prose-h3:font-medium prose-h3:text-2xl md:prose-h3:text-[22px] prose-h3:mt-6 prose-h3:mb-4 prose-h3:scroll-m-24',

        // Links
        'prose-a:text-fyber-emerald-forest prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-2 hover:prose-a:underline-offset-4 prose-a:transition-all prose-a:duration-200',

        // Lists
        'prose-li:text-gray-700 prose-ul:list-disc prose-ol:list-decimal',

        // Paragraphs
        'prose-p:text-[#333333] prose-p:leading-[1.8] prose-p:mb-5 md:text-[17px]',

        // Images (if inserted inside the content)
        'prose-img:rounded-2xl prose-img:shadow-sm prose-img:mx-auto',

        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-fyber-emerald-forest prose-blockquote:bg-fyber-ivory-dream prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:text-gray-800 prose-blockquote:font-medium prose-blockquote:not-italic',

        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
