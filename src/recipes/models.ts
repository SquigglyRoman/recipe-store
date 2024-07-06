
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
