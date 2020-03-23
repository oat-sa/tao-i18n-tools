# tao-i18n-tools

This package is a collection of translations related tools for TAO.

### installation

```
$ npm i -D @oat-sa/tao-i18n-tools
```

Following tools are available to be used in this package:

## Extract Translations

The extract translation tool can be used to parse a given directory and extract all the strings to a POT file.

Following formats are supported by the extract translations tool at the moment:

-   `.js`
-   `.svelte`

The tool can either generate a new POT file from scratch or can add newly found strings to an existing POT file. It also skips adding the same string again in a POT file. So, the strings are not repeated if they are used in multiple places inside a project.

The tool also adds a comment above each key giving info about the component it was extracted from.

### Usage

```
$ i18n:extract -s absolute/path/to/src -d absolute/path/to/template.POT
```

> :warning: **Relative paths are not supported**: please use absolute path for source and destination argument. 
