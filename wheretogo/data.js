export const get = () => {
  const url = new URL("https://en.wikipedia.org/w/api.php")
  const params = url.searchParams

  params.set("origin", "*")
  params.set("action", "parse")
  params.set("format", "json")
  params.set("prop", "text")
  params.set("page", "Visa_requirements_for_Belarusian_citizens")

  return fetch(url)
    .then(r => r.json())
    .then(j => j.parse.text["*"])
    .then(html => new DOMParser().parseFromString(html, "text/html"))
    .then(dom => dom.querySelector("#Visa_requirements"))
    .then(section => section.parentElement.nextElementSibling)
    .then(table => {
      const [, ...trs] = table.querySelector("tbody").querySelectorAll("tr")
      const info = {}

      for (const tr of trs) {
        const [country, requirement, stay, notes] = [...tr.children]
          .map(el => el.textContent)
          .map(text => text.trim().replace(/\[\d+\]/g, ""))
          .map(country => {

            return country
          })

        info[country] = {
          requirement,
          stay,
          notes,
        }
      }

      return info
    })
}