export declare const isLocalhostUrl: (hrefOrOrigin: string) => boolean;
export declare const isLocalhostHostname: (hostname: string) => hostname is "localhost" | "127.0.0.1";
export declare const validateUrl: (url?: string | null, base?: string) => false | URL;
export declare const PROXY_URL_HEADER = "x-toddle-url";
