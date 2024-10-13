const path = require('path')
const modules = []
// for node_modules set path without ./node_modules prefix
const externals = {
  ['new-joiners-training']: {
    id: 'new-joiners-training',
    path: '.',
    main: 'new-joiners-training.js'
  },
  cubes: {
    id: 'cubes',
    path: '.',
    main: 'packages/cubes/cubes.js'
  },
  ['cubes-ui']: {
    id: 'cubes-ui',
    path: '.',
    main: 'packages/cubes-ui/cubes-ui.js'
  },
  ['cubes-app']: {
    id: 'cubes-app',
    path: '.',
    main: 'packages/cubes-app/cubes-app.js'
  },
  ['cubes-style']: {
    id: 'cubes-style',
    path: '.',
    main: 'packages/cubes-style/cubes-style.js'
  },
  ['cubes-auth']: {
    id: 'cubes-auth',
    path: '.',
    main: 'packages/cubes-auth/cubes-auth.js'
  },
  ['cubes-dashboard']: {
    id: 'cubes-dashboard',
    path: '.',
    main: 'packages/cubes-dashboard/cubes-dashboard.js'
  },
  Vue: {
    // ref'https://unpkg.com/vue@3.2.31/dist/vue.global.prod.js'
    id: 'Vue',
    path: '.',
    main: 'packages/vue/vue.global.js'
  },
  VueRouter: {
    // ref'https://unpkg.com/vue-router@4.0.14/dist/vue-router.global.js'
    id: 'VueRouter',
    path: '.',
    main: 'packages/vue-router/vue-router.global.js'
  }
}

function init(production = false) {
  const packages = { hash: 'bundle', imports: {} },
    paths = []
  Object.keys(externals).forEach(key => {
    const { id, path, main, local } = externals[key]
    const importPath = path != '.' ? `${path}/${main}` : `./${main}`
    packages.imports[id] = importPath
    paths.push(importPath)
  })

  require('fs').writeFileSync(`./vendor/packages${production ? '.release' : '.debug'}.json`, JSON.stringify(packages))
  return {
    patterns: paths
      .filter(x => !x.includes('http'))
      .map(function (x) {
        return x
      })
  }
}
module.exports = { init, modules }
