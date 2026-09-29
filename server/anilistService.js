const ANILIST_URL = 'https://graphql.anilist.co'

const mediaFields = `
  id
  title { romaji english native }
  coverImage { large extraLarge }
  description(asHtml: false)
  genres
  status
  format
  chapters
  volumes
  averageScore
  countryOfOrigin
  isLicensed
  startDate { year month day }
  endDate { year month day }
  siteUrl
  updatedAt
`

function formatDate(date) {
  if (!date?.year) return ''
  return [date.year, date.month, date.day].filter(Boolean).join('-')
}

function publicationStatus(status) {
  const statuses = {
    NOT_YET_RELEASED: 'Coming Soon',
    RELEASING: 'Releasing',
    FINISHED: 'Finished',
    HIATUS: 'On Hiatus',
    CANCELLED: 'Cancelled',
  }
  return statuses[status] || 'Unknown'
}

function plainDescription(description) {
  return (description || 'No synopsis available.')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p\s*>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
}

export function normalizeAniListManga(media) {
  if (!media) return null
  const titles = [media.title?.english, media.title?.romaji, media.title?.native].filter(Boolean)
  return {
    anilistId: media.id,
    title: titles[0] || 'Untitled manga',
    alternativeTitles: [...new Set(titles.slice(1))],
    coverUrl: media.coverImage?.extraLarge || media.coverImage?.large || '',
    synopsis: plainDescription(media.description),
    genres: media.genres || [],
    authors: (media.staff?.edges || []).map((edge) => edge.node?.name?.full).filter(Boolean),
    staff: (media.staff?.edges || []).map((edge) => ({
      id: edge.node?.id,
      name: edge.node?.name?.full || 'Unknown staff member',
      role: edge.role || 'Staff',
      imageUrl: edge.node?.image?.large || '',
    })),
    characters: (media.characters?.edges || []).map((edge) => ({
      id: edge.node?.id,
      name: edge.node?.name?.full || 'Unknown character',
      role: edge.role || '',
      imageUrl: edge.node?.image?.large || '',
    })),
    recommendations: (media.recommendations?.nodes || []).map((node) => node.mediaRecommendation).filter((recommendation) => recommendation?.type === 'MANGA').map((recommendation) => ({
      anilistId: recommendation.id,
      title: [recommendation.title?.english, recommendation.title?.romaji, recommendation.title?.native].find(Boolean) || 'Untitled manga',
      coverUrl: recommendation.coverImage?.extraLarge || recommendation.coverImage?.large || '',
      status: publicationStatus(recommendation.status),
    })),
    type: media.format || 'Manga',
    chapters: media.chapters ?? null,
    volumes: media.volumes ?? null,
    status: publicationStatus(media.status),
    score: media.averageScore ? media.averageScore / 10 : null,
    startDate: formatDate(media.startDate),
    endDate: formatDate(media.endDate),
    published: formatDate(media.startDate),
    serializations: [],
    demographics: [],
    countryOfOrigin: media.countryOfOrigin || '',
    isLicensed: media.isLicensed ?? false,
    siteUrl: media.siteUrl || '',
    updatedAt: media.updatedAt || null,
  }
}

async function anilistRequest(query, variables = {}) {
  let response
  try {
    response = await fetch(ANILIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new Error('AniList is unavailable right now.')
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.errors?.length) {
    throw new Error(result.errors?.[0]?.message || 'AniList request failed.')
  }
  return result.data
}

export async function searchManga(search, page = 1, perPage = 12) {
  const data = await anilistRequest(`
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { currentPage hasNextPage perPage }
        media(search: $search, type: MANGA) {
          ${mediaFields}
          staff(perPage: 3) { edges { role node { id name { full } image { large } } } }
        }
      }
    }
  `, { search, page, perPage: Math.min(perPage, 50) })
  return {
    items: (data.Page?.media || []).map(normalizeAniListManga),
    pageInfo: data.Page?.pageInfo || { currentPage: page, hasNextPage: false, perPage },
  }
}

export async function getManga(anilistId) {
  const data = await anilistRequest(`
    query ($id: Int!) {
      Media(id: $id, type: MANGA) {
        ${mediaFields}
        characters(page: 1, perPage: 12, sort: [ROLE, RELEVANCE]) {
          edges { role node { id name { full } image { large } } }
        }
        staff(page: 1, perPage: 12, sort: [RELEVANCE]) {
          edges { role node { id name { full } image { large } } }
        }
        recommendations(page: 1, perPage: 8, sort: RATING_DESC) {
          nodes { mediaRecommendation { id type title { romaji english native } coverImage { large extraLarge } status } }
        }
      }
    }
  `, { id: Number(anilistId) })
  return normalizeAniListManga(data.Media)
}

export async function getRecommendations() {
  const data = await anilistRequest(`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { currentPage hasNextPage perPage }
        media(type: MANGA, sort: POPULARITY_DESC) { ${mediaFields} }
      }
    }
  `, { page: 1, perPage: 6 })
  return (data.Page?.media || []).map(normalizeAniListManga)
}
