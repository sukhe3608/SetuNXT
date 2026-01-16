/**
 * Dashboard Module for SetuNXT
 * Handles all dashboard charts and interactions with Bootstrap tab integration
 */

class Dashboard {
    constructor() {
        this.charts = {};
        this.filters = {
            dateRange: '30',
            campaignStatus: 'all'
        };
        this.activeTab = 'overview';
    }

    init() {
        this.initializeCharts();
        this.initializeEventListeners();
        this.updateTime();
        this.setupTabListeners();
    }

    setupTabListeners() {
        // Listen for Bootstrap tab change events
        const tabEls = document.querySelectorAll('#dashboardTabs button[data-bs-toggle="tab"]');
        tabEls.forEach(tabEl => {
            tabEl.addEventListener('shown.bs.tab', (event) => {
                const targetId = event.target.getAttribute('data-bs-target');
                this.activeTab = targetId.replace('#', '').replace('-tab', '');
                this.initializeTabCharts(this.activeTab);
                
                // Update URL hash for bookmarking
                window.location.hash = `tab=${this.activeTab}`;
            });
        });

        // Check URL hash for tab on load
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const tabFromHash = hashParams.get('tab');
        if (tabFromHash && ['overview', 'campaigns', 'analytics'].includes(tabFromHash)) {
            const tabButton = document.querySelector(`#dashboardTabs button[data-bs-target="#${tabFromHash}-tab"]`);
            if (tabButton) {
                const tab = new bootstrap.Tab(tabButton);
                tab.show();
            }
        }
    }

    initializeCharts() {
        // Initialize all charts that are always visible
        this.charts.hourly = this.createHourlyChart();
        this.charts.weekly = this.createWeeklyChart();
        this.charts.campaigns = this.createCampaignsChart();
        this.charts.region = this.createRegionChart();
        this.charts.device = this.createDeviceChart();
    }

    initializeTabCharts(tabId) {
        // Lazy initialize charts for specific tabs
        switch(tabId) {
            case 'campaigns':
                if (!this.charts.campaignRoi) {
                    this.charts.campaignRoi = this.createCampaignRoiChart();
                    this.charts.campaignCtr = this.createCampaignCtrChart();
                }
                break;
            case 'analytics':
                if (!this.charts.analyticsRegion) {
                    this.charts.analyticsRegion = this.createAnalyticsRegionChart();
                    this.charts.analyticsDevice = this.createAnalyticsDeviceChart();
                    this.charts.analyticsWeekly = this.createAnalyticsWeeklyChart();
                }
                break;
        }
    }

    initializeEventListeners() {
        // Date range selector
        const dateRangeSelect = document.getElementById('dateRange');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.filters.dateRange = e.target.value;
                this.updateDashboardData();
            });
        }

        // Campaign status filter buttons
        document.querySelectorAll('.campaign-filters [data-filter]').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterCampaigns(filter);
                
                // Update active button state
                document.querySelectorAll('.campaign-filters [data-filter]').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDashboardData());
        }

        // Add credits button
        const addCreditsBtn = document.querySelector('.credits-left .btn');
        if (addCreditsBtn) {
            addCreditsBtn.addEventListener('click', () => {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Redirecting to credits page...', 'info');
                }
            });
        }

        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
        
        // Handle window resize for chart responsiveness
        window.addEventListener('resize', this.debounce(() => {
            this.resizeCharts();
        }, 250));
    }

    // Chart creation methods
    createHourlyChart() {
        const ctx = document.getElementById('hourlyChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
                datasets: [
                    {
                        label: 'Sent',
                        data: [120000, 145000, 185100, 165000, 142000, 158000, 178000, 210000, 135000],
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Delivered',
                        data: [114000, 138000, 175800, 156000, 135000, 150000, 169000, 199000, 128000],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Read',
                        data: [91200, 110400, 140600, 124800, 108000, 120000, 135200, 159200, 102400],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                                if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                                return value;
                            },
                            maxTicksLimit: 6,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    createWeeklyChart() {
        const ctx = document.getElementById('weeklyChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Messages',
                        data: [520000, 480000, 550000, 590000, 610000, 430000, 380000],
                        backgroundColor: '#4361ee',
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'Engagement %',
                        data: [68, 72, 75, 78, 82, 65, 60],
                        backgroundColor: '#8b5cf6',
                        borderRadius: 6,
                        borderSkipped: false,
                        type: 'line',
                        fill: false,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        pointRadius: window.innerWidth < 768 ? 3 : 5,
                        pointBackgroundColor: '#8b5cf6',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                                if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                                return value;
                            },
                            maxTicksLimit: 6,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            maxTicksLimit: 6,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    createCampaignsChart() {
        const ctx = document.getElementById('campaignsChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Black Friday', 'Product Launch', 'Holiday Flash Sale', 'New Year Promo', 'Loyalty Rewards'],
                datasets: [
                    {
                        label: 'ROI',
                        data: [342, 285, 267, 234, 198],
                        backgroundColor: ['#10b981', '#4361ee', '#8b5cf6', '#f59e0b', '#ef4444'],
                        borderRadius: 6,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '+' + value + '%';
                            },
                            maxTicksLimit: 6,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    createRegionChart() {
        const ctx = document.getElementById('regionChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['North America', 'Asia Pacific', 'Europe', 'Latin America'],
                datasets: [{
                    data: [45, 18, 28, 9],
                    backgroundColor: [
                        '#4361ee',
                        '#10b981',
                        '#8b5cf6',
                        '#f59e0b'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    }

    createDeviceChart() {
        const ctx = document.getElementById('deviceChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Android 14', 'Android 13', 'Android 12', 'Android 11', 'Other'],
                datasets: [{
                    label: 'Distribution (%)',
                    data: [38, 25, 18, 12, 7],
                    backgroundColor: [
                        '#4361ee',
                        '#10b981',
                        '#8b5cf6',
                        '#f59e0b',
                        '#64748b'
                    ],
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            maxTicksLimit: 5,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    createCampaignRoiChart() {
        const ctx = document.getElementById('campaignRoiChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Black Friday', 'Product Launch', 'Holiday Flash Sale', 'New Year Promo', 'Loyalty Rewards'],
                datasets: [
                    {
                        label: 'ROI (%)',
                        data: [342, 285, 267, 234, 198],
                        backgroundColor: ['#10b981', '#4361ee', '#8b5cf6', '#f59e0b', '#ef4444'],
                        borderRadius: 6,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '+' + value + '%';
                            },
                            maxTicksLimit: 6,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    createCampaignCtrChart() {
        const ctx = document.getElementById('campaignCtrChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Black Friday', 'Product Launch', 'Holiday Flash Sale', 'New Year Promo', 'Loyalty Rewards'],
                datasets: [
                    {
                        label: 'CTR (%)',
                        data: [20.0, 20.0, 19.0, 20.0, 20.0],
                        backgroundColor: '#8b5cf6',
                        borderRadius: 6,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 25,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            maxTicksLimit: 6,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    createAnalyticsRegionChart() {
        const ctx = document.getElementById('analyticsRegionChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['North America', 'Asia Pacific', 'Europe', 'Latin America'],
                datasets: [{
                    data: [45, 18, 28, 9],
                    backgroundColor: [
                        '#4361ee',
                        '#10b981',
                        '#8b5cf6',
                        '#f59e0b'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    }

    createAnalyticsDeviceChart() {
        const ctx = document.getElementById('analyticsDeviceChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Android 14', 'Android 13', 'Android 12', 'Android 11', 'Other'],
                datasets: [{
                    label: 'Distribution (%)',
                    data: [38, 25, 18, 12, 7],
                    backgroundColor: [
                        '#4361ee',
                        '#10b981',
                        '#8b5cf6',
                        '#f59e0b',
                        '#64748b'
                    ],
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            maxTicksLimit: 5,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    createAnalyticsWeeklyChart() {
        const ctx = document.getElementById('analyticsWeeklyChart')?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Engagement Rate',
                        data: [68, 72, 75, 78, 82, 65, 60],
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Click Rate',
                        data: [15, 18, 22, 24, 26, 14, 12],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Reply Rate',
                        data: [8, 10, 12, 14, 16, 7, 6],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            maxTicksLimit: 6,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    resizeCharts() {
        // Resize all charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
                // Update font sizes based on screen width
                if (chart.options.plugins?.legend?.labels) {
                    chart.options.plugins.legend.labels.font.size = window.innerWidth < 768 ? 10 : 12;
                }
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.ticks) {
                            scale.ticks.font.size = window.innerWidth < 768 ? 10 : 12;
                        }
                    });
                }
                chart.update();
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    filterCampaigns(status) {
        const rows = document.querySelectorAll('#campaignTable tbody tr');
        rows.forEach(row => {
            if (status === 'all' || row.dataset.status === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    updateDashboardData() {
        // Show loading state
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.updateMetrics();
            
            if (typeof window.showNotification === 'function') {
                window.showNotification('Dashboard data updated', 'success');
            }
        }, 500);
    }

    updateMetrics() {
        // Update metrics based on selected date range
        const dateRange = this.filters.dateRange;
        const multiplier = dateRange === '7' ? 0.25 : dateRange === '90' ? 3 : 1;
        
        // Update metric values
        const metrics = {
            'Total Sent': `${(2.4 * multiplier).toFixed(1)}M`,
            'Delivered': `${(2.28 * multiplier).toFixed(2)}M`,
            'Read': `${(1.82 * multiplier).toFixed(2)}M`,
            'Failed': `${(12.4 * multiplier).toFixed(1)}K`,
            'Read Rate': '79.8%',
            'Replies': `${(284 * multiplier).toFixed(0)}K`,
            'Total Spend': `$${(48.2 * multiplier).toFixed(1)}K`,
            'Delivery Rate': '95.2%'
        };
        
        // Update DOM
        Object.entries(metrics).forEach(([title, value]) => {
            const metricCard = Array.from(document.querySelectorAll('.metric-card'))
                .find(card => card.querySelector('.metric-title').textContent === title);
            
            if (metricCard) {
                metricCard.querySelector('.metric-value').textContent = value;
            }
        });
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Update any time displays if present
        const timeElements = document.querySelectorAll('[data-time-update]');
        timeElements.forEach(element => {
            element.textContent = timeString;
        });
    }

    showLoading() {
        const overlay = document.createElement('div');
        overlay.className = 'dashboard-loading';
        overlay.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Updating dashboard data...</p>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
        `;
        document.body.appendChild(overlay);
    }

    hideLoading() {
        const loadingOverlay = document.querySelector('.dashboard-loading');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    exportDashboardData() {
        // Determine which tab is active and export appropriate data
        let csvContent = '';
        let filename = '';
        
        switch(this.activeTab) {
            case 'campaigns':
                csvContent = this.exportCampaignsData();
                filename = `campaigns-${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'analytics':
                csvContent = this.exportAnalyticsData();
                filename = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'overview':
            default:
                csvContent = this.exportOverviewData();
                filename = `dashboard-${new Date().toISOString().split('T')[0]}.csv`;
                break;
        }
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show notification
        if (typeof window.showNotification === 'function') {
            window.showNotification('Dashboard data exported successfully', 'success');
        }
    }

    exportCampaignsData() {
        let csvContent = "Campaign,Status,Sent,Delivered,Read,Clicked,CTR,Region,Timeline\n";
        
        document.querySelectorAll('#campaignTable tbody tr').forEach(row => {
            if (row.style.display !== 'none') {
                const cells = row.querySelectorAll('td');
                const rowData = Array.from(cells).map(cell => {
                    if (cell.querySelector('.badge')) {
                        return cell.querySelector('.badge').textContent;
                    }
                    return `"${cell.textContent}"`;
                }).join(',');
                csvContent += rowData + "\n";
            }
        });
        
        return csvContent;
    }

    exportOverviewData() {
        let csvContent = "Metric,Value,Change\n";
        
        document.querySelectorAll('.metric-card').forEach(card => {
            const title = card.querySelector('.metric-title').textContent;
            const value = card.querySelector('.metric-value').textContent;
            const change = card.querySelector('.metric-change').textContent;
            csvContent += `"${title}","${value}","${change}"\n`;
        });
        
        return csvContent;
    }

    exportAnalyticsData() {
        let csvContent = "Metric,Value\n";
        
        // Export engagement metrics
        document.querySelectorAll('.engagement-card').forEach(card => {
            const title = card.querySelector('.engagement-title').textContent;
            const value = card.querySelector('.engagement-value').textContent;
            csvContent += `"${title}","${value}"\n`;
        });
        
        // Export interaction types
        document.querySelectorAll('.interaction-item').forEach(item => {
            const spans = item.querySelectorAll('span');
            if (spans.length === 2) {
                csvContent += `"${spans[0].textContent}","${spans[1].textContent}"\n`;
            }
        });
        
        return csvContent;
    }
}

// Make Dashboard available globally
if (typeof window !== 'undefined') {
    window.Dashboard = Dashboard;
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.dashboard) {
            window.dashboard = new Dashboard();
            window.dashboard.init();
        }
    });
} else {
    if (!window.dashboard) {
        window.dashboard = new Dashboard();
        window.dashboard.init();
    }
}