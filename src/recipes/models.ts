export interface Metadata {
    name: string
    tags: string[]
    url?: string
}

export interface Recipe {
    metadata: Metadata
    path: string
    recipeFileUrl: string
    thumbnailUrl?: string
}

export interface GitResource {
    name: string
    path: string
    url: string
    sha: string
}

export interface GitFile extends GitResource {
    download_url: string
}

export interface GitFileWithContent extends GitFile {
    content: string // base64 encoded string representing the file content
}
