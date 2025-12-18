
class RCSApp {
    constructor() {
        this.contactsData = []; // Store contacts data
        this.init();
    }

    init() {
        
        // Initialize all components
        this.initCharacterCounter();
        this.initFileUpload();
        this.initTabSwitching();
        this.initNumberInput();
        this.initFormValidation();
        this.initPreviewUpdates();
        this.initKeyboardShortcuts();
        this.initResponsive();
        this.initContactsTable(); 
        
        this.loadDraft();
        this.updatePreviewTime();
        
        // Show welcome notification
        setTimeout(() => {
            this.showNotification('Welcome to SetuNXT RCS Messaging!', 'info');
        }, 1000);
    }

    initCharacterCounter() {
        const messageTextarea = document.getElementById('messageContent');
        const charCounter = document.getElementById('charCounter');
        
        if (messageTextarea && charCounter) {
            const updateCount = () => {
                const count = messageTextarea.value.length;
                charCounter.textContent = `${count} characters`;
                
                if (count > 1000) {
                    charCounter.style.color = '#ef4444';
                    charCounter.innerHTML = `${count} characters <span style="color: #ef4444;">(Limit exceeded)</span>`;
                } else if (count > 800) {
                    charCounter.style.color = '#f59e0b';
                } else {
                    charCounter.style.color = '#64748b';
                }
            };
            
            messageTextarea.addEventListener('input', updateCount);
            updateCount();
        }
    }

    initFileUpload() {
        const imageUpload = document.getElementById('imageUpload');
        const imageInput = document.getElementById('imageInput');
        
        if (imageUpload && imageInput) {
            imageUpload.addEventListener('click', (e) => {
                e.stopPropagation();
                imageInput.click();
            });
            
            imageInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    this.handleImageUpload(file);
                }
            });
            
            // Drag and drop
            imageUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                imageUpload.style.borderColor = '#4f46e5';
                imageUpload.style.background = '#f8fafc';
            });
            
            imageUpload.addEventListener('dragleave', () => {
                imageUpload.style.borderColor = '';
                imageUpload.style.background = '';
            });
            
            imageUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                imageUpload.style.borderColor = '';
                imageUpload.style.background = '';
                
                if (e.dataTransfer.files.length > 0) {
                    imageInput.files = e.dataTransfer.files;
                    imageInput.dispatchEvent(new Event('change'));
                }
            });
        }
    }

    handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'warning');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Image size must be less than 5MB', 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUpload = document.getElementById('imageUpload');
            imageUpload.innerHTML = `
                <i class="fas fa-check-circle" style="color: #10b981;"></i>
                <div style="text-align: center;">
                    <div style="font-weight: 500; color: #1e293b;">${file.name}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">
                        ${(file.size / 1024).toFixed(0)} KB • Click to change
                    </div>
                </div>
                <input type="file" accept="image/*" hidden>
            `;
            
            // Re-attach events
            const newInput = imageUpload.querySelector('input[type="file"]');
            imageUpload.addEventListener('click', () => newInput.click());
            
            this.showNotification('Image uploaded successfully', 'success');
        };
        reader.readAsDataURL(file);
    }

    initTabSwitching() {
        const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
        tabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                const tabId = event.target.id.replace('-tab', '');
                
                // Initialize the selected tab
                switch(tabId) {
                    case 'numbers':
                        this.initNumberInput();
                        break;
                    case 'file':
                        this.initFileTab();
                        break;
                    case 'contacts':
                        this.initContactsTable();
                        break;
                }
                
                this.updateRecipientCount();
            });
        });
        
        // Also handle click events for the old data-tab elements if they exist
        const oldTabs = document.querySelectorAll('[data-tab]');
        oldTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Update active tab using Bootstrap's tab system
        const tabTrigger = document.querySelector(`#${tabId}-tab`);
        if (tabTrigger) {
            const tab = new bootstrap.Tab(tabTrigger);
            tab.show();
        }
        
        // Initialize the selected tab
        switch(tabId) {
            case 'numbers':
                this.initNumberInput();
                break;
            case 'file':
                this.initFileTab();
                break;
            case 'contacts':
                this.initContactsTable();
                break;
        }
        
        this.updateRecipientCount();
    }

    initNumberInput() {
        const phoneNumbers = document.getElementById('phoneNumbers');
        const clearNumbersBtn = document.getElementById('clearNumbersBtn');
        
        if (phoneNumbers) {
            phoneNumbers.addEventListener('input', () => {
                this.updateRecipientCount();
            });
            
            // Format numbers
            phoneNumbers.addEventListener('blur', () => {
                const lines = phoneNumbers.value.split('\n');
                const formatted = lines.map(line => {
                    let num = line.trim().replace(/[^\d+]/g, '');
                    if (num && !num.startsWith('+')) {
                        num = '+91' + num;
                    }
                    return num;
                }).filter(n => n.length > 0);
                
                phoneNumbers.value = formatted.join('\n');
                this.updateRecipientCount();
            });
        }
        
        if (clearNumbersBtn) {
            clearNumbersBtn.addEventListener('click', () => {
                if (confirm('Clear all phone numbers?')) {
                    if (phoneNumbers) phoneNumbers.value = '';
                    this.updateRecipientCount();
                    this.showNotification('All numbers cleared', 'info');
                }
            });
        }
    }

    initFileTab() {
        const fileUpload = document.getElementById('contactFileUpload');
        const fileInput = document.getElementById('contactFileInput');
        
        if (fileUpload && fileInput) {
            fileUpload.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleContactFile(e.target.files[0]);
                }
            });
        }
    }

    handleContactFile(file) {
        const validTypes = ['.csv', '.txt', '.xlsx', '.xls'];
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validTypes.includes(extension)) {
            this.showNotification('Invalid file type. Please upload CSV, TXT, or Excel files.', 'warning');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('File size must be less than 10MB', 'warning');
            return;
        }
        
        // Simulate file processing
        const fileUpload = document.getElementById('contactFileUpload');
        fileUpload.innerHTML = `
            <div class="file-processing">
                <div class="spinner"></div>
                <div style="text-align: center;">
                    <div style="font-weight: 500; color: #1e293b;">Processing ${file.name}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">Please wait...</div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const contactCount = Math.floor(Math.random() * 1000) + 500;
            fileUpload.innerHTML = `
                <i class="fas fa-check-circle" style="color: #10b981;"></i>
                <div style="text-align: center;">
                    <div style="font-weight: 500; color: #1e293b;">${file.name}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${contactCount} contacts imported</div>
                </div>
            `;
            
            this.updateRecipientCount(contactCount);
            this.showNotification(`${contactCount} contacts imported successfully`, 'success');
        }, 1500);
    }

    initContactsTable() {
        this.loadContactsTable();
        this.initContactsTableEvents();
    }

    loadContactsTable() {
        const contacts = [
            {
                id: 1,
                name: "Rahul Sharma",
                phone: "+919876543210",
                group: "VIP Customers",
                lastContact: "2024-01-15",
                status: "Active",
                selected: false
            },
            {
                id: 2,
                name: "Priya Patel",
                phone: "+919876543211",
                group: "Regular Customers",
                lastContact: "2024-01-14",
                status: "Active",
                selected: false
            },
            {
                id: 3,
                name: "Amit Kumar",
                phone: "+919876543212",
                group: "New Leads",
                lastContact: "2024-01-10",
                status: "Pending",
                selected: false
            },
            {
                id: 4,
                name: "Sneha Gupta",
                phone: "+919876543213",
                group: "VIP Customers",
                lastContact: "2024-01-12",
                status: "Active",
                selected: false
            },
            {
                id: 5,
                name: "Rajesh Singh",
                phone: "+919876543214",
                group: "Inactive",
                lastContact: "2023-12-20",
                status: "Inactive",
                selected: false
            },
            {
                id: 6,
                name: "Meera Reddy",
                phone: "+919876543215",
                group: "Regular Customers",
                lastContact: "2024-01-13",
                status: "Active",
                selected: false
            },
            {
                id: 7,
                name: "Vikram Joshi",
                phone: "+919876543216",
                group: "New Leads",
                lastContact: "2024-01-09",
                status: "Pending",
                selected: false
            },
            {
                id: 8,
                name: "Anjali Desai",
                phone: "+919876543217",
                group: "VIP Customers",
                lastContact: "2024-01-11",
                status: "Active",
                selected: false
            },
            {
                id: 9,
                name: "Suresh Nair",
                phone: "+919876543218",
                group: "Regular Customers",
                lastContact: "2024-01-08",
                status: "Active",
                selected: false
            },
            {
                id: 10,
                name: "Pooja Mehta",
                phone: "+919876543219",
                group: "New Leads",
                lastContact: "2024-01-07",
                status: "Pending",
                selected: false
            }
        ];

        const tableBody = document.getElementById('contactsTableBody');
        if (!tableBody) return;

        // Save contacts to class property for later use
        this.contactsData = contacts;

        tableBody.innerHTML = contacts.map(contact => `
            <tr data-id="${contact.id}" class="${contact.selected ? 'table-selected' : ''}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input contact-checkbox" type="checkbox" 
                               data-id="${contact.id}" ${contact.selected ? 'checked' : ''}>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                             style="width: 32px; height: 32px;">
                            ${contact.name.charAt(0)}
                        </div>
                        <span class="fw-medium">${contact.name}</span>
                    </div>
                </td>
                <td class="font-monospace">${contact.phone}</td>
                <td>
                    <span class="badge bg-light text-dark border">${contact.group}</span>
                </td>
                <td>
                    <span class="text-muted">${contact.lastContact}</span>
                </td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(contact.status)}">
                        ${contact.status}
                    </span>
                </td>
            </tr>
        `).join('');

        this.updateContactsSelectedCount();
    }

    getStatusBadgeClass(status) {
        switch(status) {
            case 'Active': return 'bg-success';
            case 'Pending': return 'bg-warning text-dark';
            case 'Inactive': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    }

    initContactsTableEvents() {
        const tableBody = document.getElementById('contactsTableBody');
        const selectAllCheckbox = document.getElementById('selectAllContacts');
        const contactSearch = document.getElementById('contactSearch');
        const importContactsBtn = document.getElementById('importContactsBtn');
        const refreshContactsBtn = document.getElementById('refreshContactsBtn');

        // Select all checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.contact-checkbox');
                checkboxes.forEach(cb => {
                    cb.checked = e.target.checked;
                    const contactId = parseInt(cb.getAttribute('data-id'));
                    this.toggleContactSelection(contactId, e.target.checked);
                });
                this.updateContactsSelectedCount();
                this.updateRecipientCount();
                
                // Update row styling
                const rows = document.querySelectorAll('#contactsTableBody tr');
                rows.forEach(row => {
                    row.classList.toggle('table-selected', e.target.checked);
                });
            });
        }

        // Individual contact checkboxes
        if (tableBody) {
            tableBody.addEventListener('change', (e) => {
                if (e.target.classList.contains('contact-checkbox')) {
                    const contactId = parseInt(e.target.getAttribute('data-id'));
                    const isChecked = e.target.checked;
                    this.toggleContactSelection(contactId, isChecked);
                    
                    // Update row styling
                    const row = e.target.closest('tr');
                    if (row) {
                        row.classList.toggle('table-selected', isChecked);
                    }
                    
                    // Update "Select All" checkbox state
                    this.updateSelectAllCheckbox();
                    this.updateContactsSelectedCount();
                    this.updateRecipientCount();
                }
            });
            
            // Add click event to select row when clicking anywhere on it
            tableBody.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const checkbox = row ? row.querySelector('.contact-checkbox') : null;
                
                if (row && checkbox && !e.target.matches('input, button, a, .btn, .badge')) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        }

        // Search functionality
        if (contactSearch) {
            contactSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('#contactsTableBody tr');
                
                rows.forEach(row => {
                    const name = row.cells[1].textContent.toLowerCase();
                    const phone = row.cells[2].textContent.toLowerCase();
                    const group = row.cells[3].textContent.toLowerCase();
                    
                    if (name.includes(searchTerm) || phone.includes(searchTerm) || group.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }

        // Import contacts button
        if (importContactsBtn) {
            importContactsBtn.addEventListener('click', () => {
                this.importContacts();
            });
        }

        // Refresh button
        if (refreshContactsBtn) {
            refreshContactsBtn.addEventListener('click', () => {
                this.refreshContacts();
            });
        }
    }

    toggleContactSelection(contactId, isSelected) {
        if (!this.contactsData) return;
        
        const contact = this.contactsData.find(c => c.id === contactId);
        if (contact) {
            contact.selected = isSelected;
        }
    }

    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllContacts');
        if (!selectAllCheckbox) return;
        
        const checkboxes = document.querySelectorAll('.contact-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        const someChecked = Array.from(checkboxes).some(cb => cb.checked);
        
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }

    updateContactsSelectedCount() {
        const countElement = document.getElementById('contactsSelectedCount');
        if (!countElement) return;
        
        const selectedCount = document.querySelectorAll('.contact-checkbox:checked').length;
        countElement.textContent = `${selectedCount} contact${selectedCount !== 1 ? 's' : ''} selected`;
    }

    importContacts() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv,.xlsx,.xls,.txt';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                this.handleContactFileUpload(file);
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    handleContactFileUpload(file) {
        const validTypes = ['.csv', '.txt', '.xlsx', '.xls'];
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validTypes.includes(extension)) {
            this.showNotification('Invalid file type. Please upload CSV, TXT, or Excel files.', 'warning');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('File size must be less than 10MB', 'warning');
            return;
        }
        
        // Show loading state
        const importBtn = document.getElementById('importContactsBtn');
        const originalHTML = importBtn.innerHTML;
        importBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Importing...';
        importBtn.disabled = true;
        
        // Simulate file processing
        setTimeout(() => {
            // Add new contacts to the table (simulated)
            const newContacts = [
                {
                    id: this.contactsData.length + 1,
                    name: "New Contact 1",
                    phone: "+919876543220",
                    group: "Imported",
                    lastContact: new Date().toISOString().split('T')[0],
                    status: "Active",
                    selected: false
                },
                {
                    id: this.contactsData.length + 2,
                    name: "New Contact 2",
                    phone: "+919876543221",
                    group: "Imported",
                    lastContact: new Date().toISOString().split('T')[0],
                    status: "Active",
                    selected: false
                }
            ];
            
            this.contactsData.push(...newContacts);
            this.loadContactsTable();
            
            // Restore button
            importBtn.innerHTML = originalHTML;
            importBtn.disabled = false;
            
            this.showNotification(`Successfully imported ${newContacts.length} contacts`, 'success');
        }, 1500);
    }

    refreshContacts() {
        const refreshBtn = document.getElementById('refreshContactsBtn');
        if (refreshBtn) {
            const originalHTML = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
            refreshBtn.disabled = true;
            
            setTimeout(() => {
                // Reload contacts (in real app, this would fetch from API)
                this.loadContactsTable();
                refreshBtn.innerHTML = originalHTML;
                refreshBtn.disabled = false;
                this.showNotification('Contacts refreshed successfully', 'success');
            }, 1000);
        }
    }

    updateRecipientCount(count = null) {
        let recipientCount = 0;
        
        if (typeof count === 'number') {
            recipientCount = count;
        } else {
            const activeTab = document.querySelector('.nav-tabs .nav-link.active');
            if (activeTab) {
                const tabId = activeTab.getAttribute('id');
                
                switch(tabId) {
                    case 'numbers-tab':
                        const numbers = document.getElementById('phoneNumbers');
                        if (numbers) {
                            const lines = numbers.value.split('\n').filter(n => n.trim().length > 0);
                            recipientCount = lines.length;
                        }
                        break;
                        
                    case 'file-tab':
                        // Get count from file processing
                        const fileInfo = document.querySelector('#contactFileUpload h6');
                        if (fileInfo && fileInfo.textContent.includes('imported')) {
                            const match = fileInfo.textContent.match(/\d+/);
                            recipientCount = match ? parseInt(match[0]) : 0;
                        }
                        break;
                        
                    case 'contacts-tab':
                        // Count selected contacts from table
                        const selectedContacts = document.querySelectorAll('.contact-checkbox:checked');
                        recipientCount = selectedContacts.length;
                        break;
                }
            }
        }
        
        // Update UI
        const countElement = document.getElementById('recipientCount');
        const previewCount = document.getElementById('previewRecipientCount');
        const costElement = document.getElementById('previewEstimatedCost');
        
        if (countElement) countElement.textContent = `${recipientCount} number${recipientCount !== 1 ? 's' : ''}`;
        if (previewCount) previewCount.textContent = recipientCount;
        if (costElement) {
            const cost = (recipientCount * 0.3).toFixed(2);
            costElement.textContent = `₹${cost}`;
        }
        
        return recipientCount;
    }

    initFormValidation() {
        const sendBtn = document.getElementById('sendMessageBtn');
        const saveBtn = document.getElementById('saveDraftBtn');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveDraft());
        }
    }

    sendMessage() {
        const campaignName = document.getElementById('campaignName').value.trim();
        const message = document.getElementById('messageContent').value.trim();
        const recipientCount = this.updateRecipientCount();
        
        // Validation
        if (!campaignName) {
            this.showNotification('Please enter a campaign name', 'warning');
            document.getElementById('campaignName').focus();
            return;
        }
        
        if (!message) {
            this.showNotification('Please enter your message', 'warning');
            document.getElementById('messageContent').focus();
            return;
        }
        
        if (recipientCount === 0) {
            this.showNotification('Please add at least one recipient', 'warning');
            return;
        }
        
        const cost = (recipientCount * 0.3).toFixed(2);
        const confirmed = confirm(`Send this message to ${recipientCount} recipients?\nEstimated cost: ₹${cost}`);
        
        if (!confirmed) return;
        
        // Show loading state
        const sendBtn = document.getElementById('sendMessageBtn');
        const originalHTML = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            sendBtn.innerHTML = originalHTML;
            sendBtn.disabled = false;
            
            this.showNotification(`Message sent successfully to ${recipientCount} recipients!`, 'success');
            
            // Update stats
            this.updateStats(recipientCount);
            
            // Clear form
            this.clearForm();
            
        }, 2000);
    }

    updateStats(newRecipients) {
        const sentToday = document.getElementById('sentToday');
        const successRate = document.getElementById('successRate');
        
        if (sentToday) {
            const current = parseInt(sentToday.textContent.replace(/,/g, '')) || 0;
            sentToday.textContent = (current + newRecipients).toLocaleString();
        }
        
        if (successRate) {
            const currentRate = parseInt(successRate.textContent) || 98;
            const newRate = Math.min(99, Math.max(95, currentRate + (Math.random() > 0.5 ? 1 : -1)));
            successRate.textContent = `${newRate}%`;
        }
    }

    clearForm() {
        document.getElementById('campaignName').value = '';
        document.getElementById('messageContent').value = '';
        document.getElementById('phoneNumbers').value = '';
        document.getElementById('imageUpload').innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Drag & drop or click to upload image</span>
            <input type="file" accept="image/*" id="imageInput">
        `;
        
        // Clear contact selections
        const checkboxes = document.querySelectorAll('.contact-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = false;
            const row = cb.closest('tr');
            if (row) row.classList.remove('table-selected');
        });
        const selectAll = document.getElementById('selectAllContacts');
        if (selectAll) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        }
        
        // Re-initialize file upload
        this.initFileUpload();
        this.updateRecipientCount();
        this.initCharacterCounter();
        this.updateContactsSelectedCount();
    }

    saveDraft() {
        const campaignName = document.getElementById('campaignName').value.trim();
        const message = document.getElementById('messageContent').value.trim();
        
        if (!campaignName && !message) {
            this.showNotification('Nothing to save', 'info');
            return;
        }
        
        const saveBtn = document.getElementById('saveDraftBtn');
        const originalHTML = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveBtn.disabled = true;
        
        setTimeout(() => {
            saveBtn.innerHTML = originalHTML;
            saveBtn.disabled = false;
            
            const draft = {
                campaignName,
                message,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('rcs_draft', JSON.stringify(draft));
            this.showNotification('Draft saved successfully', 'success');
        }, 1000);
    }

    loadDraft() {
        const draft = localStorage.getItem('rcs_draft');
        if (draft) {
            try {
                const { campaignName, message } = JSON.parse(draft);
                if (campaignName) {
                    document.getElementById('campaignName').value = campaignName;
                }
                if (message) {
                    document.getElementById('messageContent').value = message;
                }
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }

    initPreviewUpdates() {
        const messageInput = document.getElementById('messageContent');
        const campaignInput = document.getElementById('campaignName');
        
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                const previewMessage = document.getElementById('previewMessage');
                if (previewMessage) {
                    previewMessage.textContent = messageInput.value || 'Your message will appear here';
                }
            });
        }
        
        if (campaignInput) {
            campaignInput.addEventListener('input', () => {
                const previewTitle = document.getElementById('previewTitle');
                if (previewTitle) {
                    previewTitle.textContent = campaignInput.value || 'Campaign Title';
                }
            });
        }
    }

    updatePreviewTime() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const timeElement = document.getElementById('previewTime');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        };
        
        updateTime();
        setInterval(updateTime, 60000);
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save draft
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const saveBtn = document.getElementById('saveDraftBtn');
                if (saveBtn) saveBtn.click();
            }
            
            // Ctrl/Cmd + Enter to send
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const sendBtn = document.getElementById('sendMessageBtn');
                if (sendBtn) sendBtn.click();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                const overlay = document.getElementById('overlay');
                const sidebar = document.getElementById('simpleSidebar');
                if (overlay && overlay.classList.contains('active')) {
                    overlay.click();
                }
            }
            
            // Ctrl/Cmd + A to select all contacts when in contacts tab
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                const activeTab = document.querySelector('.nav-tabs .nav-link.active');
                if (activeTab && activeTab.id === 'contacts-tab') {
                    e.preventDefault();
                    const selectAll = document.getElementById('selectAllContacts');
                    if (selectAll) {
                        selectAll.checked = !selectAll.checked;
                        selectAll.dispatchEvent(new Event('change'));
                    }
                }
            }
        });
    }

    initResponsive() {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            const phonePreview = document.querySelector('.phone-preview');
            
            if (phonePreview && isMobile) {
                phonePreview.style.transform = 'scale(0.9)';
            } else if (phonePreview) {
                phonePreview.style.transform = '';
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.simple-notification');
        existing.forEach(notif => {
            notif.style.animation = 'slideOutNotification 0.3s ease forwards';
            setTimeout(() => notif.remove(), 300);
        });
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'simple-notification';
        
        const icon = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'times-circle',
            info: 'info-circle'
        }[type] || 'info-circle';
        
        const color = {
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6'
        }[type] || '#3b82f6';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}" style="color: ${color};"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 1.25rem;
            right: 1.25rem;
            background: white;
            border-left: 4px solid ${color};
            padding: 1rem 1.25rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            max-width: 400px;
            z-index: 9999;
            animation: slideInNotification 0.3s ease;
            border: 1px solid #e2e8f0;
            font-size: 0.875rem;
        `;
        
        document.body.appendChild(notification);
        
        // Add animation styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInNotification {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutNotification {
                    to {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.25rem;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    background: #f1f5f9;
                    color: #1e293b;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutNotification 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutNotification 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rcsApp = new RCSApp();
});

// Expose showNotification globally
window.showNotification = (message, type) => {
    if (window.rcsApp) {
        window.rcsApp.showNotification(message, type);
    }
};