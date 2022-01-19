export interface PaginationCriteria {
    offset: number
    limit: number
}

export const Schema = {
    $id: "pagination",
    type: "object",
    required: ["offset", "limit"],
    properties: {
        offset: { type: 'number' },
        limit: { type: 'number' },
    }
}

/**
 * Higher order function which construct a pagination logic on top of a collection.
 * I.e, partially apply by fixing a collection.
 */
export const paginator = <T>(collection: T[], compare: (a: T, b: T) => number) => (offset: number, limit: number) => collection
    .sort(compare)
    .filter((_, index) => index >= offset && index < offset + limit);