import { PageComponent } from '@toddle/core/src/component/component.types';
import { ProjectFiles } from '@toddle/ssr/ssr.types';
export declare const matchPageForUrl: ({ url, components, }: {
    url: URL;
    components: ProjectFiles["components"];
}) => PageComponent | undefined;
export declare const get404Page: (components: ProjectFiles["components"]) => PageComponent | undefined;
export declare const getPathSegments: (url: URL) => string[];
