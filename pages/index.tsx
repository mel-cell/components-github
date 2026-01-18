import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [username, setUsername] = useState("mel-cell");
  const [customImage, setCustomImage] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("mel-cell");
  const [debouncedImage, setDebouncedImage] = useState("");
  const [host, setHost] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setHost(window.location.origin);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username || "mel-cell");
      setDebouncedImage(customImage);
    }, 800);
    return () => clearTimeout(timer);
  }, [username, customImage]);

  const queryParams = new URLSearchParams();
  queryParams.set("username", debouncedUsername);
  if (debouncedImage) queryParams.set("image", debouncedImage);

  const imageUrl = `${host}/api?${queryParams.toString()}`;
  const markdownCode = `![${debouncedUsername}'s Stats](${imageUrl})`;
  const htmlCode = `<img src="${imageUrl}" alt="${debouncedUsername}'s Stats" />`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Bento Grid Generator</title>
        <meta
          name="description"
          content="Generate beautiful GitHub profile stats"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>GitHub Bento Grid_</h1>
          <p className={styles.subtitle}>
            Generate a beautiful, dynamic Bento Grid for your GitHub Profile
            README. Just enter your username below.
          </p>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub Username..."
              className={styles.input}
              spellCheck={false}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
              placeholder="Custom Image URL (Optional)..."
              className={styles.input}
              spellCheck={false}
            />
          </div>
        </div>

        <div className={styles.preview}>
          {host && (
            <img // eslint-disable-next-line @next/next/no-img-element
              src={`/api?${queryParams.toString()}`}
              alt={`${debouncedUsername} GitHub Stats`}
              className={styles.previewImage}
              key={`${debouncedUsername}-${debouncedImage}`} // Force re-render/animate on change
            />
          )}
        </div>

        <div className={styles.codeSection}>
          <div className={styles.codeBlock}>
            <div className={styles.codeTitle}>Markdown (README.md)</div>
            <code className={styles.code}>{markdownCode}</code>
            <button
              className={styles.copyButton}
              onClick={() => copyToClipboard(markdownCode, "md")}
            >
              {copied === "md" ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeTitle}>HTML</div>
            <code className={styles.code}>{htmlCode}</code>
            <button
              className={styles.copyButton}
              onClick={() => copyToClipboard(htmlCode, "html")}
            >
              {copied === "html" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with Next.js & Vercel OG</p>
      </footer>
    </div>
  );
}
