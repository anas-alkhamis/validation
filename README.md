![Logo](https://github.com/TSMESolutions/CubesUI/blob/master/src/assets/logo.svg)

# `new-joiners-training` New Joiners Module

## Installation

Make Sure you have the correct setup for the dependencies.

### Step 1

All the local linkages presumes that any dependecy is located under a shared parent directory.(to save you from linking symbolic npm often)

- create a folder **TSME** for example.
- clone `cubes-vue`, `cubes`, `cubes-ui` to their respective folder names under **TSME**. (i.e cubes-ui will be under **TSME/cubes-ui** folder)

### Step 2

Create the NPM Symbolic linkage for the packages
In every project run the following command

```bash
  npm link
```

### Step 3

In Every Project repository install the dependencies.

```bash
  npm install
```

### Step 4

You can setup your IIS to serve the builds(packages) required for this module.

- Vue packages **`cubes-vue`**
- Cubes **`cubes`**
- Cubes UI **`cubes-ui`**
- Cubes CSS The external Css assets (required for development preview)

### Default Setup Presumptions

_The values for the **cdns & the port bindings** can be modified in the **webpack.config.modules.json** files_

| Module       | Port | Package     | Description                   |
| :----------- | :--- | :---------- | :---------------------------- |
| `vue`        | 448  | `cubes-vue` | Exposed Vue 3 Shared Instance |
| `vue-router` | 448  | `cubes-vue` | Exposed Vue 3 Shared Instance |
| `cubes`      | 336  | `cubes`     | Cubes core functionality      |
| `cubes-ui`   | 332  | `cubes-ui`  | Cubes Controls                |

## Development

Your Application contains two folders (**dev**/**prod**) related

### Development Mode

1- Run the build script. this will generate the dist folder for you.
2- Run the start script, this will open your browser with HMR enabled.
