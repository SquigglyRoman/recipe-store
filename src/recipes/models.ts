
export interface Metadata {
    name: string
    tags: string[]
    url?: string
}

export interface Recipe {
    metadata: Metadata
    fileUrl: string
    metadataUrl: string
    metadataSha: string
    imageUrl?: string
}

export interface RecipeFolder {
    name: string
    path: string
    url: string
}

export interface RecipeFolderContents {
    name: string // filename
    path: string // path to the file
    download_url: string // url to the raw file
    sha: string
}

export interface RecipeFile {
    path: string
    url: string
}
