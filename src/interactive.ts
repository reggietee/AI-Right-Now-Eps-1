// The two interactive moments (Checkpoint 7). Wired after the scenes mount.

/** S16 pricing: a slider for monthly token volume updates all three tier costs
 *  live. Cost assumes an even input/output split:
 *    monthly $ = volumeMillions * (inRate + outRate) / 2 */
export function hydratePricing(): void {
  document.querySelectorAll<HTMLInputElement>('.pslider__input').forEach((slider) => {
    const scope = slider.closest('.scene__content')!;
    const vol = scope.querySelector<HTMLElement>('.pvol')!;
    const costs = Array.from(scope.querySelectorAll<HTMLElement>('.tier__cost[data-in]'));
    const update = () => {
      const v = Number(slider.value);
      vol.textContent = String(v);
      for (const c of costs) {
        const rate = (Number(c.dataset.in) + Number(c.dataset.out)) / 2;
        c.textContent = `$${Math.round(v * rate).toLocaleString()}`;
      }
    };
    slider.addEventListener('input', update);
    update();
  });
}

/** S25 MCP hub: hovering a connector node highlights its ray to the center and
 *  dims everything else. */
export function hydrateHub(): void {
  document.querySelectorAll<SVGElement>('.hub').forEach((hub) => {
    const rays = Array.from(hub.querySelectorAll<SVGElement>('.hub-ray'));
    const clear = () => {
      hub.classList.remove('hovering');
      hub.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));
    };
    hub.querySelectorAll<SVGElement>('.hub-node').forEach((node) => {
      const focus = () => {
        clear();
        hub.classList.add('hovering');
        node.classList.add('active');
        rays[Number(node.dataset.i)]?.classList.add('active');
      };
      node.addEventListener('mouseenter', focus);
      node.addEventListener('mouseleave', clear);
    });
  });
}
