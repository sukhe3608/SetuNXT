document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize agents management
    initAgentsManagement();
    
    function initAgentsManagement() {
        
        // DOM Elements
        const addAgentBtn = document.getElementById('addAgentBtn');
        const submitFormBtn = document.getElementById('submitFormBtn');
        const agentSearch = document.getElementById('agentSearch');
        const entriesSelect = document.getElementById('entriesSelect');
        const agentModal = document.getElementById('agentModal');
        const saveAgentBtn = document.getElementById('saveAgentBtn');
        const colorPicker = document.getElementById('modalColor');
        const fileInputs = document.querySelectorAll('input[type="file"]');
        const agentsTableBody = document.getElementById('agentsTableBody');
        
        // Initialize event listeners
        if (addAgentBtn) {
            addAgentBtn.addEventListener('click', showAddAgentModal);
        }
        
        if (submitFormBtn) {
            submitFormBtn.addEventListener('click', submitAgentForm);
        }
        
        if (agentSearch) {
            agentSearch.addEventListener('input', searchAgents);
        }
        
        if (entriesSelect) {
            entriesSelect.addEventListener('change', updateTableEntries);
        }
        
        if (saveAgentBtn) {
            saveAgentBtn.addEventListener('click', saveAgent);
        }
        
        if (colorPicker) {
            colorPicker.addEventListener('input', updateColorValue);
        }
        
        // Initialize file inputs
        fileInputs.forEach(input => {
            input.addEventListener('change', handleFileSelect);
        });
        
        // Load initial agents data
        loadAgentsData();
  
    }
    
    function loadAgentsData() {
        const agents = [
            {
                id: 1,
                userName: "rbmsupport",
                agentName: "PRP Promo",
                degenerator: "Edit",
                agencyType: "rromouorua",
                phone: "18003135152",
                email: "info@prpservices.in",
                address: "PRP Services Office",
                city: "Mumbai",
                state: "Maharashtra",
                created: "2024-01-15",
                status: "active"
            },
            {
                id: 2,
                userName: "Gurupeeth",
                agentName: "Akhil Bhariiya Shree Swami Samarth Gurupeeth",
                degenerator: "Edit",
                agencyType: "Spiritual",
                phone: "+919876543210",
                email: "contact@gurupeeth.com",
                address: "Ashram Road",
                city: "Haridwar",
                state: "Uttarakhand",
                created: "2024-01-10",
                status: "active"
            },
            {
                id: 3,
                userName: "Repairindia",
                agentName: "Repair India",
                degenerator: "Edit",
                agencyType: "Service",
                phone: "18001800111",
                email: "support@repairindia.com",
                address: "Service Center",
                city: "Delhi",
                state: "Delhi",
                created: "2024-01-05",
                status: "active"
            }
        ];
        
        const tableBody = document.getElementById('agentsTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = agents.map(agent => `
            <tr data-agent-id="${agent.id}">
                <td class="ps-3">
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-secondary border-0 agent-action-btn details-toggle-btn" 
                                data-target="agentDetails${agent.id}">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary border-0 agent-action-btn delete-btn">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
                <td class="d-none d-md-table-cell">
                    <span class="badge ${agent.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                        ${agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </span>
                </td>
                <td>
                    <span class="fw-medium">${agent.userName}</span>
                </td>
                <td>
                    <span>${agent.agentName}</span>
                </td>
            </tr>
            <tr class="details-row" id="agentDetails${agent.id}-row">
                <td colspan="5" class="p-0 border-0">
                    <div class="collapse" id="agentDetails${agent.id}">
                        <div class="details-content p-3 p-md-4 bg-light">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">Degenerator:</label>
                                            <div class="d-flex align-items-center gap-2">
                                                <span class="fw-medium">${agent.degenerator}</span>
                                                <span class="badge bg-info">DRID</span>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">Agency type:</label>
                                            <div class="fw-medium">${agent.agencyType}</div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">Phone No:</label>
                                            <div class="fw-medium">${agent.phone}</div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">Email:</label>
                                            <div class="fw-medium">${agent.email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">Address:</label>
                                            <div class="fw-medium">${agent.address}</div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">City:</label>
                                            <div class="fw-medium">${agent.city}</div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">State:</label>
                                            <div class="fw-medium">${agent.state}</div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small text-muted mb-1">Created:</label>
                                            <div class="fw-medium">${agent.created}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="edit-button-container mt-3 pt-3 border-top">
                                        <button class="btn btn-primary btn-sm details-edit-btn" data-agent-id="${agent.id}">
                                            <i class="fas fa-edit me-2"></i>Edit Agent Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Initialize details toggle buttons
        const detailsToggleBtns = document.querySelectorAll('.details-toggle-btn');
        
        detailsToggleBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('data-target');
                const targetCollapse = document.getElementById(targetId);
                
                if (!targetCollapse) return;
                
                const bsCollapse = new bootstrap.Collapse(targetCollapse, {
                    toggle: true
                });
                
                // Toggle icon
                const icon = this.querySelector('i');
                
                targetCollapse.addEventListener('shown.bs.collapse', () => {
                    icon.classList.remove('fa-ellipsis-vertical');
                    icon.classList.add('fa-times');
                });
                
                targetCollapse.addEventListener('hidden.bs.collapse', () => {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-ellipsis-vertical');
                });
            });
        });
        
        // Initialize delete buttons
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('tr');
                if (row) {
                    deleteAgent(row);
                }
            });
        });
        
        // Initialize edit buttons using event delegation
        document.addEventListener('click', function(e) {
            if (e.target.closest('.details-edit-btn')) {
                e.preventDefault();
                const editBtn = e.target.closest('.details-edit-btn');
                const agentId = editBtn.getAttribute('data-agent-id');
                if (agentId) {
                    // Find the main row for this agent
                    const mainRow = document.querySelector(`tr[data-agent-id="${agentId}"]`);
                    if (mainRow) {
                        editAgent(mainRow);
                    }
                }
            }
        });
    }
    
    function showAddAgentModal() {
        const modalTitle = document.getElementById('modalTitle');
        const modalElement = document.getElementById('agentModal');
        
        // Set modal title
        if (modalTitle) modalTitle.textContent = 'Add Agent';
        
        // Reset form fields
        const form = document.querySelector('#agentModal form');
        if (form) {
            const formElements = form.querySelectorAll('input, select, textarea');
            formElements.forEach(element => {
                if (element.type !== 'radio' && element.type !== 'file' && element.id !== 'modalColor') {
                    element.value = '';
                }
            });
            
            // Reset checkboxes
            const radios = form.querySelectorAll('input[type="radio"]');
            if (radios.length > 0) {
                radios[0].checked = true;
            }
        }
        
        // Reset file inputs
        const modalLogoText = document.getElementById('modalLogoText');
        const modalBannerText = document.getElementById('modalBannerText');
        if (modalLogoText) modalLogoText.value = '';
        if (modalBannerText) modalBannerText.value = '';
        
        // Reset color picker
        const colorPicker = document.getElementById('modalColor');
        if (colorPicker) {
            colorPicker.value = '#4f46e5';
            const colorText = colorPicker.nextElementSibling;
            if (colorText) colorText.textContent = '#4f46e5';
        }
        
        // Reset status
        const statusSelect = document.getElementById('modalStatus');
        if (statusSelect) statusSelect.value = 'active';
        
        // Reset country
        const countrySelect = document.getElementById('modalCountry');
        if (countrySelect) countrySelect.value = 'IN';
        
        // Show modal
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
    
    function submitAgentForm() {
        const submitFormBtn = document.getElementById('submitFormBtn');
        const userNameInput = document.getElementById('userName');
        const userName = userNameInput ? userNameInput.value.trim() : '';
        
        if (!userName) {
            showNotification('Please enter a user name', 'warning');
            if (userNameInput) userNameInput.focus();
            return;
        }
        
        // Show loading state
        if (!submitFormBtn) return;
        
        const originalText = submitFormBtn.innerHTML;
        submitFormBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting...';
        submitFormBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification(`User agent "${userName}" submitted successfully!`, 'success');
            
            // Reset form
            if (userNameInput) userNameInput.value = '';
            
            // Restore button
            submitFormBtn.innerHTML = originalText;
            submitFormBtn.disabled = false;
        }, 1000);
    }
    
    function searchAgents() {
        const searchTerm = this.value.toLowerCase().trim();
        const tableRows = document.querySelectorAll('#agentsTable tbody tr:not(.details-row)');
        let visibleCount = 0;
        
        tableRows.forEach(row => {
            if (row.cells.length < 4) return;
            
            const userName = row.cells[2]?.textContent.toLowerCase() || '';
            const agentName = row.cells[3]?.textContent.toLowerCase() || '';
            
            if (userName.includes(searchTerm) || agentName.includes(searchTerm)) {
                row.style.display = '';
                visibleCount++;
                
                // Show/hide details row
                const detailsRow = row.nextElementSibling;
                if (detailsRow && detailsRow.classList.contains('details-row')) {
                    detailsRow.style.display = '';
                }
            } else {
                row.style.display = 'none';
                
                // Hide details row
                const detailsRow = row.nextElementSibling;
                if (detailsRow && detailsRow.classList.contains('details-row')) {
                    detailsRow.style.display = 'none';
                }
            }
        });
        
        updateTableInfo(visibleCount);
    }
    
    function updateTableEntries() {
        const entries = parseInt(this.value);
        showNotification(`Showing ${entries} entries per page`, 'info');
        // In a real app, this would fetch new data from the server
    }
    
    function updateColorValue() {
        const colorText = this.nextElementSibling;
        if (colorText) {
            colorText.textContent = this.value;
            colorText.style.color = this.value;
        }
    }
    
    function handleFileSelect(event) {
        const file = event.target.files[0];
        let displayInput;
        
        if (event.target.id === 'modalLogo') {
            displayInput = document.getElementById('modalLogoText');
        } else if (event.target.id === 'modalBanner') {
            displayInput = document.getElementById('modalBannerText');
        }
        
        if (file && displayInput) {
            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showNotification('File size must be less than 5MB', 'warning');
                event.target.value = '';
                displayInput.value = '';
                displayInput.placeholder = 'No file chosen';
                return;
            }
            
            // Validate file type for images
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                showNotification('Please select a valid image file (JPEG, PNG, GIF, SVG)', 'warning');
                event.target.value = '';
                displayInput.value = '';
                displayInput.placeholder = 'No file chosen';
                return;
            }
            
            displayInput.value = file.name;
            showNotification(`File "${file.name}" selected`, 'success');
        }
    }
    
    function deleteAgent(row) {
        const userName = row.cells[2]?.textContent.trim() || '';
        const agentName = row.cells[3]?.textContent.trim() || '';
        
        if (confirm(`Are you sure you want to delete agent "${agentName}" (${userName})?`)) {
            // Show loading
            row.style.opacity = '0.5';
            row.style.pointerEvents = 'none';
            
            setTimeout(() => {
                // In a real app, this would make API call to delete
                showNotification(`Agent "${agentName}" deleted successfully`, 'success');
                
                // Remove row from table
                const detailsRow = row.nextElementSibling;
                if (detailsRow && detailsRow.classList.contains('details-row')) {
                    detailsRow.remove();
                }
                row.remove();
                
                updateTableInfo();
            }, 1000);
        }
    }
    
    function saveAgent() {
        const saveAgentBtn = document.getElementById('saveAgentBtn');
        const form = document.querySelector('#agentModal form');
        
        if (!saveAgentBtn || !form) return;
        
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        // Validate required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        // Get form values
        const agentNameInput = document.getElementById('modalAgentName');
        const modalTitle = document.getElementById('modalTitle');
        const isEditMode = modalTitle?.textContent === 'Edit Agent';
        
        if (!agentNameInput) return;
        
        const agentName = agentNameInput.value.trim();
        
        // Show loading
        const originalText = saveAgentBtn.innerHTML;
        saveAgentBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Saving...';
        saveAgentBtn.disabled = true;
        
        setTimeout(() => {
            const modalElement = document.getElementById('agentModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
            
            if (isEditMode) {
                showNotification(`Agent "${agentName}" updated successfully!`, 'success');
            } else {
                showNotification(`Agent "${agentName}" added successfully!`, 'success');
                
                // In a real app, this would refresh the table with new data
                setTimeout(() => {
                    showNotification('Refresh the page to see the new agent in the list', 'info');
                }, 500);
            }
            
            // Reset button
            saveAgentBtn.innerHTML = originalText;
            saveAgentBtn.disabled = false;
        }, 1500);
    }
    
    function updateTableInfo(visibleCount = null) {
        const visibleRows = visibleCount || document.querySelectorAll('#agentsTable tbody tr:not(.details-row):not([style*="display: none"])').length;
        const totalRows = document.querySelectorAll('#agentsTable tbody tr:not(.details-row)').length;
        const infoElement = document.getElementById('tableInfo');
        
        if (infoElement) {
            if (visibleRows === totalRows) {
                infoElement.textContent = `Showing 1 to ${totalRows} of ${totalRows} entries`;
            } else {
                infoElement.textContent = `Showing 1 to ${visibleRows} of ${totalRows} entries (filtered)`;
            }
        }
    }
    
    function editAgent(row) {
        const agentId = row.getAttribute('data-agent-id');
        const userName = row.cells[2]?.textContent.trim() || '';
        const agentName = row.cells[3]?.textContent.trim() || '';
        
        // Find the details row
        const detailsRow = document.getElementById(`agentDetails${agentId}-row`);
        let phone = '18003135152';
        let email = 'info@example.com';
        let degenerator = 'Edit';
        let agencyType = 'General';
        
        if (detailsRow) {
            const detailsContent = detailsRow.querySelector('.details-content');
            if (detailsContent) {
                // Extract data from details content
                const degeneratorElement = detailsContent.querySelector('.row > div:first-child .row > div:first-child .fw-medium');
                const agencyTypeElement = detailsContent.querySelector('.row > div:first-child .row > div:nth-child(2) .fw-medium');
                const phoneElement = detailsContent.querySelector('.row > div:first-child .row > div:nth-child(3) .fw-medium');
                const emailElement = detailsContent.querySelector('.row > div:first-child .row > div:nth-child(4) .fw-medium');
                
                if (degeneratorElement) degenerator = degeneratorElement.textContent.trim();
                if (agencyTypeElement) agencyType = agencyTypeElement.textContent.trim();
                if (phoneElement) phone = phoneElement.textContent.trim();
                if (emailElement) email = emailElement.textContent.trim();
            }
        }
        
        // Populate modal with agent data
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) modalTitle.textContent = 'Edit Agent';
        
        const modalUserName = document.getElementById('modalUserName');
        if (modalUserName) modalUserName.value = userName;
        
        const modalAgentName = document.getElementById('modalAgentName');
        if (modalAgentName) modalAgentName.value = agentName;
        
        // Set other form fields
        const modalDescription = document.getElementById('modalDescription');
        if (modalDescription) modalDescription.value = `Description for ${agentName}`;
        
        const modalPrimaryPhone = document.getElementById('modalPrimaryPhone');
        if (modalPrimaryPhone) modalPrimaryPhone.value = phone;
        
        const modalPrimaryEmail = document.getElementById('modalPrimaryEmail');
        if (modalPrimaryEmail) modalPrimaryEmail.value = email;
        
        const modalStatus = document.getElementById('modalStatus');
        if (modalStatus) modalStatus.value = 'active';
        
        // Store agent ID in modal for reference
        const modalElement = document.getElementById('agentModal');
        if (modalElement) {
            modalElement.setAttribute('data-editing-agent-id', agentId);
        }
        
        // Show modal
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
    
    // Show notification function
    function showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Check if Bootstrap toast is available
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            // Create toast element
            const toastId = 'notification-toast-' + Date.now();
            const toastHtml = `
                <div class="toast align-items-center text-bg-${type} border-0" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;
            
            // Add to document
            const toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.innerHTML = toastHtml;
            document.body.appendChild(toastContainer);
            
            // Show toast
            const toastElement = document.getElementById(toastId);
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: 3000
            });
            toast.show();
            
            // Remove after hidden
            toastElement.addEventListener('hidden.bs.toast', function() {
                toastContainer.remove();
            });
        } else {
            // Fallback to alert
            alert(message);
        }
    }
    
    // Initialize form validation
    function initFormValidation() {
        const form = document.querySelector('#agentModal form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }
    
    // Initialize form validation when modal is shown
    const agentModalElement = document.getElementById('agentModal');
    if (agentModalElement) {
        agentModalElement.addEventListener('shown.bs.modal', initFormValidation);
    }
});