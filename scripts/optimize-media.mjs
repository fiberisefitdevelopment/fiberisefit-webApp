/**
 * Generates optimized hero WebP banners and reel poster images.
 * Playback uses original /public/reels/reel*.webm (with audio).
 * Run: npm run optimize:media
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import ffmpeg from 'ffmpeg-static'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BANNERS_DIR = path.join(ROOT, 'public/banners')
const BANNERS_OUT = path.join(BANNERS_DIR, 'optimized')
const REELS_DIR = path.join(ROOT, 'public/reels')
const POSTERS_DIR = path.join(REELS_DIR, 'posters')

const HERO_BANNERS = [
  {
    input: 'Transformation Pack_Mobile Banner.jpg',
    output: 'transformation-pack-mobile.webp',
    width: 1200,
  },
  {
    input: 'Transformation Pack_Desktop Banner.jpg',
    output: 'transformation-pack-desktop.webp',
    width: 1920,
  },
  {
    input: 'Ultimate Pack_Mobile Banner.jpg',
    output: 'ultimate-pack-mobile.webp',
    width: 1200,
  },
  {
    input: 'Ultimate Desktop Banner.jpg',
    output: 'ultimate-pack-desktop.webp',
    width: 1920,
  },
]

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function optimizeBanners() {
  await ensureDir(BANNERS_OUT)
  for (const banner of HERO_BANNERS) {
    const inputPath = path.join(BANNERS_DIR, banner.input)
    const outputPath = path.join(BANNERS_OUT, banner.output)
    await sharp(inputPath)
      .rotate()
      .resize({ width: banner.width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(outputPath)
    const { size } = await fs.stat(outputPath)
    console.log(`banner ${banner.output}: ${(size / 1024).toFixed(1)} KB`)
  }
}

async function runFfmpeg(args) {
  const { spawn } = await import('child_process')
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code}`))
    })
  })
}

async function optimizeReels() {
  if (!ffmpeg) {
    console.warn('ffmpeg-static binary missing; skipping reel optimization')
    return
  }

  await ensureDir(POSTERS_DIR)

  const files = (await fs.readdir(REELS_DIR)).filter(
    (f) => f.endsWith('.webm') && !f.includes('optimized')
  )
  for (const file of files.sort()) {
    const base = file.replace(/\.webm$/i, '')
    const inputPath = path.join(REELS_DIR, file)
    const posterPath = path.join(POSTERS_DIR, `${base}.webp`)
    const posterFrame = path.join(POSTERS_DIR, `${base}.frame.jpg`)
    const posterExists = await fs.stat(posterPath).then(() => true).catch(() => false)
    if (posterExists) {
      console.log(`${file}: poster skipped (exists)`)
      continue
    }

    await runFfmpeg([
      '-y',
      '-ss',
      '00:00:00.5',
      '-i',
      inputPath,
      '-frames:v',
      '1',
      '-vf',
      'scale=560:-2',
      posterFrame,
    ])

    await sharp(posterFrame).webp({ quality: 72, effort: 4 }).toFile(posterPath)
    await fs.unlink(posterFrame).catch(() => {})

    const posterStat = await fs.stat(posterPath)
    console.log(`${file}: poster ${(posterStat.size / 1024).toFixed(0)}KB`)
  }
}

async function main() {
  console.log('Optimizing hero banners...')
  await optimizeBanners()
  console.log('Generating reel posters...')
  await optimizeReels()
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
