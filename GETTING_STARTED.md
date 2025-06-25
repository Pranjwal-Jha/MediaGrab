# Getting Started with MediaGrab 🚀

Welcome to MediaGrab! This guide will help you get up and running quickly.

## Quick Setup (5 minutes)

### 1. Prerequisites Check
Make sure you have:
- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Python 3.8+** ([Download here](https://python.org/))
- **Git** ([Download here](https://git-scm.com/))

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/yourusername/mediagrab.git
cd mediagrab

# Install everything with one command
./deploy.sh install
```

### 3. Start Development
```bash
# Start both frontend and backend
./deploy.sh dev
```

That's it! 🎉

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## First Download

1. Open http://localhost:3000 in your browser
2. Paste a YouTube URL like: `https://youtube.com/watch?v=dQw4w9WgXcQ`
3. Select your preferred quality
4. Click "Download Video"
5. Check the download history panel on the right

## Common URLs to Test

### YouTube
- **Music Video**: `https://youtube.com/watch?v=dQw4w9WgXcQ`
- **Short Video**: `https://youtube.com/watch?v=jNQXAC9IVRw`
- **Playlist**: `https://youtube.com/playlist?list=PLv3TTBr1W_9tppikBxAE_G6qjWdBljBHJ`

### Instagram
- **Reel**: `https://instagram.com/reel/CdXyZ123abc/`
- **Post**: `https://instagram.com/p/CdXyZ123abc/` 
- **Story**: `https://instagram.com/stories/username/123456789/`

## Folder Structure
```
mediagrab/
├── frontend/          # Next.js app (React + TypeScript)
├── downloads/         # Your downloaded files appear here
├── main.py           # Python backend (FastAPI)
├── deploy.sh         # Easy deployment script
└── docker-compose.yml # Docker setup
```

## Useful Commands

```bash
# Development
./deploy.sh dev          # Start development servers
./deploy.sh health       # Check if services are running
./deploy.sh logs         # View application logs

# Production
./deploy.sh prod         # Start production servers
./deploy.sh docker       # Deploy with Docker

# Maintenance
./deploy.sh clean        # Clean build artifacts
./deploy.sh update       # Update application
```

## Troubleshooting

### Backend won't start?
```bash
# Check Python version
python3 --version

# Install dependencies manually
pip3 install -r requirements.txt

# Try running directly
python3 main.py
```

### Frontend won't start?
```bash
# Check Node version
node --version

# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Downloads failing?
- Make sure the URL is public and accessible
- Check if you have enough disk space
- Try updating yt-dlp: `pip3 install --upgrade yt-dlp`

### Port already in use?
```bash
# Kill processes on ports 3000 and 8000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
```

## Next Steps

1. **Customize the UI**: Edit files in `frontend/src/app/`
2. **Add new features**: Modify `main.py` for backend changes
3. **Deploy to production**: Use `./deploy.sh docker` or deploy to your cloud provider
4. **Configure nginx**: Use the included `nginx.conf` for reverse proxy

## Need Help?

- 📖 **Full Documentation**: See [README.md](README.md)
- 🐛 **Found a bug?**: Open an issue on GitHub
- 💡 **Feature request?**: Start a discussion
- 📧 **Email**: support@yourdomain.com

## What's Next?

- [ ] Try downloading a playlist
- [ ] Explore different quality options
- [ ] Check out the download history
- [ ] Switch between light/dark themes
- [ ] Set up Docker deployment

Happy downloading! 🎬📱