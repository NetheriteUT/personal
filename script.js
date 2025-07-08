// Create floating bubbles
function createBubbles() {
    const bubblesContainer = document.querySelector('.bubbles');
    const bubbleCount = 20;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random size
        const size = Math.random() * 40 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random position
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        bubble.style.animationDelay = `${Math.random() * 8}s`;
        
        bubblesContainer.appendChild(bubble);
    }
}

// Typing effect for terminal commands
function typeCommand(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    const typeTimer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeTimer);
        }
    }, speed);
}

// Smooth scrolling for scroll indicator
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('.projects-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Matrix rain effect (subtle)
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = '01';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = `${fontSize}px JetBrains Mono`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 100);
}

// Glitch effect for title
function addGlitchEffect() {
    const title = document.querySelector('h1');
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            title.style.textShadow = '2px 0 #ff0000, -2px 0 #0000ff';
            setTimeout(() => {
                title.style.textShadow = '0 0 10px rgba(80, 250, 123, 0.5)';
            }, 100);
        }
    }, 1000);
}

// Stock ticker functionality
const FINNHUB_API_KEY = 'd1mjse9r01qlvnp2t68gd1mjse9r01qlvnp2t690';
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'ADBE', 'CRM'];

async function fetchStockData() {
    const stockTicker = document.querySelector('.stock-ticker');
    
    try {
        const stockPromises = POPULAR_STOCKS.map(async (symbol) => {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
            const data = await response.json();
            
            // Get company profile for description
            const profileResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
            const profileData = await profileResponse.json();
            
            return {
                symbol,
                name: profileData.name || symbol,
                current: data.c,
                change: data.d,
                changePercent: data.dp
            };
        });
        
        const stocks = await Promise.all(stockPromises);
        displayStocks(stocks);
        
    } catch (error) {
        console.error('Error fetching stock data:', error);
        stockTicker.innerHTML = '<div class="loading">Error loading stock data</div>';
    }
}

function displayStocks(stocks) {
    const stockTicker = document.querySelector('.stock-ticker');
    const now = new Date().toLocaleTimeString();
    
    let html = '<div class="stock-grid">';
    
    stocks.forEach(stock => {
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = stock.change >= 0 ? '+' : '';
        
        html += `
            <div class="stock-item">
                <div class="stock-info">
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-description">${stock.name}</div>
                </div>
                <div class="stock-price">
                    <div class="stock-current">$${stock.current?.toFixed(2) || 'N/A'}</div>
                    <div class="stock-change ${changeClass}">
                        ${changeSymbol}${stock.change?.toFixed(2) || 'N/A'} (${changeSymbol}${stock.changePercent?.toFixed(2) || 'N/A'}%)
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += `<div class="last-updated">Last updated: ${now}</div>`;
    
    stockTicker.innerHTML = html;
}

// Initialize stock ticker
function initializeStockTicker() {
    fetchStockData();
    setInterval(fetchStockData, 10000); // Update every 10 seconds
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupScrollIndicator();
    initializeStockTicker();
    
    // Type commands with delays
    setTimeout(() => {
        const commands = document.querySelectorAll('.command');
        commands.forEach((cmd, index) => {
            setTimeout(() => {
                typeCommand(cmd, cmd.textContent, 30);
            }, index * 2000);
        });
    }, 500);
});

// Parallax effect for bubbles
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach((bubble, index) => {
        const speed = 0.5 + (index % 3) * 0.1;
        bubble.style.transform = `translateY(${scrolled * speed}px)`;
    });
});
