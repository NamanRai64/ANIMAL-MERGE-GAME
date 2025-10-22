# Animal Merge Quest - Frontend

## Project Structure

```
frontend/
├── public/                   # Web-accessible files
│   ├── Animal_Merge.html    # Main HTML file
│   ├── style.css            # Main stylesheet
│   └── script.js           # Main game logic
├── assets/                  # Static assets (outside public)
│   └── images/             # Image assets
│       ├── ANIMAL_MERGE_LOGO.jpg
│       ├── ANIMAL_MERGE_LOGO1.png
│       ├── cat.png
│       ├── insect.png
│       ├── jurrasic.png
│       ├── LOGO.jpg
│       ├── mythical.png
│       ├── ocean.png
│       ├── standard.png
│       └── swamp.jpg
└── README.md               # This file
```

## File Organization

### Public Folder
Web-accessible files are contained in the `public/` directory:

- `Animal_Merge.html` - Main entry point with all game screens and UI elements
- `style.css` - Complete game styling including:
  - Dark/light mode support
  - Responsive design
  - Game UI components
  - Animations and transitions
- `script.js` - Game logic including:
  - Category selection
  - Game state management
  - Drag & drop functionality
  - API integration with backend
  - Timer and scoring system

### Assets Folder
Static assets are kept outside the public directory:

- `assets/images/` - All game images including:
  - Category selection images (standard.png, ocean.png, etc.)
  - Logo files (ANIMAL_MERGE_LOGO.jpg, ANIMAL_MERGE_LOGO1.png)
  - Background images (swamp.jpg, LOGO.jpg)

## Features

- **Multi-category animal merging game**
- **Dark/Light mode toggle**
- **Responsive design**
- **Drag & drop interface**
- **Real-time scoring**
- **Timer-based gameplay**
- **Backend API integration**

## Development

The frontend is a vanilla HTML/CSS/JavaScript application that communicates with a Spring Boot backend for animal merging logic.

## Browser Support

- Modern browsers with ES6+ support
- Drag & Drop API support
- Canvas API support for background animations
