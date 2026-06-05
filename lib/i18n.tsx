"use client";
// Tiny i18n: a module-level store read via useSyncExternalStore. No provider,
// no hydration mismatch (server snapshot is always "en"), no setState-in-effect.
import { useSyncExternalStore } from "react";

export type Lang = "en" | "zh";

const en = {
  topbar: {
    tagline: "Research color, rooted in the world you've seen",
    poem: "Poem",
  },
  hero: {
    titleMain: "The colors you walked through,",
    titleFaint: "in your figures.",
    descPre: "Upload a landscape, choose how many colors you need, and Enracine derives a ",
    descHi: "publication-ready scientific palette",
    descPost:
      " — perceptually spaced, colorblind-safe, and grayscale-checked. No waiting between tweaks.",
  },
  drop: {
    title: "Drop a landscape",
    hint: "or click to browse · JPG / PNG / WebP",
    replace: "Replace",
    reading: "Reading the colors…",
  },
  ctrl: {
    colors: "Colors",
    style: "Style",
    simulate: "Simulate vision",
    cvdSafe: "Colorblind-safe palette",
    cvdSafeHint: "Pick colors that stay distinct for colorblind readers",
  },
  styles: {
    original: { label: "Original", hint: "True to the photo" },
    vibrant: { label: "Vibrant", hint: "Punchier chroma" },
    muted: { label: "Muted", hint: "Editorial restraint" },
    soft: { label: "Soft", hint: "Pastel lift" },
  },
  cvd: {
    none: "Normal",
    deuter: "Deuteranopia",
    prot: "Protanopia",
    trit: "Tritanopia",
  },
  sec: { palette: "Palette", quality: "Figure quality", preview: "Live preview", export: "Export" },
  palette: { simulating: "simulating · {mode}", asSeen: "As seen · {mode}", copied: "Copied" },
  empty: {
    title: "Your palette will appear here",
    desc: "Upload a photo of somewhere you've been — a coastline, a canyon, a city at dusk — and we'll turn it into colors your figures can use.",
  },
  quality: {
    distinct: "Distinct",
    distinctValue: "min ΔE {v}",
    cvd: "Colorblind-safe",
    cvdValue: "ΔE {v} under deuteranopia",
    gray: "Grayscale-safe",
    grayValue: "L gap {v}",
  },
  cvdAdvice: {
    enable:
      "Not colorblind-safe right now. Turn on “Colorblind-safe palette” above and the tool will optimize the selection for colorblind vision.",
    limit:
      "We did optimize for color blindness — but this photo only yields {n} colors that stay distinct to colorblind readers. Lower the count to {n} or fewer to be safe. This is a limit of the image, not the tool.",
    none:
      "We did optimize for color blindness, but this photo's colors are too close to tell apart under it — even a single pair. Try a more varied image, or the harmony palette.",
  },
  charts: {
    bar: "Bar",
    line: "Line",
    area: "Area",
    pie: "Pie",
    scatter: "Scatter",
    series: "Series",
    toggleHint: "Tap a series to show or hide it",
  },
  mono: {
    title: "This photo is fairly monochromatic.",
    body: "We extended its dominant hue into a harmonious set so your figure still reads.",
    use: "Use harmony palette",
    using: "Using harmony palette",
  },
  exportPanel: { copy: "Copy", copied: "Copied" },
  footer: {
    tagline: "Enracine — perceptual palettes in OKLCH / CIEDE2000.",
    rights: "© 2026 Junyu Xue · All rights reserved",
    contact: "Contact",
  },
  about: {
    title: "A note before you begin",
    nameGloss: "Enracine · /ɑ̃.ʁa.sin/ — French, “to take root.”",
    poem: [
      "Have you ever thought —",
      "the world is wide beyond counting,",
      "its mountains, its dusks, its seas,",
      "and every one of them is already a part of you.",
      "",
      "The places you have walked,",
      "the moments you have lived through,",
      "quietly became who you are.",
      "",
      "So why not let them in —",
      "let the colors of your journeys",
      "live inside your figures too.",
    ],
    tie: "Enracine takes a photograph of somewhere you've been and roots it into a palette your research can wear.",
    missionLabel: "What's next",
    mission:
      "We're building an LLM-powered Enracine — so you can shape palettes in your own words, with richer style customization and a memory for your personal taste.",
    signature: "Junyu Xue",
    contact: "Contact",
    close: "Close",
  },
  errors: { generic: "Something went wrong. Please try another image." },
};

export type Dict = typeof en;

const zh: Dict = {
  topbar: {
    tagline: "让你走过的风景，扎根进论文配色",
    poem: "寄语",
  },
  hero: {
    titleMain: "你走过的山河，",
    titleFaint: "都住进论文的图里。",
    descPre: "上传一张风景照，选择需要的颜色数量，Enracine 自动推导出",
    descHi: "可直接用于论文的科研配色",
    descPost: " —— 感知均匀、色盲安全、灰度可分，调整即时、无需等待。",
  },
  drop: {
    title: "拖入一张风景照",
    hint: "或点击选择 · JPG / PNG / WebP",
    replace: "更换",
    reading: "正在读取色彩…",
  },
  ctrl: {
    colors: "颜色数量",
    style: "风格",
    simulate: "色觉模拟",
    cvdSafe: "色盲友好配色",
    cvdSafeHint: "优先挑选对色盲读者依然能区分的颜色",
  },
  styles: {
    original: { label: "原色", hint: "忠于照片" },
    vibrant: { label: "亮眼", hint: "更高饱和" },
    muted: { label: "低饱和", hint: "克制雅致" },
    soft: { label: "柔和", hint: "柔粉提亮" },
  },
  cvd: {
    none: "正常",
    deuter: "红绿色盲",
    prot: "红色盲",
    trit: "蓝黄色盲",
  },
  sec: { palette: "配色", quality: "图表质量", preview: "实时预览", export: "导出" },
  palette: { simulating: "模拟 · {mode}", asSeen: "模拟视觉 · {mode}", copied: "已复制" },
  empty: {
    title: "你的配色会出现在这里",
    desc: "上传一张你去过的地方 —— 海岸、峡谷、黄昏的城市 —— 我们会把它变成图表能用的颜色。",
  },
  quality: {
    distinct: "可区分",
    distinctValue: "最小 ΔE {v}",
    cvd: "色盲安全",
    cvdValue: "红绿色盲下 ΔE {v}",
    gray: "灰度可分",
    grayValue: "明度差 {v}",
  },
  cvdAdvice: {
    enable:
      "当前配色对色盲不友好。打开上方的「色盲友好配色」，算法就会据此为色盲视觉优化选色。",
    limit:
      "我们确实已为色盲做了优化 —— 但这张照片最多只能给出 {n} 种对色盲读者依然可区分的颜色。把数量降到 {n} 或更少即可安全。这是图片本身的限制，不是工具的问题。",
    none:
      "我们确实已为色盲做了优化，但这张照片的颜色在色盲视角下太接近，连两种都难以区分。试试色彩更丰富的图片，或使用和谐配色。",
  },
  charts: {
    bar: "柱状",
    line: "折线",
    area: "面积",
    pie: "饼图",
    scatter: "散点",
    series: "系列",
    toggleHint: "点击系列可显示或隐藏",
  },
  mono: {
    title: "这张照片色彩比较单一。",
    body: "我们把它的主色相扩展成一组和谐配色，让图表依然清晰可读。",
    use: "使用和谐配色",
    using: "已使用和谐配色",
  },
  exportPanel: { copy: "复制", copied: "已复制" },
  footer: {
    tagline: "Enracine —— 基于 OKLCH / CIEDE2000 的感知配色。",
    rights: "© 2026 Junyu Xue · 保留所有权利",
    contact: "联系",
  },
  about: {
    title: "写在开始之前",
    nameGloss: "Enracine · /ɑ̃.ʁa.sin/ —— 法语，意为“扎根”。",
    poem: [
      "你可曾想过，",
      "世界辽阔得数不过来，",
      "那些山峦、黄昏与海，",
      "其实早已是你的一部分。",
      "",
      "你走过的每一处风景，",
      "经历过的每一段悲欢，",
      "都悄悄长成了此刻的你。",
      "",
      "那么，何不让它们也住进来 ——",
      "让旅途中的颜色，",
      "也流进你的图表里。",
    ],
    tie: "Enracine 把你去过的地方拍下的照片，扎根成论文可以穿上的配色。",
    missionLabel: "接下来",
    mission:
      "我们正在打造由大语言模型驱动的 Enracine —— 让你用自己的话来定制配色，支持更多元的风格调整，并记住你的个人偏好。",
    signature: "Junyu Xue",
    contact: "联系",
    close: "关闭",
  },
  errors: { generic: "出了点问题，请换一张图片试试。" },
};

const messages: Record<Lang, Dict> = { en, zh };

const STORAGE_KEY = "enracine-lang";
let current: Lang = "en";
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Lang {
  if (!hydrated && typeof window !== "undefined") {
    current = readStored();
    hydrated = true;
  }
  return current;
}

function getServerSnapshot(): Lang {
  return "en";
}

export function setLang(next: Lang): void {
  current = next;
  hydrated = true;
  try {
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
  } catch {
    /* ignore */
  }
  listeners.forEach((f) => f());
}

export function useI18n() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { lang, setLang, t: messages[lang] };
}

/** Replace a single {token} placeholder. */
export function fill(template: string, value: string, token = "v"): string {
  return template.replace(`{${token}}`, value);
}
