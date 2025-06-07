import Cookies from "js-cookie";
import { checkTokenValidity } from "../recipes/recipeApi";

export function checkIfAuthorizedFromCookie(): Promise<boolean> {
    const tokenFromCookie = Cookies.get('apiToken');
    if(!tokenFromCookie) {
        return Promise.resolve(false);
    }
    return checkTokenValidity(tokenFromCookie);
}

export function saveLogin(apiToken: string): void {
    Cookies.set('apiToken', apiToken, { expires: 95 });
}
