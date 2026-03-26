/**
 * Gera os icones PNG do PWA a partir do SVG fonte.
 * Execute com: node scripts/generate-icons.mjs
 */

import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const INPUT_SVG = join(ROOT, 'public', 'icons', 'icon.svg')
const OUTPUT_DIR = join(ROOT, 'public', 'icons')

// Garante que a pasta existe
mkdirSync(OUTPUT_DIR, { recursive: true })

const svgBuffer = readFileSync(INPUT_SVG)

const icons = [
  // Icones "any" — sem padding extra, usa a forma do SVG
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },

  // Icones "maskable" — com safe zone de 10% em cada lado.
  // No safe zone, o icone deve caber dentro de um circulo de 80% do tamanho total.
  // Aqui colocamos o SVG em 80% do canvas com fundo roxo.
  { file: 'icon-192-maskable.png', size: 192, maskable: true },
  { file: 'icon-512-maskable.png', size: 512, maskable: true },
]

for (const icon of icons) {
  const outputPath = join(OUTPUT_DIR, icon.file)

  if (icon.maskable) {
    // Renderiza o SVG em 80% do tamanho para garantir safe zone
    const innerSize = Math.round(icon.size * 0.8)

    const resizedSvg = await sharp(svgBuffer)
      .resize(innerSize, innerSize)
      .toBuffer()

    // Cria fundo roxo e sobrepoem o icone centralizado
    await sharp({
      create: {
        width: icon.size,
        height: icon.size,
        channels: 4,
        background: { r: 155, g: 93, b: 229, alpha: 1 }, // #9b5de5
      },
    })
      .composite([
        {
          input: resizedSvg,
          gravity: 'center',
        },
      ])
      .png()
      .toFile(outputPath)
  } else {
    await sharp(svgBuffer)
      .resize(icon.size, icon.size)
      .png()
      .toFile(outputPath)
  }

  console.log(`Gerado: ${icon.file} (${icon.size}x${icon.size}${icon.maskable ? ' maskable' : ''})`)
}

console.log('\nTodos os icones foram gerados em public/icons/')
