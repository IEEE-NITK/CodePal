import { OS } from "./consts";

export class Utils{
    static pathRefine = (filePath: string, os: number): string => {
        let path = String(filePath);
        path = path.replace(/\%20/g, ' ');
        path = path.replace(/\%21/g, '!');
        path = path.replace(/\%28/g, '(');
        path = path.replace(/\%29/g, ')');
        path = path.replace(/\%23/g, '#');
        path = path.replace(/\%27/g, '\'');
        path = path.replace(/\%2C/g, ',');
        path = path.replace(/\%3A/g, ':');
        path = path.replace(/\%2B/g, '+');
        path = path.replace(/\%3D/g, '=');
        if(os === OS.windows) {
            // For Windows
            path = path.slice(8);
        }
        else if(os === OS.linuxMac) {
            // For Linux
            path = path.slice(7);
        }
    
        return path;
    };
}
