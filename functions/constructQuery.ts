
const filters_map: Record<string, string> = {
    "type": "type_line",
    "set": "set_code",
}

/**
 * filters that are allowed to be added to SQL query. May not be necessary since not using url parsing anymore.
 */
const allowed_filters = ["set", "type","lang", "oracle_id", "printed_name"]

export const used_card_cols = ['id','printed_name', 'lang', 'set_code', 'oracle_text', 'printed_text', 'image_uri', 'card_faces', 'oracle_id', 'type_line', 'treatment'] as const

export interface QueryResult {
    query: string
    params: Array<string | number>
}

export type Filters = Record<string, string[] | undefined>

const makePlaceholders = (length: number) => Array(length).fill('?').join(',')

const appendTypeFilter = (values: string[], params: Array<string | number>) => {
    const conditions = values.map(() => 'cards.type_line LIKE ? COLLATE NOCASE').join(' OR ')
    params.push(...values.map((term) => `%${term}%`))
    return ` AND (${conditions})`
}
/**
 * % around params search term is wildcard for fuzzy search
 * there will be conditions in which there is no search_term, like getting all the cards for a Planechase deck.
 * @param search_term 
 * @param search_type 
 * @param page 
 * @param per_page 
 * @param filters 
 * @returns 
 */
export function constructCardQuery(
    search_term?: string,
    search_type?: string,
    page = 1,
    per_page = 175,
    filters?: Filters
): QueryResult {
    /**
     * start with oracle_cards table, since multiple cards can have the same oracle_id (think foreign cards)
     * input name => oracle_cards.name, oracle_cards.oracle_id => cards.oracle_id, cards.set_code => sets.set_code/oracle_cards.oracle_id => rules.oracle_id
     */
    let query = `
        SELECT oracle_cards.oracle_id, oracle_cards.name AS name, cards.id, cards.printed_name, cards.lang, cards.set_code, cards.oracle_text, cards.printed_text, cards.image_uri, cards.card_faces, cards.oracle_id, cards.type_line, cards.treatment
        FROM oracle_cards
        LEFT JOIN cards ON oracle_cards.oracle_id = cards.oracle_id
        WHERE 1=1
        `

    const params: Array<string | number> = []

    if (search_term) {
        if (search_type === 'exact') {
            query += ' AND LOWER(oracle_cards.name) = LOWER(?) '
            params.push(search_term)
        } else {
            query += ' AND oracle_cards.name LIKE ? COLLATE NOCASE '
            /**
             * % = SQLite wildcards to pattern match zero or more characters before/after the search term.
             * ex: %{text} = ends with {text}, {text}% = starts with {text}
             */
            params.push(`%${search_term}%`) 
        }
    }

    if (filters) {
        for (const [field, values] of Object.entries(filters)) {
            if (!values?.[0]) {
                continue
            }

            const query_field = filters_map[field] ?? field

            if (field === 'type') {
                query += appendTypeFilter(values, params)
            } else {
                const placeholders = makePlaceholders(values.length)
                query += ` AND LOWER(cards.${query_field}) IN (${placeholders})`
                params.push(...values)
            }
        }
    }

    query += ' ORDER BY oracle_cards.name, cards.set_code'
    const offset = (page - 1) * per_page
    query += ' LIMIT ? OFFSET ?'
    params.push(per_page, offset)

    return { query, params }
}

export function constructFiltersQuery(filters: Filters, page = 1, per_page = 175): QueryResult {
    let query = `SELECT
                cards.id,cards.printed_name, cards.lang, cards.set_code,
                cards.oracle_text, cards.printed_text, cards.image_uri, cards.card_faces, cards.oracle_id, cards.type_line, cards.treatment,
                oracle_cards.oracle_id,
                oracle_cards.name AS name
            FROM cards
            LEFT JOIN oracle_cards ON oracle_cards.oracle_id = cards.oracle_id
            WHERE 1=1`

    const params: Array<string | number> = []

    for (const [field, values] of Object.entries(filters)) {
        if (!values?.[0]) {
            continue
        }

        const query_field = filters_map[field] ?? field

        if (field === 'type') {
            query += appendTypeFilter(values, params)
        } else {
            const placeholders = makePlaceholders(values.length)
            query += ` AND LOWER(cards.${query_field}) IN (${placeholders})`
            params.push(...values)
        }
    }

    const offset = (page - 1) * per_page
    query += ' LIMIT ? OFFSET ?'
    params.push(per_page, offset)

    return { query, params }
}

export function constructHasMoreFiltersQuery(
    filters: Filters,
    base_params: Array<string | number>,
    page: number
): QueryResult {
    const params = base_params.slice(0, -2)
    const per_page = Number(base_params[base_params.length - 2])
    const offset = Number(base_params[base_params.length - 1])

    let query = `SELECT EXISTS(
            SELECT 1
            FROM cards
            LEFT JOIN oracle_cards ON oracle_cards.oracle_id = cards.oracle_id
            WHERE 1=1`

    for (const [field, values] of Object.entries(filters)) {
        if (!values?.[0]) {
            continue
        }

        const query_field = filters_map[field] ?? field

        if (field === 'type') {
            const condition = values.map(() => 'cards.type_line LIKE ? COLLATE NOCASE').join(' OR ')
            query += ` AND (${condition})`
            params.push(...values.map((term) => `%${term}%`))
        } else {
            const placeholders = makePlaceholders(values.length)
            query += ` AND LOWER(cards.${query_field}) IN (${placeholders})`
            params.push(...values)
        }
    }

    query += ' LIMIT 1 OFFSET ?)' 
    params.push(offset + per_page)

    return { query, params }
}

export function constructHasMoreQuery(
    search_term: string,
    search_type: string | undefined,
    offset: number,
    page: number,
    per_page: number
): QueryResult {
    const query = `
    SELECT EXISTS(
        SELECT 1
        FROM oracle_cards
        LEFT JOIN cards ON oracle_cards.oracle_id = cards.oracle_id
        WHERE LOWER(oracle_cards.name) = LOWER(?)
        LIMIT 1 OFFSET ?
    )`

    const params: Array<string | number> = [search_term, offset + per_page]
    return { query, params }
}

export function countFilteredResultsQuery(
    base_params: Array<string | number>,
    filters: Filters
): QueryResult {
    const params = base_params.slice(0, -2)

    let query = `SELECT COUNT(*)
            FROM cards
            WHERE 1=1`

    for (const [field, values] of Object.entries(filters)) {
        if (!values?.[0]) {
            continue
        }

        const query_field = filters_map[field] ?? field

        if (field === 'type') {
            const condition = values.map(() => 'cards.type_line LIKE ? COLLATE NOCASE').join(' OR ')
            query += ` AND (${condition})`
            params.push(...values.map((term) => `%${term}%`))
        } else {
            const placeholders = makePlaceholders(values.length)
            query += ` AND LOWER(cards.${query_field}) IN (${placeholders})`
            params.push(...values)
        }
    }

    return { query, params }
}

export function getTotalResultsQuery(
    search_term: string,
    search_type?: string
): QueryResult {
    if (search_type === 'exact') {
        return {
            query: `SELECT COUNT(*)
        FROM oracle_cards
        LEFT JOIN cards ON oracle_cards.oracle_id = cards.oracle_id
        WHERE LOWER(oracle_cards.name) = LOWER(?)`,
            params: [search_term],
        }
    }

    return {
        query: `SELECT COUNT(*)
        FROM oracle_cards
        LEFT JOIN cards ON oracle_cards.oracle_id = cards.oracle_id
        WHERE oracle_cards.name LIKE ? COLLATE NOCASE`,
        params: [`%${search_term}%`],
    }
}

export function constructRulesQuery(ids: string[]) : QueryResult{
    const placeholders = makePlaceholders(ids.length)
    const query = `SELECT oracle_id, rules FROM rules WHERE oracle_id IN (${placeholders})`
    return {
        query : query,
        params: ids
    }
}
