export type DiscogsSearchObject = {
    pagination: DiscogsPaginationObject,
    results: DiscogsSearchResult[]
}

export type DiscogsPaginationObject = {
    items: number,
    page: number,
    pages: number, 
    per_page: number
}

export type DiscogsUrlsObject = {
    last: string,
    next: string
}

export type DiscogsSearchResult = {
    
}

