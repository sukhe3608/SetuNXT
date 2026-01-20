class Dashboard {
    constructor() {
        this.charts = {};
        this.filters = {
            dateRange: '30',
            campaignStatus: 'all'
        };
        this.activeTab = 'overview';
        this.modal = null;
    }

    init() {
        this.initializeCharts();
        this.initializeEventListeners();
        this.updateTime();
        this.setupTabListeners();
        this.setupCampaignTableClickHandlers();
        this.initializeModal();
    }

    initializeModal() {
        // Get modal element
        const modalElement = document.getElementById('campaignDetailsModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
            
            // Setup close button
            this.setupCloseButton();
            
            // Clean up event listeners on modal hide
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.cleanupModalEventListeners();
            });
        }
    }

    setupCloseButton() {
        const closeBtn = document.querySelector('#campaignDetailsModal .btn-close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                if (this.modal) {
                    this.modal.hide();
                }
            };
        }
        
        // Also handle the X icon in modal header
        const modalCloseIcon = document.querySelector('#campaignDetailsModal .modal-header .btn-close');
        if (modalCloseIcon) {
            modalCloseIcon.onclick = () => {
                if (this.modal) {
                    this.modal.hide();
                }
            };
        }
    }

    setupTabListeners() {
        const tabEls = document.querySelectorAll('#dashboardTabs button[data-bs-toggle="tab"]');
        tabEls.forEach(tabEl => {
            tabEl.addEventListener('shown.bs.tab', (event) => {
                const targetId = event.target.getAttribute('data-bs-target');
                this.activeTab = targetId.replace('#', '').replace('-tab', '');
                this.initializeTabCharts(this.activeTab);
                
                window.location.hash = `tab=${this.activeTab}`;
            });
        });

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
        this.charts.hourly = this.createHourlyChart();
        this.charts.weekly = this.createWeeklyChart();
        this.charts.campaigns = this.createCampaignsChart();
        this.charts.region = this.createRegionChart();
        this.charts.device = this.createDeviceChart();
    }

    initializeTabCharts(tabId) {
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
        const dateRangeSelect = document.getElementById('dateRange');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.filters.dateRange = e.target.value;
                this.updateDashboardData();
            });
        }

        document.querySelectorAll('.campaign-filters [data-filter]').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterCampaigns(filter);
                
                document.querySelectorAll('.campaign-filters [data-filter]').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });

        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDashboardData());
        }

        const addCreditsBtn = document.querySelector('.credits-left .btn');
        if (addCreditsBtn) {
            addCreditsBtn.addEventListener('click', () => {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Redirecting to credits page...', 'info');
                }
            });
        }

        setInterval(() => this.updateTime(), 60000);
        
        window.addEventListener('resize', this.debounce(() => {
            this.resizeCharts();
        }, 250));

        this.setupCampaignTableClickHandlers();
    }

    setupCampaignTableClickHandlers() {
        const table = document.getElementById('campaignTable');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.cursor = 'pointer';
            
            row.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                    return;
                }
                this.showCampaignDetails(row);
            });

            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
            });

            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    }

    showCampaignDetails(row) {
        const cells = row.querySelectorAll('td');
        const campaignData = {
            name: cells[0].textContent.trim(),
            status: cells[1].querySelector('.badge').textContent.trim(),
            statusClass: cells[1].querySelector('.badge').className,
            sent: cells[2].textContent.trim(),
            delivered: cells[3].textContent.trim(),
            read: cells[4].textContent.trim(),
            clicked: cells[5].textContent.trim(),
            ctr: cells[6].textContent.trim(),
            region: cells[7].textContent.trim(),
            timeline: cells[8].textContent.trim()
        };

        this.populateModal(campaignData);
        
        if (this.modal) {
            this.modal.show();
        }
    }

    populateModal(data) {
        // Parse numbers for calculations
        const sentNum = this.parseNumber(data.sent);
        const deliveredNum = this.parseNumber(data.delivered);
        const readNum = this.parseNumber(data.read);
        const clickedNum = this.parseNumber(data.clicked);

        // Calculate metrics
        const deliveryRate = deliveredNum > 0 ? (deliveredNum / sentNum * 100).toFixed(1) : '0';
        const readRate = readNum > 0 ? (readNum / deliveredNum * 100).toFixed(1) : '0';
        const replyRate = clickedNum > 0 ? (clickedNum / readNum * 100).toFixed(1) : '0';
        const ctr = parseFloat(data.ctr) || 0;
        
        // Engagement score calculation
        const engagementScore = Math.min(100, 
            (parseFloat(deliveryRate) * 0.25 + 
             parseFloat(readRate) * 0.35 + 
             ctr * 0.4)
        ).toFixed(0);

        // ROI based on campaign
        const roiMap = {
            'Black Friday': 342,
            'Product Launch': 285,
            'Holiday Flash Sale': 267,
            'New Year Promo': 234,
            'Loyalty Rewards': 198
        };
        const roi = roiMap[data.name] || 200;
        const budgetUtilization = 75 + Math.floor(Math.random() * 20);

        // Get additional info
        const additionalInfo = this.getCampaignAdditionalInfo(data.name);

        // Update modal content
        document.getElementById('campaignModalTitle').textContent = data.name;
        document.getElementById('campaignModalStatus').textContent = data.status;
        document.getElementById('campaignModalStatus').className = `campaign-status-badge badge ${data.statusClass}`;
        document.getElementById('campaignModalRegion').textContent = data.region;
        document.getElementById('campaignModalTimeline').textContent = data.timeline;
        
        // Update stats
        document.getElementById('campaignModalSent').textContent = data.sent;
        document.getElementById('campaignModalDelivered').textContent = data.delivered;
        document.getElementById('campaignModalRead').textContent = data.read;
        document.getElementById('campaignModalClicked').textContent = data.clicked;
        
        // Update metrics
        document.getElementById('campaignModalCTR').textContent = data.ctr;
        document.getElementById('campaignModalDeliveryRate').textContent = deliveryRate + '%';
        document.getElementById('campaignModalReadRate').textContent = readRate + '%';
        document.getElementById('campaignModalReplyRate').textContent = replyRate + '%';
        
        // Update progress bars
        document.getElementById('campaignModalEngagementScore').textContent = engagementScore + '%';
        document.getElementById('campaignModalROI').textContent = roi + '%';
        document.getElementById('campaignModalBudgetUtilization').textContent = budgetUtilization + '%';
        
        // Animate progress bars
        this.animateProgressBar('engagementProgress', engagementScore);
        this.animateProgressBar('roiProgress', Math.min(100, roi / 4));
        this.animateProgressBar('budgetProgress', budgetUtilization);
        
        // Update additional info
        document.getElementById('campaignModalAudience').textContent = additionalInfo.audience;
        document.getElementById('campaignModalMessageType').textContent = additionalInfo.messageType;
        document.getElementById('campaignModalType').textContent = additionalInfo.type;
        document.getElementById('campaignModalCreatedBy').textContent = additionalInfo.createdBy;
        document.getElementById('campaignModalDescription').textContent = additionalInfo.description;
        
        // Setup action buttons
        this.setupModalActions(data.name);
    }

    animateProgressBar(progressBarId, percentage) {
        const progressBar = document.getElementById(progressBarId);
        if (progressBar) {
            // Reset width to 0
            progressBar.style.width = '0%';
            
            // Trigger reflow
            progressBar.offsetHeight;
            
            // Animate to target percentage
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
            }, 50);
        }
    }

    setupModalActions(campaignName) {
        const reportBtn = document.getElementById('campaignModalReportBtn');
        const closeBtn = document.querySelector('#campaignDetailsModal .btn-close-modal');

        // Remove existing listeners
        const newReportBtn = reportBtn.cloneNode(true);
        const newCloseBtn = closeBtn.cloneNode(true);
        
        reportBtn.parentNode.replaceChild(newReportBtn, reportBtn);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

        // Add new listeners
        newReportBtn.addEventListener('click', () => {
            if (typeof window.showNotification === 'function') {
                window.showNotification(`Generating report for: ${campaignName}`, 'info');
            }
            this.exportCampaignReport(campaignName);
        });

        newCloseBtn.addEventListener('click', () => {
            if (this.modal) {
                this.modal.hide();
            }
        });

        // Setup close button again
        this.setupCloseButton();
    }

    cleanupModalEventListeners() {
        // Clean up any remaining event listeners
        const reportBtn = document.getElementById('campaignModalReportBtn');
        const closeBtn = document.querySelector('#campaignDetailsModal .btn-close-modal');
        
        if (reportBtn) reportBtn.onclick = null;
        if (closeBtn) closeBtn.onclick = null;
    }

    parseNumber(str) {
        const num = parseFloat(str);
        if (str.includes('K')) return num * 1000;
        if (str.includes('M')) return num * 1000000;
        if (str.includes('%')) return num;
        return num;
    }

    getCampaignAdditionalInfo(campaignName) {
        const info = {
            'Holiday Flash Sale': {
                audience: '18-45 years, Urban Areas',
                messageType: 'Rich Media Template',
                type: 'Promotional',
                createdBy: 'John Doe',
                description: 'Special holiday promotion offering exclusive discounts on selected products.'
            },
            'New Year Promo': {
                audience: 'All Users',
                messageType: 'Interactive Carousel',
                type: 'Seasonal',
                createdBy: 'Sarah Johnson',
                description: 'New Year celebration campaign with special offers and greetings.'
            },
            'Product Launch': {
                audience: 'Tech Enthusiasts',
                messageType: 'Product Catalog',
                type: 'Announcement',
                createdBy: 'Michael Chen',
                description: 'Launch campaign for new product line with early-bird pricing.'
            },
            'Black Friday': {
                audience: 'All Customers',
                messageType: 'Flash Sale Template',
                type: 'Sales',
                createdBy: 'Emily Wilson',
                description: 'Black Friday mega sale with doorbuster deals and bundle discounts.'
            },
            'Loyalty Rewards': {
                audience: 'Loyal Customers',
                messageType: 'Rewards Card',
                type: 'Retention',
                createdBy: 'David Brown',
                description: 'Loyalty program campaign rewarding repeat customers with exclusive benefits.'
            }
        };

        return info[campaignName] || {
            audience: 'General Audience',
            messageType: 'Standard Template',
            type: 'Marketing',
            createdBy: 'System',
            description: 'Marketing campaign with standard messaging and targeting.'
        };
    }

    exportCampaignReport(campaignName) {
        const csvContent = `Campaign Performance Report

Campaign:,${campaignName}
Report Generated:,${new Date().toLocaleString()}

Metric,Value
Status,Active
Region,North America
Timeline,Current

This is a sample report for ${campaignName}.
Full report functionality can be implemented as needed.`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${campaignName.replace(/\s+/g, '-')}-report.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        if (typeof window.showNotification === 'function') {
            window.showNotification('Campaign report downloaded', 'success');
        }
    }

    // Rest of the original methods remain exactly the same as before...
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
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
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
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            this.updateMetrics();
            
            if (typeof window.showNotification === 'function') {
                window.showNotification('Dashboard data updated', 'success');
            }
        }, 500);
    }

    updateMetrics() {
        const dateRange = this.filters.dateRange;
        const multiplier = dateRange === '7' ? 0.25 : dateRange === '90' ? 3 : 1;
        
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
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
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
        
        document.querySelectorAll('.engagement-card').forEach(card => {
            const title = card.querySelector('.engagement-title').textContent;
            const value = card.querySelector('.engagement-value').textContent;
            csvContent += `"${title}","${value}"\n`;
        });
        
        document.querySelectorAll('.interaction-item').forEach(item => {
            const spans = item.querySelectorAll('span');
            if (spans.length === 2) {
                csvContent += `"${spans[0].textContent}","${spans[1].textContent}"\n`;
            }
        });
        
        return csvContent;
    }
}

if (typeof window !== 'undefined') {
    window.Dashboard = Dashboard;
}

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