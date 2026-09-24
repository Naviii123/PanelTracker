export function chapterLimit(item) {
  const total = Number(item?.chapters ?? item?.totalChapters)
  return Number.isFinite(total) && total >= 0 ? total : null
}

export function chapterError(item, value) {
  const chapter = Number(value)
  if (!Number.isFinite(chapter) || chapter < 0) return 'Chapter must be a non-negative number.'

  const total = chapterLimit(item)
  if (total !== null && chapter > total) return `Chapter cannot exceed the known total of ${total}.`

  return ''
}
