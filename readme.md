# Noalias

Getting into a hassle of defining aliases in every tool's config? Wouldn't it be nice if you could have a symlink in your node_modules? `noalias` does exactly that.

## One time use

`npx noalias $(pwd)/src @src` will create `node_modules/@src` symlink pointing to your `src` folder. Now you can do `import foo from '@src/bar'` and it will work no matter what.

## Postinstall hook

No need to do this every time you set up the project. Create a file named `.noalias.json`:

```
{
    "aliases": {
        "@src": "./src"
    }
}
```

and add postinstall script:

```
{
    "scripts": {
        "postinstall": "npx noalias --config .noalias.json"
    }
}
```
