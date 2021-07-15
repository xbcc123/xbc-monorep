# xbc-design-doc

xbc-design 文档

## Usage

开发

```js
yarn run storybook
```

编译

```
yarn run build-storybook
```

## Notice
开发过程中如果只是写文档不改变原组件，注释以下webpack配置，可以启用热更新
```
# .storybook/main.js
  ...

    // 删除hrm 解决import引用组件缓存问题 如果只是需要更改文档，请注释块代码，
    if(configType === 'DEVELOPMENT') {
      config.plugins.splice(config.plugins.length - 5, 1)
    }

  ...
```

## Contributing

PRs accepted.

## License

MIT © Richard McRichface
