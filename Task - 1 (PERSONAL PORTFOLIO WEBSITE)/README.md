# 🚀 Personal Portfolio Website

A highly aesthetic, premium, and fully responsive personal portfolio website designed for full-stack developers. It features beautiful custom animations, a dynamic dark/light theme, interactive sections, and clean, optimized code.

## ✨ Features

- **Dynamic Dark/Light Mode**: Seamless transitions between deep space dark and elegant light themes.
- **Custom Interactive SVG Avatar**: A unique, glowing vector male developer avatar embedded in the "About Me" section.
- **Particle Canvas Background**: Custom, high-performance canvas-based particle network that pauses automatically when scrolled out of view to save CPU.
- **Cursor Glow Effect**: Interactive mouse-tracking radial glow that enhances visual depth on desktop screens.
- **Typewriter Effect**: Dynamic typing animation showcasing roles and key technical keywords.
- **Skill Progress Animations**: Categorized skill tabs with animated percentage meters triggered by viewport entry.
- **Interactive Projects Filter**: Smooth category filtering for Web, Mobile, and Design projects.
- **Live Form Validation**: Real-time error messages, custom spinner states on submit, and interactive message length counters.
- **PDF Resume Builder**: Included `generate_pdf.py` Python automation script to compile and update a professional resume PDF directly.

## 📁 File Structure

```text
├── index.html                 # Main structure and content (semantic HTML5)
├── styles.css                 # Custom design system (glowing animations, layouts)
├── script.js                 # Optimized interaction engine (260 lines)
├── generate_pdf.py            # Resume PDF builder script
├── Avishek_Khatri_Resume.pdf  # Generated resume PDF
├── preview.html               # Responsive device simulator layout
└── project[1-6].png           # Featured project thumbnails
```

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Custom Variables, Flexbox, Grid, Keyframes, Backdrops)
- **Logic**: Vanilla ES6+ JavaScript (Intersection Observer, Canvas API, Touch Gestures)
- **Automation**: Python 3 (PDF generation)

## 🚀 Getting Started

1. Clone or download this repository.
2. Open `index.html` directly in your browser, or spin up a local development server:
   ```bash
   # Using Python
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

## 📄 Building Resume PDF

If you update your details, you can regenerate the resume PDF using the included script:
```bash
python generate_pdf.py
```
