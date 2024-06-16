
export interface Metadata {
    name: string
    tags: string[]
    url?: string
}

export interface Recipe {
    metadata: Metadata
    fileUrl: string
}

export interface RecipeFolder {
    name: string
    path: string
    url: string
}

export interface RecipeFolderContents {
    name: string // filename
    download_url: string // url to the raw pdf file
}

export interface RecipeFile {
    path: string
    url: string
}
