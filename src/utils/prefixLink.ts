export default function prefixLink(link) {
  link = `/blog${link}`;
  if (link.endsWith('/'))
    return link;
  return `${link}/`;
}
