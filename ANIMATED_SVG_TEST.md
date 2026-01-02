# 🎬 Animated SVG Cards Test

Test file for animated SVG cards. These cards work directly in GitHub READMEs!

---

## 🔥 Satan Theme (Animated)

![Animated Satan Card](https://gitskins.com/api/card-animated?username=torvalds&theme=satan&v=1)

**Animations**:
- 🔥 Flickering flame gradient
- ⚡ Pulsing red glow on text
- 💫 Animated border
- 🌋 Pulsing ember overlays

---

## ⚡ Neon Theme (Animated)

![Animated Neon Card](https://gitskins.com/api/card-animated?username=kentcdodds&theme=neon&v=1)

**Animations**:
- 📺 Moving scanlines (CRT effect)
- 🌈 Color-shifting border (cyan ↔ magenta)
- 🎯 Grid background pattern
- ✨ Multi-layer neon glow

---

## 🍃 Zen Theme (Animated)

![Animated Zen Card](https://gitskins.com/api/card-animated?username=gaearon&theme=zen&v=1)

**Animations**:
- 🌸 Breathing animation (6s cycle)
- ⭕ Slow enso circle rotation (300s)
- 🎋 Gentle fade-in transitions
- ☮️ Minimalist, peaceful aesthetic

---

## 💼 GitHub Dark Theme (Animated)

![Animated GitHub Dark Card](https://gitskins.com/api/card-animated?username=tj&theme=github-dark&v=1)

**Animations**:
- 📊 Clean fade-in animations
- 🎯 Smooth progress bar growth
- 💼 Professional minimal effects

---

## 🦇 Dracula Theme (Animated)

![Animated Dracula Card](https://gitskins.com/api/card-animated?username=sindresorhus&theme=dracula&v=1)

**Animations**:
- 🎨 Pulsing colored dots (top-left)
- 💜 Soft purple glow effects
- ⏰ Staggered animation timing
- 🌟 Border pulse animation

---

## 📝 Usage

### Basic Usage
```markdown
![Animated Card](https://gitskins.com/api/card-animated?username=yourname&theme=satan)
```

### With Cache Busting
```markdown
![Animated Card](https://gitskins.com/api/card-animated?username=yourname&theme=neon&v=1)
```

### All Available Themes
- `satan` - Hellfire with flickering flames
- `neon` - Cyberpunk with scanlines
- `zen` - Japanese garden with breathing effects
- `github-dark` - Professional minimalism
- `dracula` - IDE theme with pulsing dots

---

## 🎯 Benefits Over Static PNGs

| Feature | Static PNG | Animated SVG |
|---------|-----------|--------------|
| **File Size** | ~50-100KB | ~15-30KB |
| **Animations** | ❌ None | ✅ Theme-specific |
| **Scalability** | ⚠️ Pixelates | ✅ Infinite |
| **GitHub Support** | ✅ Yes | ✅ Yes |
| **Loading Speed** | ⚠️ Slower | ✅ Faster |
| **Accessibility** | ⚠️ Limited | ✅ Better (text is real text) |

---

## 🔧 Technical Details

### Animation Techniques
- **CSS @keyframes** - For opacity, transform, color animations
- **SMIL `<animate>`** - For attribute animations (GitHub-safe)
- **SVG Filters** - For glow, blur effects
- **Gradients** - For color transitions

### GitHub Compatibility
✅ All animations tested in GitHub READMEs
✅ No JavaScript required
✅ Works with GitHub's security policies
✅ Renders on mobile and desktop

### Performance
- ⚡ Lightweight (15-30KB typical)
- 🚀 Faster than PNG generation
- ♻️ Cached by CDN
- 📱 Mobile-optimized

---

## 🎨 Animation Timings by Theme

| Theme | Main Loop | Accent Animations | Overall Feel |
|-------|-----------|------------------|--------------|
| **Satan** | 3s flame flicker | 4s ember pulse | Chaotic, intense |
| **Neon** | 4s color shift | 6-8s scanlines | Fast, energetic |
| **Zen** | 6s breathing | 300s rotation | Slow, peaceful |
| **GitHub Dark** | 0.8s fade-in | 1.2s progress | Quick, professional |
| **Dracula** | 3s dot pulse | 4s border | Rhythmic, medium |

---

## 🐛 Troubleshooting

### Animations not showing?
- **Wait 5-10 minutes** - GitHub caches aggressively
- **Add `&v=2`** - Force cache refresh
- **Check browser** - Some browsers disable SVG animations in low-power mode
- **Try incognito** - Clear cache issues

### SVG looks weird?
- **Verify URL** - Check username and theme spelling
- **GitHub status** - Check if GitHub's CDN is having issues
- **Try static version** - Use `/api/premium-card` instead as fallback

---

<div align="center">

**🎬 GitSkins Animated SVG Cards**

[🏠 Home](https://gitskins.com) • [📖 Docs](./README.md) • [🔥 Examples](./examples/README.md)

</div>
