# Consequences Addon Template

A template to aid with the development of [Consequences](https://github.com/JosephDuffy/consequences) addons.

Feel free to fork/download and use this project as a starting point for your own addon.

To learn more about creating Consequences addons, visit the [wiki page on addon development](https://github.com/JosephDuffy/consequences/wiki/Addon-Development).

## Running

This addon uses TypeScript and needs to be compiled to run. For this there are 2 scripts included:

- `npm run build` - Builds the *.ts files in the `src` directory in to the `dist` directory
- `npm run build:watch` - Same as above but will perform another build when file changes are detected

### Linting

An opinionated TSLint configuration is included as part of this project. This file is taken from the main Consequences repo. Feel free to remove this from your project.

2 linting scripts are included:

- `npm run lint` - Runs TSLint over the project and outputs any errors
- `npm run lint:fix` - Runs TSLint over the project and fixes any fixable errors

## License

Consequences is released until the MIT license. See the LICENSE file for the full license.