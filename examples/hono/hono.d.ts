import { ProjectFiles } from '@toddledev/ssr/dist/ssr.types'

export interface HonoEnv {
  Bindings: { project: { files: ProjectFiles }; template?: string }
}
