import { THashMap } from 'cubes'
import { TApplication as TApp } from 'cubes-ui'

type TApprisalsCustomTheme = {
  style: string
  title: THashMap
  logo: string
  bg: string
  auth: {
    appLogo: string
    clientLogo: string
  }
}

type TAppConfig = TApp['config'] & {
  customThemes: TApprisalsCustomTheme[]
}
type TApplication = TApp<TAppConfig> & { contentPath: string; publicPath: string }
export type { TApplication, TApprisalsCustomTheme, TAppConfig }
