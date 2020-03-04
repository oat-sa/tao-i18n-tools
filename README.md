# tao-i18n-tools

This package is a collection of all thee translations related tools for TAO.

### installation

```
$ npm i taoI18nTools 
``` 

Following tools are available to be used in this pacakge:


## extractTranslations

The Extract Translation tool can be used to parse a given directory and extract all the strings to a POT file.

Following formats are supported by the extractTranslations tool at the moment:

- `.js`
- `.svelte`

The tool can either generate a new POT file from scratch or can add newly found strings to an existing POT file. It also skips adding the same string again in a POT file. So, the strings are not repeated if they are used in multiple places inside a project.

The tool also adds a comment above each key giving info about the component it was extracted from. 

### Usage 

```
$ i18n:extract /path/to/src /path/to/tempalte.POT
```