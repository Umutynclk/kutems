const { calculate } = require('../../src/lib/springEngine');

console.log('=== SPRING CALCULATOR REGRESSION TEST ===');

const systems = [
  { sys: 'Normal Lift', w: 4000, h: 3000, hl: 0, kgm2: 12, qty: 2, drum: 'KUTNL18' },
  { sys: 'Low Headroom', w: 3500, h: 2500, hl: 0, kgm2: 10, qty: 2, drum: 'KUTLH120' },
  { sys: 'High Lift', w: 4500, h: 4000, hl: 1500, kgm2: 11, qty: 2, drum: 'KUTHL120' },
  { sys: 'Vertical Lift', w: 5000, h: 5000, hl: 0, kgm2: 14, qty: 4, drum: 'KUTVL18' }
];

let allPassed = true;

for (const input of systems) {
  try {
    const res = calculate(input);
    const valid = res.weight > 0 && res.turns > 0 && Array.isArray(res.springs);
    console.log(`[${input.sys}] Weight: ${res.weight} kg, Turns: ${res.turns.toFixed(2)}, Springs found: ${res.springs.length} -> ${valid ? 'PASSED' : 'FAILED'}`);
    if (!valid) allPassed = false;
  } catch(e) {
    console.error(`[${input.sys}] FAILED with error:`, e.message);
    allPassed = false;
  }
}

console.log(`Overall Spring Calculator Test: ${allPassed ? 'ALL SYSTEMS PASSED' : 'FAILED'}`);
