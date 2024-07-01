import Cookies from "js-cookie";
import { isAuthorized } from "../recipes/recipeApi";

export function checkIfAuthorizedFromCookie(): Promise<boolean> {
    return checkIfAuthorized(Cookies.get('apiToken'));
}

export function checkIfAuthorized(apiToken?: string): Promise<boolean> {
    if(!apiToken) {
        return Promise.resolve(false);
    }
    return isAuthorized(apiToken);
    
}