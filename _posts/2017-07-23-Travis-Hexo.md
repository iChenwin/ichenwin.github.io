title: Travis CI 自动部署 Hexo
date: 2017-07-23 19:57:08
tag: [hexo, 博客]
category: 博客建设
---
介绍利用软件开发中的持续集成工具 Travis CI 来帮助完成 Hexo 的自动部署。
1. 登陆 GitHub，进入设置界面，在 Personal access tokens 页面下点击右上角的 Generate new token 按钮会生成新的 token，随后输入密码，取个名字，勾选一些权限。
2. 登陆 Travis CI，使用 GitHub 账户登录，它会自动关联 GitHub 上的仓库。点击右上角用户查看 GitHub 仓库，并选择要启动的项目，这里选择 yourname/yourname.github.io。  
点击设置按钮，进入设置选项，开启相关服务，Build only if .travis.yml is present：指只在有.travis.yml时改变了才构建；Build pushes：push 完分支后开始构建。  
3. 拷贝 token 并在 Travis CI 页面中配置Environment Variables，我这里取名为 `__GITHUB_TOKEN__`。  
那么 Travis CI 已获得仓库权限，现在可以给它相关操作指令了。
4. 配置 .travis.yml  （存放在博客根目录下）
.travis.yml 内容如下：

```
language: node_js
node_js:
- 6.10.3
branches:
  only:
  - hexo

install:
- npm install -g hexo-cli
- npm install

before_script:
- git config --global user.name "iChenwin"
- git config --global user.email "iChenwin@gmail.com"
- sed -i "s/__GITHUB_TOKEN__/${__GITHUB_TOKEN__}/" _config.yml

script: hexo clean && hexo generate && hexo deploy
```
最后，更改博客 _config.yml 的 deploy 项，不能用 ssh， 要改成 https：

```
deploy:
  type: git
  repository: https://__GITHUB_TOKEN__@github.com/iChenwin/ichenwin.github.io.git
  branch: master
```

  
参考：[http://www.jianshu.com/p/5e74046e7a0f](http://www.jianshu.com/p/5e74046e7a0f)
