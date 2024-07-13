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
    return Promise.all(recipeFolders.map(folder => folder.path).map(fetchRecipeData));
}

export async function updateRecipe(recipeRootPath: string, newMetadata: Metadata, newRecipeFile?: File, newThumbnail?: File): Promise<void> {
    const { metadata: currentMetadata, recipeFile: currentRecipeFile, thumbnail: currentThumbnail } = await fetchRecipeFiles(recipeRootPath);

    await uploadMetadata(newMetadata, recipeRootPath, currentMetadata);
    newRecipeFile && await replaceFile(recipeRootPath, newRecipeFile, currentRecipeFile);
    newThumbnail && await replaceFile(recipeRootPath, newThumbnail, currentThumbnail);
}

export async function uploadNewRecipe(metadata: Metadata, recipeFile: File, thumbnail?: File): Promise<void> {
    const recipeRootPath = `${recipesRootPath}/${metadata.name}`;

    await uploadMetadata(metadata, recipeRootPath);
    await uploadFile(recipeFile, `${recipeRootPath}/${recipeFile.name}`);
    thumbnail && await uploadFile(thumbnail, `${recipeRootPath}/${thumbnail.name}`);
}

export async function deleteRecipe(recipeRootPath: string): Promise<void> {
    const { metadata, recipeFile, thumbnail } = await fetchRecipeFiles(recipeRootPath);
    
    await deleteResource(metadata.path, metadata.sha);
    await deleteResource(recipeFile.path, recipeFile.sha);
    thumbnail && await deleteResource(thumbnail.path, thumbnail.sha);
}

function initApi(apiToken: string) {
    octokit = new Octokit({ auth: apiToken });
}

async function fetchRecipeData(recipeFolderPath: string): Promise<Recipe> {
    const { metadata: metadataGitFile, recipeFile: recipeGitFile, thumbnail: thumbnailGitFile } = await fetchRecipeFiles(recipeFolderPath);
    const metadata = await fetchMetadataObject(metadataGitFile.path);

    return {
        metadata,
        recipeFileUrl: recipeGitFile.download_url,
        thumbnailUrl: thumbnailGitFile?.download_url,
        path: recipeFolderPath
    };

}

async function fetchRecipeFiles(recipeRootPath: string): Promise<{ metadata: GitFile, recipeFile: GitFile, thumbnail?: GitFile }> {
    const recipeFolderContents = await get<GitFile[]>(recipeRootPath);

    const metadata = findCriticalFile(recipeFolderContents, /metadata\.json/);
    const recipeFile = findCriticalFile(recipeFolderContents, /pdf$/i);
    const thumbnail = findFile(recipeFolderContents, /\.(jpg|jpeg|png|webp)$/i);
    return { metadata, recipeFile, thumbnail };
}

async function fetchMetadataObject(metadataFilePath: string): Promise<Metadata> {
    const metadataFile = await get<GitFileWithContent>(metadataFilePath);
    return decodeToObject<Metadata>(metadataFile.content);
}

function findCriticalFile(recipeFolderContents: GitFile[], regexp: RegExp): GitFile {
    const file = findFile(recipeFolderContents, regexp);
    if (!file) {
        throw new Error(`No file matching ${regexp} found.`);
    }
    return file;
}

function findFile(recipeFolderContents: GitFile[], regexp: RegExp): GitFile | undefined {
    return recipeFolderContents.find(file => file.name.match(regexp));
}

async function uploadMetadata(newMetadata: Metadata, recipePath: string, currentMetadata?: GitFile): Promise<void> {
    const path = `${recipePath}/metadata.json`;
    await put(encodeObject<Metadata>(newMetadata), path, currentMetadata?.sha);
}

async function replaceFile(recipeRootPath: string, file: File, currentFile?: GitFile): Promise<void> {
    currentFile && await deleteGitFile(currentFile);
    await uploadFile(file, `${recipeRootPath}/${file.name}`);
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

export async function deleteGitFile(file: GitFile): Promise<void> {
    await deleteResource(file.path, file.sha);
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
