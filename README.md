#  Infinite Droste Zoom Effect
## **Live link:** https://react-zoom-project.vercel.app/
An infinite zooming animation inspired by the ZoomQuilt, built with React and GSAP.

##  Assignment Overview

This project replicates the mesmerizing infinite zoom effect seen at [zoomquilt.org](https://zzz.zoomquilt.org/), using the Droste effect technique with custom supercar imagery.

##  Features

- **Seamless Infinite Zoom** - Continuously zooms into recursive imagery without visible loops
- **Interactive Controls** - Mouse wheel, keyboard, and touch controls for speed manipulation
- **Smooth Performance** - 60fps animation using GSAP and optimized layering technique
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Real-time Speed Indicator** - Visual feedback for current zoom speed

##  Technologies Used

- **React** - Component-based UI framework
- **GSAP (GreenSock Animation Platform)** - High-performance animation library
- **CSS3** - Modern styling with backdrop filters and gradients
- **Vite** - Fast build tool and dev server


##  Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd zoom-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your Droste effect image**
   - Place your image in `src/assets/`
   - Update the import path in `ZoomComponent.jsx`

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

##  Configuration

Adjust the zoom behavior in `ZoomComponent.jsx`:

```javascript
const CONFIG = {
  LAYERS: 4,           // Number of image layers (3-5 recommended)
  ZOOM_DURATION: 10,   // Seconds per zoom cycle
  SCALE_FACTOR: 4,     // Recursion depth of Droste effect
  CENTER_X: 50,        // Horizontal center of recursion (%)
  CENTER_Y: 50,        // Vertical center of recursion (%)
};
```

### Finding Your SCALE_FACTOR

1. Measure the width of your full image
2. Measure the width of the recursive inner image
3. Divide: `SCALE_FACTOR = full_width / inner_width`

Example: If full image is 1000px and inner is 250px → `SCALE_FACTOR = 4`

##  Design Approach

### The Multi-Layer Technique

Instead of using a single image and resetting (which creates visible jumps), this solution uses **multiple layers** of the same image:

1. **Layer 1** - Smallest scale (furthest "back")
2. **Layer 2** - Medium scale
3. **Layer 3** - Medium-large scale
4. **Layer 4** - Largest scale (closest to viewer)

All layers zoom simultaneously. When Layer 4 becomes too large, it's recycled as the new Layer 1 at the smallest scale. This creates truly seamless infinite zoom.

### Why This Works Better

 **Single Image Approach:**
- Zooms in → Resets → Visible jump
- Not truly infinite

-**Multi-Layer Approach:**
- Continuous zoom on all layers
- Seamless layer recycling
- True infinite effect

##-  Performance Optimizations

- CSS `will-change` property for GPU acceleration
- GSAP's optimized transform animations
- Lazy image loading
- Efficient layer recycling
- Hardware-accelerated compositing

##  Technical Learnings

### Key Concepts Demonstrated

1. **Droste Effect** - Self-similar recursive imagery
2. **GSAP Timeline Management** - Complex animation orchestration
