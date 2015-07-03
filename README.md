#Statistic Reporter for ESLint.
Analyses the files for error frequency, rather than location. This is helpful when introducing ESLint to an existing project.

![screenshot](https://raw.githubusercontent.com/ganimomer/eslint-stats/master/screenshot.png)

# Install
```js
npm install --save-dev eslint-stats
```
# Getting Started
Use it with grunt:

```js
...
  eslint: {
    options: {
      format: require('eslint-stats').byError,
      src: [...]
    },
...
```

or use it directly with ESLint:
```bash
$ eslint --format node_modules/eslint-stats/byError.js
```

# Available Reporters:

### byError
Shows the eslint report, aggragated by errors, without separation into specific files. Rules with warnings are not displayed

### byWarning
Shows the eslint report, aggragated by warnings, without separation into specific files.  Rules with errors are not displayed.

### byErrorAndWarning
Shows the eslint report, aggragated by errors and warnings, without separation into specific files. Errors are red, and warnings are yellow.