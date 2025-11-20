# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo-based static site generator blog project (高金的博客) hosted at https://igaojin.me/. It's a Chinese-language personal blog focused on web scraping, Python, blockchain, and tech explorations.

## Common Development Commands

### Content Creation
```bash
# Create new blog post
hexo new post "文章标题"

# Create weekly sharing post
hexo new week "weekly-issue-N"

# Create draft
hexo new draft "草稿标题"

# Publish draft to post
hexo publish "草稿标题"
```

### Development & Testing
```bash
# Install dependencies
npm install

# Run local development server (http://localhost:4000)
hexo server

# Generate static files
hexo generate

# Generate and deploy to GitHub Pages
hexo generate -d
```

### Git Workflow
```bash
# Stage changes
git add .

# Commit with message
git commit -m "提交说明"

# Push to source branch (hexo)
git push origin hexo

# Deploy to master branch (GitHub Pages)
hexo generate -d
```

## Architecture & Structure

### Directory Layout
- `source/_posts/` - Published blog posts (Markdown files with Chinese titles)
- `source/_drafts/` - Draft posts
- `source/about/`, `source/lab/`, `source/images/` - Static content
- `themes/cafe/` - Active theme (Cafe theme)
- `themes/landscape/` - Alternative theme
- `scaffolds/` - Post templates (post.md, draft.md, page.md, week.md)
- `public/` - Generated static files (output directory)
- `_config.yml` - Main Hexo configuration

### Content Management
- Posts support Chinese titles and content
- Front-matter metadata required for each post
- Post asset folders enabled for images/media
- Gitalk comment system integrated
- Feed and sitemap generation enabled

### Deployment Configuration
- **Source branch**: `hexo` (current branch)
- **Production branch**: `master` (GitHub Pages)
- **Domain**: https://igaojin.me/
- Uses Git-based deployment to GitHub Pages
- IPFS deployment workflow configured (triggered on master push)

### Key Configuration Settings
- Language: Chinese (zh-CN)
- Timezone: Asia/Shanghai
- Permalink structure: `:year/:month/:day/:title/`
- Theme: cafe
- Default layout: post
- Post asset folders: enabled
- Code highlighting: enabled with line numbers

### Dependencies
- Hexo 3.9.0 as core framework
- Various generators for archive, category, tag, feed, sitemap
- Gitalk for comments
- Auto-excerpt generation
- CSS/JS/image minification capabilities

## Important Notes

### Content Guidelines
- Blog posts primarily in Chinese
- Topics focus on technical content (scraping, Python, blockchain)
- Front-matter should include title, date, tags, categories
- Images should use post asset folders

### Git Workflow
1. Make changes in `hexo` branch
2. Commit and push to GitHub
3. Test locally with `hexo server`
4. Deploy with `hexo generate -d`

### Recovery Procedure
If local data is lost:
1. Clone the repository
2. Install Node.js if needed
3. Run `npm install` to install dependencies
4. Use `cnpm` with Chinese mirror if npm is slow
5. Install hexo-deployer-git separately if needed