const regions = [
  { title: 'Sub Bass', from: 16, to: 60, bg: '#F4CCCC' },
  { title: 'Bass', from: 60, to: 250, bg: '#FFF2CC' },
  { title: 'Low Mids', from: 250, to: 600, bg: '#D9EAD3' },
  { title: 'Midrange', from: 600, to: 2000, bg: '#CFE2F3' },
  { title: 'High Mids', from: 2000, to: 6000, bg: '#D9D2E9' },
  { title: 'High Frequencies', from: 6000, to: 20000, bg: '#EAD1DC' }
]

const types = [
  { title: 'Boomy', from: 16, to: 250 },
  { title: 'Boxy', from: 250, to: 600 },
  { title: 'Nasal', from: 600, to: 2000 },
  { title: 'Harsh / Shrill', from: 2000, to: 6000 },
  { title: 'Piercing', from: 6000, to: 20000 }
]

const tags = [
  { title: 'Sheen', from: 15000, to: 20000, line: 0, fontSize: 17, angle: -60 },
  { title: 'Air', from: 10000, to: 20000, line: 1 },
  { title: 'Definition', from: 6000, to: 10000, line: 1, fontSize: 17, angle: -60 },
  { title: 'Presence', from: 4000, to: 6000, line: 1, fontSize: 17, angle: -60 },
  { title: 'Crunch', from: 2000, to: 4000, line: 1 },
  { title: 'Tinny', from: 1000, to: 2000, line: 1 },
  { title: 'Honk', from: 450, to: 1000, line: 1 },
  { title: 'Mud', from: 250, to: 450, line: 1 },
  { title: 'Warmth', from: 100, to: 250, line: 1 },
  { title: 'Bottom', from: 60, to: 100, line: 1 },
  { title: 'Rumble', from: 16, to: 60, line: 1 }
]

const marks = Object.values([...regions, ...tags].reduce((acc, { from, to, line }) => {
  acc[from] = acc[from] || { value: from, line }
  acc[to] = acc[to] || { value: to, line }

  return acc
}, {}))

const getFreqFromNote = (base, note) => base * Math.pow(2, note / 12)

const C0 = -56
const C10 = C0 + 10 * 12

const values = []
const octaves = []

for (let i = C0; i <= C10; i++) {
  const id = i - C0
  const note = id % 12
  const octave = (id - note) / 12
  const freq = getFreqFromNote(440, i)
  values.push({ freq, id, note, octave })

  if (!note && (i !== C10)) {
    octaves.push({ octave, from: freq, to: getFreqFromNote(440, i + 12) })
  }
}

export { types, regions, tags, marks, values, octaves }
