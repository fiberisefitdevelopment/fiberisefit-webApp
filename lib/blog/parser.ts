import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'

// A simpler slugifier instead of importing a heavy one
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -

export interface TOCItem {
  id: string
  title: string
  level: number
  children?: TOCItem[]
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ParsedHtml {
  html: string
  toc: TOCItem[]
  faqs: FAQItem[]
}

/**
 * Parses Shopify CMS HTML, injects heading IDs, creates a TOC, and extracts KPIs and FAQs.
 */
export function parseBlogContent(rawHtml: string): ParsedHtml {
  if (!rawHtml) return { html: '', toc: [], faqs: [] }

  const $ = cheerio.load(rawHtml, null, false) // false = don't add html/head/body wrappers
  const toc: TOCItem[] = []
  const faqs: FAQItem[] = []

  // 1. Generate TOC & Inject IDs
  $('h2, h3').each((_, el) => {
    const headingText = $(el).text().trim()
    if (!headingText) return

    // Don't include "Frequently Asked Questions" in TOC if you don't want to
    // if (headingText.toLowerCase().includes('frequently asked')) return

    const slug = slugify(headingText) || uuidv4().slice(0, 8)
    
    // Inject id so anchor links work
    $(el).attr('id', slug)

    const level = (el as any).name === 'h2' ? 2 : 3
    toc.push({
      id: slug,
      title: headingText,
      level,
    })
  })

  // Normalize TOC into a tree structure
  const nestedToc: TOCItem[] = []
  let currentGroup: TOCItem | null = null

  toc.forEach((item) => {
    if (item.level === 2) {
      currentGroup = { ...item, children: [] }
      nestedToc.push(currentGroup)
    } else if (item.level === 3 && currentGroup && currentGroup.children) {
      currentGroup.children.push(item)
    }
  })

  // 2. Extract FAQs (Assuming a standard DL/DT/DD or H3+P structure under an FAQ H2)
  // Highly dependent on how the Shopify Admin users type FAQs. 
  // Common method: an H2 "Frequently Asked Questions", followed by H3 (question), P (answer)
  let capturingFaqs = false
  let currentQuestion = ''
  const nodesToRemove: any[] = []

  $('*').each((_, el) => {
    const node = $(el)
    const text = node.text().trim()

    if ((el as any).name === 'h2') {
      if (text.toLowerCase().includes('frequently asked question') || text.toLowerCase() === 'faqs') {
        capturingFaqs = true
        nodesToRemove.push(el)
      } else {
        capturingFaqs = false
      }
      return
    }

    if (capturingFaqs) {
      nodesToRemove.push(el)
      
      if (['h3', 'h4', 'strong'].includes((el as any).name)) {
        if (text.endsWith('?')) {
          currentQuestion = text
        }
      } else if ((el as any).name === 'p' && currentQuestion) {
        faqs.push({
          question: currentQuestion,
          answer: text,
        })
        currentQuestion = '' // reset
      }
    }
  })

  // Remove the static FAQ blocks so they aren't rendered twice
  $(nodesToRemove).remove()

  // Return the manipulated HTML
  return {
    html: $.html(),
    toc: nestedToc, // Return the nested structure
    faqs,
  }
}
