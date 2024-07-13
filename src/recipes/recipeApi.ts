import { Octokit } from "octokit";
import { decodeToObject, encodeFile, encodeObject } from "./Base64";
import { GitFile, GitFileWithContent, GitResource, Metadata, Recipe } from "./models";

let octokit: Octokit;

const noCacheHeader: Record<string, string> = {
    'If-None-Match': ''
};

const owner = "SquigglyRoman";
const repo = "recipe-store";
const recipesRootPath = "recipes";

export async function checkTokenValidity(apiToken: string): Promise<boolean> {
    initApi(apiToken);
    try {
        await octokit.request("GET /user");
        return true;
    } catch (error) {
        return false;
    }
}

export async function getAllRecipes(): Promise<Recipe[]> {
    const recipeFolders = await get<GitResource[]>(recipesRootPath);
    return Promise.all(recipeFolders.map(fetchRecipeData));
}

export async function uploadMetadata(metadata: Metadata, recipePath: string): Promise<void> {
    const path = `${recipePath}/metadata.json`;
    const metadataFromGit = await get<GitFile>(path);
    await put(encodeObject<Metadata>(metadata), path, metadataFromGit.sha);
}

export async function updateRecipeFile(recipe: Recipe, file: File): Promise<void> {
    console.log(`Uploading recipe file ${file.name} to ${recipe.path}`);
    const path = recipe.files.recipe.path;
    const sha = recipe.files.recipe.sha;

    if (recipe.files.recipe.name === file.name) {
        await uploadFile(file, path, sha);
        return;
    }
    await uploadFile(file, `${recipe.path}/${file.name}`)
    await deleteResource(path, sha);
}

export async function uploadNewRecipe(metadata: Metadata, recipeFile: File, thumbnail?: File): Promise<void> {
    const recipePath = `${recipesRootPath}/${metadata.name}`;
    
    await uploadMetadata(metadata, recipePath);
    await uploadFile(recipeFile, `${recipePath}/${recipeFile.name}`);
    thumbnail && await uploadFile(thumbnail, `${recipePath}/${thumbnail.name}`);
}

export async function updateThumbnail(recipe: Recipe, file: File): Promise<void> {
    const path = `${recipe.path}/${file.name}`;
    console.log(`Updating thumbnail ${path}`);
    const base64Content = await encodeFile(file);

    const recipeCurrentlyHasNoThumbnail = !recipe.files.previewImage;
    const newFileHasDiffentNameThanCurrentThumbnail = recipe.files.previewImage?.name !== file.name;

    if(recipeCurrentlyHasNoThumbnail) {
        await put(base64Content, path);
    } else if(newFileHasDiffentNameThanCurrentThumbnail) {
        await put(base64Content, path);
        await deleteResource(recipe.files.previewImage?.path ?? '', recipe.files.previewImage?.sha ?? '');
    } else {
        await put(base64Content, path, recipe.files.previewImage?.sha);
    }
}

function initApi(apiToken: string) {
    octokit = new Octokit({ auth: apiToken });
}

async function fetchRecipeData(folder: GitResource): Promise<Recipe> {
    const recipeFolderContents = await get<GitFile[]>(folder.path);

    const metadataFile = findCriticalFile(recipeFolderContents, folder, 'metadata.json');
    const metadata = await fetchMetadataObject(metadataFile.path);

    const recipeFile = findCriticalFile(recipeFolderContents, folder, '.pdf')
    const imageFile = findFile(recipeFolderContents, '.jpg', '.jpeg', '.png', '.webp')

    return {
        metadata,
        files: {
            metadata: {
                name: metadataFile.name,
                sha: metadataFile.sha,
                path: metadataFile.path,
                url: metadataFile.download_url
            },
            recipe: {
                name: recipeFile.name,
                sha: recipeFile.sha,
                path: recipeFile.path,
                url: recipeFile.download_url
            },
            previewImage: imageFile ? {
                name: imageFile.name,
                sha: imageFile.sha,
                path: imageFile.path,
                url: imageFile.download_url
            } : undefined
        },
        path: folder.path
    };
}

async function fetchMetadataObject(metadataFilePath: string): Promise<Metadata> {
    const metadataFile = await get<GitFileWithContent>(metadataFilePath);
    return decodeToObject<Metadata>(metadataFile.content);
}

function findCriticalFile(recipeFolderContents: GitFile[], folder: GitResource, ...fileEndings: string[]): GitFile {
    const file = findFile(recipeFolderContents, ...fileEndings);
    if (!file) {
        throw new Error(`No file with endings ${fileEndings.join(", ")} found in folder ${folder.name}`);
    }
    return file;
}

function findFile(recipeFolderContents: GitFile[], ...fileEndings: string[]): GitFile | undefined {
    const lowercaseFileEndings = fileEndings.map(ending => ending.toLowerCase());
    return recipeFolderContents.find(file => lowercaseFileEndings.some(ending => file.name.toLowerCase().endsWith(ending.toLowerCase())));
}

/**
 * @param sha optional, needed if the file already exists 
 */
async function uploadFile(file: File, path: string, sha?: string): Promise<void> {
    await put(await encodeFile(file), path, sha);
}

async function get<T>(path: string, cacheEnabled?: boolean): Promise<T> {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        headers: cacheEnabled ? {} : noCacheHeader 
    });
    return response.data;
}

/**
 * @param sha optional, needed if the file already exists 
 */
async function put(base64Content: string, path: string, sha?: string) {
    console.log(`Uploading ${path}`);
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Uploaded ${path}`,
        content: base64Content,
        sha
    });
}

export async function deleteResource(path: string, sha: string): Promise<void> {
    console.log(`Deleting ${path}`);
    await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Deleted ${path}`,
        sha
    });
}
