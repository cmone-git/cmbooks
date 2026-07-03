// Global toggle functions
window.toggleDesktopSidebar = function() {
    const sidebarNode = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    
    if (sidebarNode) {
        sidebarNode.classList.toggle('sidebar-collapsed');
        
        // Dynamically swap the icon in the inner toggle button
        if (toggleBtn) {
            if (sidebarNode.classList.contains('sidebar-collapsed')) {
                toggleBtn.innerHTML = '<i data-lucide="chevron-right" class="w-5 h-5"></i>';
            } else {
                toggleBtn.innerHTML = '<i data-lucide="chevron-left" class="w-5 h-5"></i>';
            }
            if (window.lucide) lucide.createIcons(); 
        }
    }
};

window.toggleMobileSidebar = function() {  
    const sidebarNode = document.getElementById('sidebar');
    const overlayNode = document.getElementById('sidebarOverlay');
    
    if (!sidebarNode || !overlayNode) return;

    if (sidebarNode.classList.contains('hidden')) {  
        sidebarNode.classList.remove('-translate-x-full', 'hidden');
        overlayNode.classList.remove('hidden');  
    } else {  
        sidebarNode.classList.add('-translate-x-full');  
        setTimeout(() => { sidebarNode.classList.add('hidden'); }, 300);
        overlayNode.classList.add('hidden');  
    }  
};

window.toggleSubmenu = function(submenuId, triggerBtnNode) {  
    const targetSubmenuNode = document.getElementById(submenuId);  
    if (targetSubmenuNode) {
        targetSubmenuNode.classList.toggle('open');  
        const chevron = triggerBtnNode.querySelector('.chevron-icon');
        if (chevron) chevron.classList.toggle('rotate-180');
    }  
};

window.syncData = function() {  
    const syncBtn = document.getElementById('sync-icon');  
    if (syncBtn) {
        syncBtn.classList.add('syncing');  
        setTimeout(() => syncBtn.classList.remove('syncing'), 1000);  
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Fetch Split HTML
    try {
        const loadHTMLComponent = async (url, containerId) => {
            const response = await fetch(url);
            if(!response.ok) throw new Error("File fetch failed");
            const textHTML = await response.text();
            document.getElementById(containerId).innerHTML = textHTML;
        };

        await Promise.all([
            loadHTMLComponent('sidebar.html', 'sidebar-container'),
            loadHTMLComponent('header.html', 'header-container'),
            loadHTMLComponent('bottom-nav.html', 'bottom-nav-container')
        ]);
    } catch(err) {
        console.warn("Component fetch skipped. Use a local web server (e.g. VS Code Live Server).");
    }

    // 2. Init Icons
    try { if (window.lucide) lucide.createIcons(); } catch(e) {}

    // 3. Render Task Donut Chart
    try {
        const donutCtx = document.getElementById('taskDonut');
        if (donutCtx) {
            new Chart(donutCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Pending', 'On Hold'],
                    datasets: [{ data: [45, 18, 9], backgroundColor: ['#00b955', '#f59e0b', '#0f172a'], borderWidth: 3, borderColor: '#ffffff', hoverOffset: 4 }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }
            });
        }
    } catch(e) {}

    // 4. Render Financial Summary Bar Chart
    try {
        const barCtx = document.getElementById('salesPurchaseChart');
        if (barCtx) {
            const ctxBar = barCtx.getContext('2d');
            const salesGrad = ctxBar.createLinearGradient(0, 0, 0, 300);
            salesGrad.addColorStop(0, '#00b955'); salesGrad.addColorStop(1, '#008f39');
            const purchGrad = ctxBar.createLinearGradient(0, 0, 0, 300);
            purchGrad.addColorStop(0, '#0f172a'); purchGrad.addColorStop(1, '#1e293b');

            new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    datasets: [
                        { label: 'Sales', data: [150, 180, 140, 220, 190, 260], backgroundColor: salesGrad, borderRadius: 6, barPercentage: 0.6 },
                        { label: 'Purchase', data: [110, 140, 100, 180, 150, 210], backgroundColor: purchGrad, borderRadius: 6, barPercentage: 0.6 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
                    plugins: { legend: { position: 'top', align: 'end', labels: { boxWidth: 10 } } }
                }
            });
        }
    } catch(e) {}

    // 5. Render Minimal Project Wise Line Chart
    try {
        const lineCtx = document.getElementById('projectLineChart');
        if (lineCtx) {
            new Chart(lineCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
                    datasets: [{
                        label: 'Project Yield',
                        data: [20, 35, 25, 45, 40, 60],
                        borderColor: '#94a3b8', /* Minimal Slate */
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4 /* Smooth curve */
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { 
                        y: { display: false, beginAtZero: true }, 
                        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: {size: 11} } } 
                    },
                    plugins: { legend: { display: false } },
                    elements: { point: { radius: 0, hitRadius: 10, hoverRadius: 4 } }
                }
            });
        }
    } catch(e) {}
});
