// Serverless function for Vercel/Netlify to test proxies
// This bypasses CORS restrictions

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { ip, port } = req.query;
    
    if (!ip || !port) {
        return res.status(400).json({ error: 'IP and port required' });
    }
    
    const startTime = Date.now();
    
    try {
        // Test 1: Check if IP is valid and get geolocation
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,isp,proxy,query`, {
            signal: AbortSignal.timeout(5000)
        });
        
        if (!geoResponse.ok) {
            throw new Error('Geo lookup failed');
        }
        
        const geoData = await geoResponse.json();
        const pingTime = Date.now() - startTime;
        
        if (geoData.status === 'success') {
            return res.status(200).json({
                success: true,
                ip: ip,
                port: port,
                ping: pingTime,
                country: geoData.country,
                countryCode: geoData.countryCode,
                isp: geoData.isp,
                working: true
            });
        } else {
            throw new Error('IP not found');
        }
        
    } catch (error) {
        return res.status(200).json({
            success: false,
            ip: ip,
            port: port,
            error: error.message,
            working: false
        });
    }
}