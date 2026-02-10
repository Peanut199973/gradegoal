# GradeGoal

A React-based calculator to help students calculate what grades they need to achieve their target degree classification.

## Features

- **Hierarchical Structure**: Year → Semester → Module → Assessment
- **Dynamic Add/Remove**: Add or remove modules and assessments as needed
- **Automatic Data Saving**: All your data is saved automatically in your browser
- **Flexible Weighting**: Set custom percentages at every level
- **Real-time Calculations**: See your current scores and what you need to achieve your target
- **Validation Warnings**: Get alerts when percentages don't add up to 100%
- **Required Score Calculator**: Shows what average you need on remaining blank assessments

## Structure

```
Year 2 & Year 3 (customisable weights)
  └─ Semester 1 & 2 (customisable weights per year)
      └─ Modules (customisable weights per semester, add/remove as needed)
          └─ Assessments (customisable weights per module, add/remove as needed)
```

## Setup Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `gradegoal` (or whatever you prefer)
3. Don't initialise with README, .gitignore, or licence (we already have these files)

### 2. Upload Files to GitHub

You can either:

**Option A: Upload via GitHub website**
1. On your new repository page, click "uploading an existing file"
2. Drag and drop all the files from this folder
3. Commit the changes

**Option B: Use Git commands** (if you have Git installed)
```bash
# In the folder containing these files
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gradegoal.git
git push -u origin main
```

### 3. Update package.json

Before deploying, edit `package.json` and change this line:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/gradegoal",
```
Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

### 4. Install Dependencies and Deploy

You'll need [Node.js](https://nodejs.org/) installed on your computer.

Then run these commands in the project folder:

```bash
# Install all dependencies
npm install

# Deploy to GitHub Pages
npm run deploy
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select the `gh-pages` branch
4. Click Save

Your calculator will be live at: `https://YOUR_USERNAME.github.io/gradegoal`

## Making Changes

Whenever you want to update the calculator:

1. Edit the `src/App.js` file
2. Test locally with `npm start`
3. Deploy changes with `npm run deploy`
4. Push your code changes to GitHub:
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push
   ```

## Local Development

To run the calculator on your computer:

```bash
npm start
```

This opens the app at `http://localhost:3000`

## How to Use

1. **Set your target**: Enter the overall percentage you're aiming for
2. **Configure year weights**: Set how much Year 2 and Year 3 contribute to your final degree (e.g., 40% and 60%)
3. **Configure semester weights**: For each year, set how much each semester contributes
4. **Add your modules**: Each semester starts with 3 modules, but you can add or remove as needed
5. **Add assessments**: Each module starts with 2 assessments (exams/coursework), but you can add or remove as needed
6. **Enter scores**: As you get results, fill in your scores
7. **See what you need**: The calculator shows you what average you need on remaining assessments to hit your target

All your data is saved automatically, so you can close the app and come back to it anytime!

## File Structure

```
gradegoal/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main calculator component
│   ├── index.js            # React entry point
│   └── index.css           # Styles
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
└── README.md              # This file
```

## Technologies Used

- React 18
- Tailwind CSS
- Lucide React (icons)
- LocalStorage (data persistence)
- GitHub Pages (hosting)
