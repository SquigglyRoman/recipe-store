import { Octokit } from "octokit";
import { decode, encodeFile, encodeObject } from "./Base64";
import { GitFile, GitResource, Metadata, Recipe } from "./models";

let octokit: Octokit;

const noCacheHeader: Record<string, string> = {
    'If-None-Match': ''
};

const owner = "SquigglyRoman";
const repo = "recipe-store";

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
    const recipeFolders = await getAllRecipeFolders();
    return Promise.all(recipeFolders.map(fetchRecipeData));
}

export async function uploadMetadata(metadata: Metadata, recipePath: string, sha?: string): Promise<void> {
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: `${recipePath}/metadata.json`,
        message: "Update metadata",
        content: encodeObject<Metadata>(metadata),
        sha: sha
    });
}

export async function updateRecipeFile(recipe: Recipe, file: File): Promise<void> {
    console.log(`Uploading recipe file ${file.name} to ${recipe.path}`);
    const path = recipe.files.recipe.path;
    const sha = recipe.files.recipe.sha;

    if (recipe.files.recipe.name === file.name) {
        await updateExistingFile(file, path, sha);
        return;
    }
    await uploadNewFile(file, `${recipe.path}/${file.name}`)
    await deleteFile(path, sha);
}

export async function uploadNewRecipe(metadata: Metadata, recipeFile: File, thumbnail?: File): Promise<void> {
    const recipePath = `recipes/${metadata.name}`;
    
    await uploadMetadata(metadata, recipePath);
    await uploadNewFile(recipeFile, `${recipePath}/${recipeFile.name}`);
    thumbnail && await uploadNewFile(thumbnail, `${recipePath}/${thumbnail.name}`);
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
        await deleteFile(recipe.files.previewImage?.path ?? '', recipe.files.previewImage?.sha ?? '');
    } else {
        await put(base64Content, path, recipe.files.previewImage?.sha);
    }
}

export async function deleteFile(path: string, sha: string): Promise<void> {
    await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Deleted file ${path}`,
        sha
    });
}


function initApi(apiToken: string) {
    octokit = new Octokit({ auth: apiToken });
}

async function fetchRecipeData(folder: GitResource): Promise<Recipe> {
    const recipeFolderContents = await getFolderContents(folder);

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

    const metadataResponse = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: metadataFilePath,
        headers: noCacheHeader
    });
    const decoded = decode(metadataResponse.data.content);
    return JSON.parse(decoded) as Metadata;
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

async function getFolderContents(folder: GitResource): Promise<GitFile[]> {
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: folder.path,
        headers: noCacheHeader
    });
    return response.data;
}

async function getAllRecipeFolders(): Promise<GitResource[]> {
    return get('recipes');
}

async function uploadNewFile(file: File, path: string): Promise<void> {
    await put(await encodeFile(file), path);
}

async function updateExistingFile(file: File, path: string, sha: string): Promise<void> {
    await put(await encodeFile(file), path, sha);
}

async function put(base64Content: string, path: string, sha?: string) {
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Updated file ${path}`,
        content: base64Content,
        sha
    });
}

async function get(path: string): Promise<GitResource[]> {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path
    });
    return response.data;
}
