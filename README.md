# Firenet Docforce Frontend Repo

## Prerequisites
- Node Version 12.x.x
- yarn `npm install -g yarn`

## Getting Started
- in Project Root run `yarn`
- Run `yarn start` project will utilize localhost:4000 and will hot reload code.
- If you require no hotreloading and want it disabled, run `yarn start:noReload`

### Models
- Stores a data object

### Services
- Concerned on how things work
- Are not aware of the DOM

### Helpers
- Helper functions that can be re-used throughout your application

### Entry Files
- Files always need to be prefixed with `firenet.entry`
- These files will create a `firenet.[name].js` in the `/public/` directory

### Browsersync
- Using Browsersync to serve the website locally for development.
- It will serve the bundles from the `/public/` directory
- Uses Port `4000`


# Linter
- Keeps our code consistent
- Makes sure we are using best practices in our code
- For Javascript we use a variation of the airbnb linter
- Example setup can be found in the .eslintrc.json file in this repo
- Include the .eslintignore file in your projects to make sure certain files are not linted.
