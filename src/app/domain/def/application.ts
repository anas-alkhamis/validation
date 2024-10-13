import { Application as App } from 'cubes-ui'
import { TAppConfig, TApplication } from '../meta/i-application'

class Application extends App<TAppConfig> implements TApplication {
  public contentPath: string = __webpack_public_path__
  public publicPath: string = `${__webpack_public_path__}public/`

  public deserialize({ /*someExtraProp = 100,*/ ...rest }: Partial<TApplication> = {}): void {
    super.deserialize(rest)
  }
}

export { Application }
