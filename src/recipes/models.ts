export interface Metadata {
    name: string
    tags: string[]
    url?: string
}

export interface File {
    name: string
    sha: string
    path: string
    url: string
}

export interface Files {
    metadata: File
    recipe: File
    previewImage?: File
}

export interface Recipe {
    metadata: Metadata
    path: string
    files: Files
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
