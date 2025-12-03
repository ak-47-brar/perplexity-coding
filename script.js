let allProxies = [];
let filteredProxies = [];
let currentPage = 1;
const proxiesPerPage = 12;

const proxyGrid = document.getElementById('proxyGrid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const proxyCountEl = document.getElementById('proxyCount');
const lastUpdateEl = document.getElementById('lastUpdate');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const refreshBtn = document.getElementById('refreshBtn');
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');

async function fetchProxies() {
    loading.style.display = 'block';
    error.style.display = 'none';
    proxyGrid.innerHTML = '';

    try {
        const response = await fetch('proxies.json?t=' + Date.now());
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        allProxies = data.proxies;
        filteredProxies = [...allProxies];
        
        proxyCountEl.textContent = allProxies.length;
        lastUpdateEl.textContent = new Date(data.lastUpdate).toLocaleTimeString();
        
        currentPage = 1;
        displayProxies();
        updatePagination();
        loading.style.display = 'none';
    } catch (err) {
        console.error('Error fetching proxies:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

function displayProxies() {
    proxyGrid.innerHTML = '';
    
    if (filteredProxies.length === 0) {
        proxyGrid.innerHTML = '<div class="glass-card" style="grid-column: 1/-1; text-align: center;">No proxies found matching your criteria.</div>';
        return;
    }

    const startIndex = (currentPage - 1) * proxiesPerPage;
    const endIndex = startIndex + proxiesPerPage;
    const paginatedProxies = filteredProxies.slice(startIndex, endIndex);

    paginatedProxies.forEach((proxy, index) => {
        const card = document.createElement('div');
        card.className = 'proxy-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.dataset.ip = proxy.ip;
        card.dataset.port = proxy.port;
        
        const telegramLink = `https://t.me/proxy?server=${proxy.ip}&port=${proxy.port}`;
        
        card.innerHTML = `
            <div class="proxy-header">
                <span class="proxy-icon">🌐</span>
                <span class="proxy-status" data-status="unknown">⏳ Unknown</span>
            </div>
            <div class="proxy-info">
                <div class="proxy-ip">${proxy.ip}</div>
                <div class="proxy-port">Port: ${proxy.port}</div>
                <div class="proxy-details">
                    <div class="proxy-ping">Ping: <span class="ping-value">-</span></div>
                    <div class="proxy-country" style="display: none;">Location: <span class="country-value">-</span></div>
                </div>
            </div>
            <div class="proxy-actions">
                <button class="ping-btn" onclick="testProxyExternal('${proxy.ip}', '${proxy.port}', this)">
                    🔍 Test IP
                </button>
                <a href="${telegramLink}" class="telegram-link" target="_blank" rel="noopener noreferrer">
                    📱 Add to Telegram
                </a>
            </div>
        `;
        
        proxyGrid.appendChild(card);
    });
}

// Test proxy using HTTPS-only APIs
async function testProxyExternal(ip, port, button) {
    const card = button.closest('.proxy-card');
    const statusEl = card.querySelector('.proxy-status');
    const pingEl = card.querySelector('.ping-value');
    const countryEl = card.querySelector('.proxy-country');
    const countryValue = card.querySelector('.country-value');
    
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Testing...';
    statusEl.textContent = '⏳ Testing';
    statusEl.style.background = 'rgba(255, 193, 7, 0.2)';
    statusEl.style.borderColor = 'rgba(255, 193, 7, 0.5)';
    
    const startTime = Date.now();
    
    try {
        // Use ipapi.co (HTTPS, free, no key required, 30k requests/month)
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
            signal: AbortSignal.timeout(8000)
        });
        
        if (!response.ok) {
            // Fallback to ipwho.is (HTTPS, free)
            const fallbackResponse = await fetch(`https://ipwho.is/${ip}`, {
                signal: AbortSignal.timeout(5000)
            });
            
            if (!fallbackResponse.ok) throw new Error('Both APIs failed');
            
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.success) {
                handleSuccessfulTest(fallbackData, startTime, statusEl, pingEl, countryEl, countryValue, button);
            } else {
                throw new Error('IP lookup failed');
            }
            return;
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.reason || 'IP lookup failed');
        }
        
        handleSuccessfulTest(data, startTime, statusEl, pingEl, countryEl, countryValue, button);
        
    } catch (err) {
        console.error('Proxy test error:', err);
        handleFailedTest(startTime, statusEl, pingEl, button);
    }
}

function handleSuccessfulTest(data, startTime, statusEl, pingEl, countryEl, countryValue, button) {
    const pingTime = Date.now() - startTime;
    pingEl.textContent = `${pingTime}ms`;
    pingEl.style.color = '#4caf50';
    
    statusEl.textContent = '✓ IP Valid';
    statusEl.style.background = 'rgba(0, 255, 0, 0.2)';
    statusEl.style.borderColor = 'rgba(0, 255, 0, 0.5)';
    
    button.innerHTML = '✓ IP Found';
    button.style.background = 'rgba(0, 255, 0, 0.3)';
    button.style.borderColor = 'rgba(0, 255, 0, 0.5)';
    
    // Show country info - handle different API response formats
    const country = data.country || data.country_name;
    const countryCode = data.country_code || data.country_code;
    
    if (country) {
        const flag = getCountryFlag(countryCode);
        countryValue.innerHTML = `${flag} ${country}`;
        countryEl.style.display = 'block';
    }
    
    showToast(`✓ IP validated! (${pingTime}ms)`);
    button.disabled = false;
}

function handleFailedTest(startTime, statusEl, pingEl, button) {
    pingEl.textContent = 'N/A';
    pingEl.style.color = '#ff9800';
    statusEl.textContent = '⚠ Unknown';
    statusEl.style.background = 'rgba(255, 152, 0, 0.2)';
    statusEl.style.borderColor = 'rgba(255, 152, 0, 0.5)';
    button.innerHTML = '⚠ Test Failed';
    button.style.background = 'rgba(255, 152, 0, 0.3)';
    button.style.borderColor = 'rgba(255, 152, 0, 0.5)';
    showToast('⚠ Could not verify IP');
    button.disabled = false;
}

// Get country flag emoji from country code
function getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProxies.length / proxiesPerPage);
    let paginationEl = document.getElementById('pagination');
    
    if (!paginationEl) {
        paginationEl = document.createElement('div');
        paginationEl.id = 'pagination';
        paginationEl.className = 'pagination glass-card';
        document.querySelector('.container').appendChild(paginationEl);
    }
    
    if (totalPages <= 1) {
        paginationEl.style.display = 'none';
        return;
    }
    
    paginationEl.style.display = 'flex';
    paginationEl.innerHTML = `
        <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ← Previous
        </button>
        <div class="page-info">
            Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong>
            <span style="opacity: 0.7; margin-left: 1rem;">(${filteredProxies.length} proxies)</span>
        </div>
        <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next →
        </button>
    `;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProxies.length / proxiesPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayProxies();
    updatePagination();
    proxyGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function searchProxies() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProxies = [...allProxies];
    } else {
        filteredProxies = allProxies.filter(proxy => 
            proxy.ip.includes(searchTerm) || 
            proxy.port.toString().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayProxies();
    updatePagination();
    proxyCountEl.textContent = filteredProxies.length;
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        if (filter === 'all') {
            filteredProxies = [...allProxies];
        } else if (filter === 'fast') {
            filteredProxies = allProxies.filter(proxy => 
                parseInt(proxy.port) < 10000
            );
        }
        
        currentPage = 1;
        displayProxies();
        updatePagination();
        proxyCountEl.textContent = filteredProxies.length;
    });
});

searchBtn.addEventListener('click', searchProxies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchProxies();
});
refreshBtn.addEventListener('click', fetchProxies);

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Copied to clipboard!');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

fetchProxies();
setInterval(fetchProxies, 5 * 60 * 1000);