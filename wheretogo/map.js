export const render = (container) => {
  if (typeof container === "string")
    container = document.querySelector(container)

  const url = "world.svg"

  return fetch(url)
    .then(r => r.text())
    .then(text => new DOMParser().parseFromString(text, "text/html"))
    .then(dom => dom.querySelector("body > *"))
    .then(svg => container.appendChild(svg))
    .then(svg => {
      const box = svg.viewBox.baseVal
      let px, py, scale = 1
      let handle = false

      document.addEventListener("mousedown", (ev) => {
        handle = true
        px = ev.offsetX
        py = ev.offsetY
      })
      document.addEventListener("mousemove", (ev) => {
        if (!handle) return

        let dx = px - ev.offsetX
        let dy = py - ev.offsetY
        px = ev.offsetX
        py = ev.offsetY

        dx *= scale
        dy *= scale

        box.x += dx
        box.y += dy
      })
      document.addEventListener("mouseup", (ev) => {
        handle = false
      })
      document.addEventListener("wheel", (ev) => {
        let dt = 1.03
        if (ev.deltaY < 0) dt = 1 / dt

        scale *= dt

        const cx = ev.clientX / document.body.clientWidth
        const cy = ev.clientY / document.body.clientHeight
        const dx = ((box.width * dt) - box.width) * cx
        const dy = ((box.height * dt) - box.height) * cy

        box.x -= dx
        box.y -= dy
        box.width *= dt
        box.height *= dt

        svg.style.setProperty("--strokeWidth", scale)
      })
      return svg
    })
    .then(svg => svg.appendChild(document.createElement("style")))
    .then(style => style.textContent = `
      path {
        stroke-width: var(--strokeWidth, 1);
      }
      path:hover,
      g:hover > path {
        stroke-width: calc(2 * var(--strokeWidth, 1));
        filter: contrast(200%) drop-shadow(0 0 2px grey);
      }
    `)
    .then(_ => container)
}