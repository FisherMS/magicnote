<template>
    <div id="giscus-container"></div>
  </template>

  <script setup>
  import giscusTalk from 'vitepress-plugin-comment-with-giscus'
  import { useData, useRoute } from 'vitepress'

  const { frontmatter } = useData()
  const route = useRoute()

  giscusTalk(
    {
      repo: 'your-username/your-repo-name', // 仓库名称
      repoId: 'YOUR_REPO_ID', // 仓库 ID
      category: 'General', // 讨论分类名称
      categoryId: 'YOUR_CATEGORY_ID', // 讨论分类 ID
      mapping: 'pathname',
      inputPosition: 'top',
      lang: 'en',
      lightTheme: 'light',
      darkTheme: 'transparent_dark'
    },
    {
      frontmatter,
      route
    },
    true
  )
  </script>

