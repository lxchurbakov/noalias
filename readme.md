# Noalias

Getting into a hassle of defining aliases in every tool's config? Wouldn't it be nice if you could have a symlink in your node_modules? `noalias` does exactly that.

## One-time use

Just do `npx noalias create $(pwd)/src @` and you will have your src folder available via `import * from '@';` for literally any js-based framework or tool. Node, webpack, vite, nextjs, angular, jest, typescript (tsc, tsx) and storybook - all of them will work without hassle.

## Postinstall hook

No need to do this every time you set up the project. Create a `.noalias.json` file in the root of your project and list there your aliases like this:

```
{
    "aliases": {
        "@src": "./src"
    }
}
```

Now you can do `npx noalias load .noalias.json` and get all aliases installed at the same time. Add this like to your postinstall script and you're good to go!

```
{
    "scripts": {
        "postinstall": "npx noalias load .noalias.json"
    }
}
```

## Cleanup

Want to remove aliases? Just do `npx noalias cleanup` and it will remove everything that was created. Alternatively you can purge your node_modules folder and aliases will be removed as well.
