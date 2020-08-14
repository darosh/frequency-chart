<script>
import { scaleLinear, scaleLog } from 'd3-scale'
import { line, curveBasisOpen } from 'd3-shape'
import { path } from 'd3-path'
import { phons } from './phons'
import { marks, regions, types, tags, values, octaves } from './data'

const w = 1200
const h = 600
const fontSize = 20
const marginalFontSize = 16
const tagFontSize = 20
const octaveFontSize = 26
const octaveFromFontSize = 12
const fontBoxMargin = 12
const fontBoxDistance = (h - fontBoxMargin) / 7
const fontBox = fontBoxDistance - fontBoxMargin
const margin = fontBoxDistance / 2

let useLog = true
let scale
let loudnessLine

const domain = [16, 2e4]
const range = [margin, w - margin]

const loudness = [0, 20, 40, 60, 80, 100].map(p => phons(p))
const loudnessY = scaleLinear([-10, 130], [h - fontBoxDistance, fontBoxDistance])
loudnessLine = line().y(function (d) { return loudnessY(d.Lp) }).curve(curveBasisOpen)

switchScale()

function switchScale () {
  scale = useLog
    ? scaleLog(domain, range)
    : scaleLinear(domain, range)
  loudnessLine.x(function (d) { return scale(d.f) })
  loudnessLine = loudnessLine
  useLog = !useLog
}

function formatHz (v) {
  return v >= 1000 ? v / 1000 + 'k' : v
}

function roundHz (v) {
  return v.toFixed(2).replace(/0$/, '').replace(/0$/, '').replace(/\.$/, '')
}
</script>

<main>
  <svg width={w} height={h} on:click={switchScale} font-family="'Droid Sans', sans-serif" font-size="{fontSize}">
    {#each regions as region}
      <rect fill="{region.bg}"
            fill-opacity="0.5"
            style="transform: translate3d({ scale(region.from) }px, 0, 0) scaleX({ scale(region.to) - scale(region.from)});"
            x="0" y={fontBoxDistance * 1} width="1" height={h - fontBoxDistance * 2}/>
      <text style="transform: translate3d({ (scale(region.from) + scale(region.to)) / 2 }px, 0, 0)" x="0"
            y={h - fontBoxDistance * 1.5 - fontBoxMargin / 2}
            opacity={useLog ? (region.to >= 3000) ? 0.87 : 0 : 0.87}
            alignment-baseline="middle"
            font-weight="bold"
            text-anchor="middle" fill="#000">{region.title}</text>
    {/each}

    {#each marks as { value, line } }
      <text style="transform: translate3d({ scale(value) }px, 0, 0)" x="0" y={fontBoxDistance * .5 + fontBoxMargin / 2}
            alignment-baseline="middle"
            font-size={line >= 0 ? marginalFontSize : fontSize}
            fill-opacity={ line >= 0 ? 1 : 0.87 }
            font-weight={ line >= 0 ? 'normal' : 'bold'}
            opacity={useLog ? (value >= 1000 || value <= 16) ? 1 : 0 : 1}
            dy={line >= 0 ? (fontBoxDistance * 2) / 6 : 0}
            text-anchor="middle" fill="#000">{formatHz(value)}</text>
      {#if !(line >= 0)}
        <text style="transform: translate3d({ scale(value) }px, 0, 0)" x="0" y={h - fontBoxDistance * .5}
              alignment-baseline="middle"
              fill-opacity="0.87"
              font-weight={ line >= 0 ? 'normal' : 'bold'}
              font-size={line >= 0 ? marginalFontSize : fontSize}
              opacity={useLog ? (value >= 1000 || value <= 16) ? 1 : 0 : 1}
              text-anchor="middle" fill="#000">{formatHz(value)}</text>
      {/if}
      <line style="transform: translate3d({ scale(value) }px, 0, 0);"
            stroke-width="1"
            stroke="#000"
            stroke-opacity="0.66"
            x1="0" y1={fontBoxDistance + (line >= 0 ? 0 : (-fontBoxDistance * 0.5 + fontBoxMargin * 1.5))} x2="0"
            y2={(line >= 0 ? (line + 2) * fontBoxDistance: h - fontBoxDistance) - (line >= 0 ? 0 : (-fontBoxDistance * 0.5 + fontBoxMargin * 1.5)) }/>
    {/each}

    {#each types as type}
      <rect fill="#fff"
            fill-opacity="0.87"
            style="transform: translate3d({ scale(type.from) + 4 }px, 0, 0) scaleX({ scale(type.to) - scale(type.from) - 8});"
            x="0" y={h - fontBoxDistance * 3} width="1" height={fontBox}/>
      <text style="transform: translate3d({ (scale(type.from) + scale(type.to)) / 2 }px, 0, 0)" x="0"
            y={h - fontBoxDistance * 2.5 - fontBoxMargin / 2}
            alignment-baseline="middle"
            opacity={useLog ? (type.to >= 1000) ? 1 : 0 : 1}
            text-anchor="middle" fill="#000">{type.title}</text>
    {/each}

    {#each values as value}
      <line style="transform: translate3d({ scale(value.freq) }px, 0, 0);"
            stroke="{!value.note ? 'rgba(64,64,64, 0.5)' : '#000'}"
            opacity={useLog && (value.freq) < 555 ? 0 : 1}
            x1="0"
            y1={h - 4 * fontBoxDistance + fontBoxMargin * 1.5}
            x2="0"
            y2={h - 3 * fontBoxDistance - fontBoxMargin * (value.note === 8 ? 1 : 2.5)}/>
    {/each}

    {#each tags as tag, i}
      <rect fill="#fff"
            fill-opacity="0.87"
            style="transform: translate3d({ scale(tag.from) + 4 }px, 0, 0) scaleX({ scale(tag.to) - scale(tag.from) - 8});"
            x="0" y={fontBoxDistance * 1 + fontBoxDistance * tag.line + fontBoxMargin} width="1" height={fontBox}/>
      <g style="transform: translate3d({ (scale(tag.from) + scale(tag.to)) / 2 }px, 0, 0)">
        <text
          x="0"
          y={fontBoxDistance * 1.5 + fontBoxDistance * tag.line + fontBoxMargin / 2}
          alignment-baseline="middle"
          transform="rotate({tag.angle || 0} 0,{fontBoxDistance * 1.5 + fontBoxDistance * tag.line + fontBoxMargin / 2})"
          opacity={useLog ? (tag.to > 1000) ? 1 : 0 : 1}
          font-size={tag.fontSize || tagFontSize}
          text-anchor="middle" fill="#000">{tag.title}</text>
      </g>
    {/each}

    {#each octaves as octave}
      <rect fill="#fff"
            fill-opacity="0.87"
            style="transform: translate3d({ scale(octave.from) + 2 }px, 0, 0) scaleX({ scale(octave.to) - scale(octave.from) - 4});"
            x="0" y={h - fontBoxDistance * 4} width="1" height={fontBox}/>
      <text style="transform: translate3d({ (scale(octave.from) + scale(octave.to)) / 2 }px, 0, 0)" x="0"
            y={h - fontBoxDistance * 3.5 - fontBoxMargin / 2}
            opacity={useLog ? (octave.to >= 1000) ? 1 : 0 : 1}
            font-size={octaveFontSize}
            alignment-baseline="middle"
            text-anchor="middle" fill="#000">{octave.octave}</text>
      <text style="transform: translate3d({ scale(octave.from) }px, 0, 0)" x="4"
            y={h - fontBoxDistance * 4 + fontBoxMargin / 2 + 4}
            opacity={useLog ? (octave.to >= 1200) ? 1 : 0 : 1}
            font-size={octaveFromFontSize}
            alignment-baseline="middle"
            text-anchor="start" fill="#000">{roundHz(octave.from)}</text>
    {/each}

    {#each values as value}
      {#if value.note === 8}
        <text style="transform: translate3d({ scale(value.freq) }px, 0, 0)" x="1"
              y={h - fontBoxDistance * 3 - fontBoxMargin * 1.5 - 2}
              opacity={useLog ? (value.freq >= 3000) ? 1 : 0 : 1}
              font-size={octaveFromFontSize}
              alignment-baseline="middle"
              text-anchor="start" fill="#000">{roundHz(value.freq)}</text>
      {/if}
    {/each}

    {#each loudness as l}
      <path d={loudnessLine(l)} fill="none" stroke-width="5" stroke="#000" stroke-opacity="0.12" stroke-dasharray="1 9"
            stroke-linecap="round" stroke-linejoin="round"/>
    {/each}

    {#each [0, 20, 40, 60, 80, 100, 120] as tick}
      <line x1={scale(2e4)} y1={loudnessY(tick)} x2={scale(2e4) - 5} y2={loudnessY(tick)} stroke="#000"
            stroke-width="1"/>
      <text x={scale(2e4) + 4} y={loudnessY(tick)} alignment-baseline="central"
            font-size={marginalFontSize}>{tick}</text>
    {/each}

    {#each [20, 30, 40, 50, 70, 80, 90, 200, 300, 400, 500, 700, 800, 900, 3000, 5000, 7000, 8000, 9000] as tick}
      <line x1="0" y1={fontBoxDistance} x2="0" y2={fontBoxDistance + 5}
            style="transform: translate3d({scale(tick)}px, 0, 0)"
            opacity={useLog ? (tick >= 100) ? 0.87 : 0 : 0.87}
            stroke="#000"
            stroke-width="1"/>
    {/each}

    <text x={scale(16) - fontBoxMargin * 2} y={h-fontBoxDistance * 3.5 - fontBoxMargin / 2}
          text-anchor="middle"
          dy="8"
          transform="rotate(-90 {scale(16) - fontBoxMargin * 2},{h-fontBoxDistance * 3.5- fontBoxMargin / 2})"
          font-size={marginalFontSize}>octave
    </text>

    <text x={scale(16) - fontBoxMargin} y={h-fontBoxDistance * 4 - fontBoxMargin}
          text-anchor="middle"
          alignment-baseline="before-edge"
          font-size={marginalFontSize - 2}>C
    </text>

    <text x={scale(16) - fontBoxMargin} y={h-fontBoxDistance * 3}
          text-anchor="middle"
          alignment-baseline="after-edge"
          font-size={marginalFontSize - 2}>A
    </text>
  </svg>

  <div style="text-align: end; width: {w}px; display: inline-block;">
    Made in Brno 2020, <a href="https://github.com/darosh/frequency-chart">Github</a>
  </div>
</main>

<style>
line, rect, text, g {
  transition: all 0.8s ease-out;
}

main {
  text-align: center;
  padding: 1em;
  max-width: 240px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}
</style>
