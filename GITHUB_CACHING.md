# GitHub Image Caching Guide

## Why aren't my GitSkins images showing up in my README?

If your GitSkins widget URLs work in the browser but don't display in your GitHub README, it's likely due to **GitHub's aggressive image caching**. Here's how to fix it:

---

## 🔧 Quick Fixes

### 1. Add a Cache-Busting Parameter (Recommended)

Add `&v=1` (or any number) to force GitHub to refetch:

```markdown
![Profile Card](https://gitskins.com/api/premium-card?username=yourname&theme=satan&v=1)
```

When you update your profile and want to refresh, increment the version:

```markdown
![Profile Card](https://gitskins.com/api/premium-card?username=yourname&theme=satan&v=2)
```

### 2. Wait for Cache Expiration

GitHub's image cache typically expires after **5-10 minutes**. If your images don't show immediately:
- Wait a few minutes
- Refresh your README page
- Clear your browser cache

### 3. Use Different Query Parameters

If cache-busting doesn't work, try temporarily changing the theme, then changing it back:

```markdown
<!-- First commit -->
![Card](https://gitskins.com/api/premium-card?username=yourname&theme=neon)

<!-- Second commit - forces cache refresh -->
![Card](https://gitskins.com/api/premium-card?username=yourname&theme=satan)
```

---

## 🎯 Best Practices

### For Static READMEs
If your GitHub stats don't change often, use the URL as-is:
```markdown
![Card](https://gitskins.com/api/premium-card?username=yourname&theme=satan)
```

### For Frequently Updated Stats
Add a timestamp or version parameter:
```markdown
![Card](https://gitskins.com/api/premium-card?username=yourname&theme=satan&v=2025-01)
```

Update the version whenever you want to force a refresh.

---

## 🐛 Troubleshooting

### Image shows "Loading..." forever
- **Cause**: GitHub's proxy couldn't fetch the image
- **Fix**: Check that your username is correct and try adding `&v=1`

### Image shows but is outdated
- **Cause**: GitHub is serving a cached version
- **Fix**: Increment the `v` parameter: `&v=2`, `&v=3`, etc.

### Image doesn't show but URL works in browser
- **Cause**: GitHub's CDN cache is stale
- **Fix**:
  1. Add `&v=1` to the URL
  2. Wait 5-10 minutes
  3. Hard refresh your README page (Ctrl+F5)

### Image shows 404 or error
- **Cause**: Invalid username or theme
- **Fix**: Verify your username exists on GitHub and theme name is correct:
  - `satan`, `neon`, `zen`, `github-dark`, `dracula`

---

## 📚 How GitHub Image Caching Works

1. **First Request**: GitHub's CDN fetches your image from gitskins.com
2. **Caching**: The image is cached for performance (typically 5-10 minutes)
3. **Subsequent Requests**: GitHub serves the cached version
4. **Cache Expiry**: After the cache expires, GitHub refetches on next view

**Cache-busting parameters** (`?v=1`) make GitHub treat it as a new URL, forcing a fresh fetch.

---

## ✅ Recommended Workflow

```markdown
<!-- Initial setup -->
![Profile Card](https://gitskins.com/api/premium-card?username=yourname&theme=satan&v=1)
![Stats](https://gitskins.com/api/stats?username=yourname&theme=satan&v=1)
![Streak](https://gitskins.com/api/streak?username=yourname&theme=satan&v=1)
![Languages](https://gitskins.com/api/languages?username=yourname&theme=satan&v=1)

<!-- When you want to force refresh (change v=1 to v=2) -->
![Profile Card](https://gitskins.com/api/premium-card?username=yourname&theme=satan&v=2)
```

---

## 🔗 Resources

- [GitSkins Home](https://gitskins.com)
- [Theme Examples](./examples/README.md)
- [Report an Issue](https://github.com/asamassekou10/GitSkins/issues)

---

<div align="center">

**Still having issues?** Open an issue on [GitHub](https://github.com/asamassekou10/GitSkins/issues) and we'll help!

</div>
