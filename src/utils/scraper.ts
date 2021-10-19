const cfAES = require("./slowAES");

export const isRCPCTokenRequired = (res : any) => {
    // check format of url
    const regEx =
        /var a=toNumbers\("([a-f0-9]+)"\),b=toNumbers\("([a-f0-9]+)"\),c=toNumbers\("([a-f0-9]+)"\)/;

    if (regEx.test(res.data)) {
        // this means RCPC check is needed
        // get a, b, c params
        const [_, a, b, c] = res.data.match(regEx);
        return [true, a, b, c];
    }
    
    return [false, null, null, null];
};

export const getCookie = (a : string,b: string,c: string) => {
    // check if RCPC cookie check is there
    // ref - https://codeforces.com/blog/entry/80135
    a = cfAES.toNumbers(a);
    b = cfAES.toNumbers(b);
    c = cfAES.toNumbers(c);

    const cookie = cfAES.toHex(cfAES.slowAES.decrypt(c, 2, a, b));
    console.log("RCPC", cookie);
    return cookie;

};

