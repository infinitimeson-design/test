import { loadRoles, loadScenarios } from './modules/data-loader.js';
import { initMotionSystem } from './modules/motion-system.js';
import { initNav } from './modules/nav.js';
import { initCarousel } from './modules/carousel.js';
import { initScenarioFlow } from './modules/scenario-flow.js';
import { initRoleSheet } from './modules/role-sheet.js';
import { initFingerprint } from './modules/fingerprint.js';

async function main() {
  initMotionSystem();
  initNav();
  initRoleSheet();
  initFingerprint();

  const [roles, scenarios] = await Promise.all([loadRoles(), loadScenarios()]);
  const flow = initScenarioFlow(scenarios, roles);
  initCarousel(scenarios, { onEnterScenario: (id) => flow.toggleScenario(id) });
}

main().catch((err) => {
  // fail loud in the console during development; the static markup already
  // on the page (hero, nav, fingerprint, about, contact, footer) still
  // works even if the data fetch fails, so the page never goes fully blank
  console.error('Night War: failed to initialize', err);
});
