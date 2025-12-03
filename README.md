# 🚀 Free SOCKS5 Proxy Fetcher

A beautiful, modern web application that automatically fetches and displays free SOCKS5 proxies with one-click Telegram integration.

## ✨ Features

- **Auto-Update**: GitHub Actions fetches fresh proxies every 6 hours
- **Beautiful UI**: Stunning glassmorphism design with liquid animations
- **Telegram Ready**: One-click proxy addition to Telegram
- **Search & Filter**: Find proxies by IP or port instantly
- **Pagination**: 12 proxies per page for better performance
- **Proxy Testing**: Test proxy connectivity and get location info
- **Responsive**: Works perfectly on mobile and desktop
- **Real-time Stats**: See proxy count and last update time
- **Zero Backend**: Fully static, hosted on GitHub Pages

## 🎨 Design Features

- Liquid glass morphism effects
- Animated gradient backgrounds
- Floating bubble animations
- Smooth hover effects
- Mobile-responsive layout
- Dark mode optimized

## 🛠️ Technology Stack

- Pure HTML/CSS/JavaScript (No frameworks needed)
- GitHub Actions for automation
- Python for data processing
- GitHub Pages for hosting
- ip-api.com for proxy geolocation (CORS-enabled)

## 📦 Setup

### Basic Setup (GitHub Pages)

1. Fork this repository
2. Enable GitHub Pages in Settings → Pages → Source: main branch
3. Enable GitHub Actions in Settings → Actions → Allow all actions
4. The workflow will run automatically every 6 hours
5. Visit `https://yourusername.github.io/perplexity-coding/`

### Advanced Setup (With Serverless Testing)

For better proxy testing without CORS limitations:

1. Deploy to **Vercel** or **Netlify**
2. The `/api/test-proxy.js` serverless function will handle proxy testing
3. Set `USE_BACKEND = true` in `script.js`
4. Update `BACKEND_URL` to your deployment URL

## 🔄 Manual Update

Go to Actions → Fetch Proxies → Run workflow

## 📱 Usage

1. Browse available proxies (12 per page)
2. Use search to find specific IPs or ports
3. Click "🔎 Test Proxy" to verify connectivity
4. Click "📱 Add to Telegram" on any proxy card
5. Telegram will open with the proxy pre-configured
6. Confirm to add the proxy

## 🎯 Features Breakdown

### Proxy Testing
- **IP Validation**: Checks if IP is reachable
- **Geolocation**: Shows country with flag emoji
- **ISP Info**: Displays internet service provider
- **Response Time**: Shows ping in milliseconds
- **Status Badge**: Color-coded status (Unknown/Testing/Valid/Failed)

### Pagination
- 12 proxies per page (optimized for old devices)
- Previous/Next navigation
- Page counter with total count
- Auto-scroll to top on page change

### Search & Filter
- **Search**: Filter by IP or port number
- **Fast Filter**: Show only proxies with ports < 10000
- **All Filter**: Show all available proxies

## 📊 Data Source

Proxies are sourced from [Proxifly's Free Proxy List](https://github.com/proxifly/free-proxy-list)

## 🌐 APIs Used

- **ip-api.com**: Free geolocation API (45 req/min, CORS-enabled)
- No API key required for basic usage
- Fallback to serverless function if deployed to Vercel/Netlify

## ⚙️ Configuration

Edit `script.js` to customize:

```javascript
const proxiesPerPage = 12;  // Proxies per page
const USE_BACKEND = false;  // Use serverless function
const BACKEND_URL = '/api/test-proxy';  // Backend URL
```

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📄 License

MIT License - Feel free to use and modify!

## 🔧 Troubleshooting

### CORS Errors
If you see CORS errors:
1. The app now uses CORS-enabled APIs (ip-api.com)
2. For advanced testing, deploy to Vercel/Netlify and enable backend

### No Proxies Showing
1. Check if GitHub Actions workflow ran successfully
2. Verify `proxies.json` exists in repository
3. Check browser console for errors

### Proxy Test Fails
- Some IPs may be unreachable from your location
- Test validates IP existence, not full SOCKS5 protocol
- Use Telegram link to test actual proxy functionality

---

Made with ❤️ and ✨ glassmorphism

**Note**: This app validates IP addresses and provides geolocation info. For full SOCKS5 protocol testing, add the proxy to Telegram and test actual connectivity.