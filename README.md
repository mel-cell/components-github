# GitHub Profile Components

A collection of dynamic, customizable GitHub profile components generated on the fly using Vercel Edge Functions.

---

## 🍱 1. Bento Grid (The Masterpiece)

The ultimate profile summary. Displays your avatar, bio, contribution streaks, top languages, activity graph, and GitHub statistics in a beautiful, responsive bento-style grid.

<div align="center">
  <img src="https://components-github.vercel.app/api?username=mel-cell&v=1" alt="Bento Grid Preview" width="900" />
</div>

### 👨‍💻 Usage

Copy and paste this into your `README.md`:

```markdown
<div align="center">
  <img src="https://components-github.vercel.app/api?username=your-username" alt="Bento Grid" width="900" />
</div>
```

---

## 📊 2. Combined Stats Card

A sleek, full-width card that combines your **Contribution Streak**, **GitHub Stats**, and **Top Languages** into a single, gap-less layout. Perfect for a clean and informative footer.

<div align="center">
  <img src="https://components-github.vercel.app/api/card?type=combined&username=mel-cell&v=1" alt="Combined Card Preview" width="900" />
</div>

### 👨‍💻 Usage

```markdown
<div align="center">
  <img src="https://components-github.vercel.app/api/card?type=combined&username=your-username" alt="Combined Stats" width="900" />
</div>
```

---

## 🧩 3. Modular Sub-Components

Prefer a custom layout? Use these individual cards to build your own design.

| Component     | Preview (Click to View)                                                                | Usage URL                                         |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Streak**    | [View](https://components-github.vercel.app/api/card?type=streak&username=mel-cell)    | `/api/card?type=streak&username=your-username`    |
| **Stats**     | [View](https://components-github.vercel.app/api/card?type=stats&username=mel-cell)     | `/api/card?type=stats&username=your-username`     |
| **Languages** | [View](https://components-github.vercel.app/api/card?type=languages&username=mel-cell) | `/api/card?type=languages&username=your-username` |
| **Activity**  | [View](https://components-github.vercel.app/api/card?type=activity&username=mel-cell)  | `/api/card?type=activity&username=your-username`  |
| **Profile**   | [View](https://components-github.vercel.app/api/card?type=profile&username=mel-cell)   | `/api/card?type=profile&username=your-username`   |

### 👨‍💻 Example Usage

```markdown
<img src="https://components-github.vercel.app/api/card?type=streak&username=your-username" alt="Streak" />
```

---

## 🛠️ Deployment

Want to host your own instance?

1. **Fork** this repository.
2. **Deploy** to Vercel.
3. **Configure** Environment Variables:
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token (Scope: `repo` or public).

## 📝 License

MIT
