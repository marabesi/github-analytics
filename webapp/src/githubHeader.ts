import _ from 'lodash'
export function parseLinkHeader (header: string) {
  if (header.length === 0) {
    throw new Error('input must not be of zero length')
  }
  const parts = header.split(',')
  const links: { [key : string ]: string } = {}

  _.each(parts, function (p: string) {
    const section = p.split(';')
    if (section.length !== 2) {
      throw new Error("section could not be split on ';'")
    }
    const url = section[0].replace(/<(.*)>/, '$1').trim()
    const name = section[1].replace(/rel="(.*)"/, '$1').trim()
    links[name] = url
  })

  return links
}
