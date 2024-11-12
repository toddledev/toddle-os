import { ProjectFiles } from '@toddle/ssr/ssr.types';
import { PageComponent } from '../../../core/src/component/component.types';
export declare const matchPageForUrl: ({ url, components, }: {
    url: URL;
    components: ProjectFiles["components"];
}) => PageComponent | undefined;
export declare const get404Page: (components: ProjectFiles["components"]) => PageComponent | undefined;
export declare const getPathSegments: (url: URL) => string[];
