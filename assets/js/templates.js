document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize templates management
    initTemplatesManagement();
    
    function initTemplatesManagement() {
        // DOM Elements
        const addTemplateBtn = document.getElementById('addTemplateBtn');
        const templateSearch = document.getElementById('templateSearch');
        const entriesSelect = document.getElementById('entriesSelect');
        const saveTemplateBtn = document.getElementById('saveTemplateBtn');
        const addSuggestionBtn = document.getElementById('addSuggestionBtn');
        const browseFileBtn = document.getElementById('browseFileBtn');
        const fileUpload = document.getElementById('fileUpload');
        const fileName = document.getElementById('fileName');
        const cardDescription = document.getElementById('cardDescription');
        const charCount = document.getElementById('charCount');
        const templatesTableBody = document.getElementById('templatesTableBody');
        
        // Initialize data
        loadTemplatesData();
        
        // Initialize event listeners
        if (addTemplateBtn) {
            addTemplateBtn.addEventListener('click', showAddTemplateModal);
        }
        
        if (templateSearch) {
            templateSearch.addEventListener('input', searchTemplates);
        }
        
        if (entriesSelect) {
            entriesSelect.addEventListener('change', updateTableEntries);
        }
        
        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', saveTemplate);
        }
        
        if (addSuggestionBtn) {
            addSuggestionBtn.addEventListener('click', addSuggestion);
        }
        
        if (browseFileBtn && fileUpload) {
            browseFileBtn.addEventListener('click', () => fileUpload.click());
        }
        
        if (fileUpload && fileName) {
            fileUpload.addEventListener('change', handleFileSelect);
        }
        
        if (cardDescription && charCount) {
            cardDescription.addEventListener('input', updateCharacterCounter);
        }
        
        // Initialize real-time preview updates
        initPreviewUpdates();
    }
    
    function loadTemplatesData() {
        const templates = [
            {
                id: 1,
                userName: "MoreDada",
                agentName: "https://www.facebook.com/google/",
                templateName: "Dec_Full2025",
                templateType: "Standalone",
                status: "pending",
                modifiedOn: "12/12/2025 3:04:43 PM"
            },
            {
                id: 2,
                userName: "https://www.facebook.com/google/",
                agentName: "https://www.facebook.com/google/",
                templateName: "Dec_Thankyou",
                templateType: "Standalone",
                status: "pending",
                modifiedOn: "12/12/2025 2:59:27 PM"
            },
            {
                id: 3,
                userName: "Global_Trade",
                agentName: "https://www.facebook.com/google/",
                templateName: "12 dec",
                templateType: "Standalone",
                status: "active",
                modifiedOn: "12/11/2025 5:27:42 PM"
            },
            {
                id: 4,
                userName: "Kishore_Agencies",
                agentName: "Kishore Foam Agencies",
                templateName: "Kishore!!!",
                templateType: "Standalone",
                status: "active",
                modifiedOn: "12/11/2025 2:19:40 PM"
            },
            {
                id: 5,
                userName: "ASG_HOSPITAL",
                agentName: "ASG EYE HOSPITAL",
                templateName: "test",
                templateType: "Standalone",
                status: "pending",
                modifiedOn: "12/10/2025 6:25:58 PM"
            }
        ];
        
        const tableBody = document.getElementById('templatesTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = templates.map(template => `
            <tr data-template-id="${template.id}">
                <td class="ps-3">
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-secondary border-0 agent-action-btn edit-template-btn" 
                                data-template-id="${template.id}">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger border-0 agent-action-btn delete-template-btn">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
                <td>${template.userName}</td>
                <td>
                    ${template.agentName.includes('http') ? 
                        `<a href="${template.agentName}" class="text-primary text-decoration-none" target="_blank">${template.agentName}</a>` : 
                        template.agentName}
                </td>
                <td><strong>${template.templateName}</strong></td>
                <td>${template.templateType}</td>
                <td>
                    <span class="badge ${template.status === 'active' ? 'badge-active' : 'badge-pending'}">
                        ${template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                    </span>
                </td>
                <td>${template.modifiedOn}</td>
            </tr>
        `).join('');
        
        // Initialize delete buttons
        const deleteBtns = document.querySelectorAll('.delete-template-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('tr');
                if (row) {
                    deleteTemplate(row);
                }
            });
        });
        
        // Initialize edit buttons
        const editBtns = document.querySelectorAll('.edit-template-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const templateId = this.getAttribute('data-template-id');
                if (templateId) {
                    editTemplate(parseInt(templateId));
                }
            });
        });
    }
    
    function showAddTemplateModal() {
        const modalTitle = document.getElementById('modalTitle');
        const modalElement = document.getElementById('templateModal');
        
        // Set modal title
        if (modalTitle) modalTitle.textContent = 'Add Template';
        
        // Reset form fields
        const form = document.querySelector('#templateModal form');
        if (form) {
            const formElements = form.querySelectorAll('input, select, textarea');
            formElements.forEach(element => {
                if (element.type !== 'radio' && element.type !== 'file') {
                    element.value = '';
                }
            });
        }
        
        // Reset file input
        const fileName = document.getElementById('fileName');
        const fileUpload = document.getElementById('fileUpload');
        if (fileName) {
            fileName.textContent = 'No file chosen';
            fileName.classList.remove('has-file');
        }
        if (fileUpload) fileUpload.value = '';
        
        // Reset character counter
        const charCount = document.getElementById('charCount');
        const cardDescription = document.getElementById('cardDescription');
        if (charCount) charCount.textContent = '0';
        if (cardDescription) cardDescription.value = '';
        
        // Reset suggestions
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            addInitialSuggestion();
        }
        
        // Reset preview
        updatePreview();
        
        // Reset select values to default
        const templateType = document.getElementById('templateType');
        const agentCategory = document.getElementById('agentCategory');
        if (templateType) templateType.value = 'Standalone';
        if (agentCategory) agentCategory.value = 'General';
        
        // Show modal
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
    
    function addInitialSuggestion() {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;
        
        const suggestionHTML = `
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <span class="suggestion-label">Suggestion 1</span>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-suggestion-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-4">
                        <select class="form-select form-select-sm suggestion-action">
                            <option value="Reply" selected>Reply</option>
                            <option value="URL">URL</option>
                            <option value="Dial">Dial</option>
                            <option value="Postback">Postback</option>
                        </select>
                    </div>
                    <div class="col-md-8">
                        <input type="text" class="form-control form-control-sm suggestion-text" placeholder="Enter Text or URL">
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = suggestionHTML;
        
        // Add event listener to remove button
        const removeBtn = container.querySelector('.remove-suggestion-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                removeSuggestion(this);
            });
        }
        
        // Add event listeners to inputs
        const suggestionText = container.querySelector('.suggestion-text');
        const suggestionAction = container.querySelector('.suggestion-action');
        
        if (suggestionText) {
            suggestionText.addEventListener('input', updatePreview);
        }
        
        if (suggestionAction) {
            suggestionAction.addEventListener('change', updatePreview);
        }
    }
    
    function addSuggestion() {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;
        
        const suggestionCount = container.children.length + 1;
        
        const suggestionHTML = `
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <span class="suggestion-label">Suggestion ${suggestionCount}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-suggestion-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-4">
                        <select class="form-select form-select-sm suggestion-action">
                            <option value="Reply" selected>Reply</option>
                            <option value="URL">URL</option>
                            <option value="Dial">Dial</option>
                            <option value="Postback">Postback</option>
                        </select>
                    </div>
                    <div class="col-md-8">
                        <input type="text" class="form-control form-control-sm suggestion-text" placeholder="Enter Text or URL">
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', suggestionHTML);
        
        // Add event listener to new remove button
        const newSuggestion = container.lastElementChild;
        const removeBtn = newSuggestion.querySelector('.remove-suggestion-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                removeSuggestion(this);
            });
        }
        
        // Add event listeners to new inputs
        const suggestionText = newSuggestion.querySelector('.suggestion-text');
        const suggestionAction = newSuggestion.querySelector('.suggestion-action');
        
        if (suggestionText) {
            suggestionText.addEventListener('input', updatePreview);
        }
        
        if (suggestionAction) {
            suggestionAction.addEventListener('change', updatePreview);
        }
    }
    
    function removeSuggestion(button) {
        const suggestionItem = button.closest('.suggestion-item');
        if (suggestionItem) {
            suggestionItem.remove();
            updatePreview();
            renumberSuggestions();
        }
    }
    
    function renumberSuggestions() {
        const suggestions = document.querySelectorAll('.suggestion-item');
        suggestions.forEach((item, index) => {
            const label = item.querySelector('.suggestion-label');
            if (label) {
                label.textContent = `Suggestion ${index + 1}`;
            }
        });
    }
    
    function handleFileSelect(event) {
        const file = event.target.files[0];
        const fileNameElement = document.getElementById('fileName');
        
        if (file && fileNameElement) {
            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                showNotification('File size must be less than 10MB', 'warning');
                event.target.value = '';
                fileNameElement.textContent = 'No file chosen';
                fileNameElement.classList.remove('has-file');
                return;
            }
            
            // Validate file type
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
            const isValidType = validImageTypes.includes(file.type) || validVideoTypes.includes(file.type);
            
            if (!isValidType) {
                showNotification('Please select a valid image or video file', 'warning');
                event.target.value = '';
                fileNameElement.textContent = 'No file chosen';
                fileNameElement.classList.remove('has-file');
                return;
            }
            
            fileNameElement.textContent = file.name;
            fileNameElement.classList.add('has-file');
            showNotification(`File "${file.name}" selected successfully`, 'success');
        }
    }
    
    function updateCharacterCounter() {
        const charCount = document.getElementById('charCount');
        const cardDescription = document.getElementById('cardDescription');
        const charCounter = document.querySelector('.char-counter');
        
        if (!charCount || !cardDescription || !charCounter) return;
        
        const count = cardDescription.value.length;
        charCount.textContent = count;
        
        // Update color based on count
        charCounter.classList.remove('warning', 'danger');
        if (count > 900) {
            charCounter.classList.add('warning');
        }
        if (count > 1000) {
            charCounter.classList.add('danger');
        }
        
        updatePreview();
    }
    
    function initPreviewUpdates() {
        // Update preview when template name changes
        const templateName = document.getElementById('templateName');
        if (templateName) {
            templateName.addEventListener('input', updatePreview);
        }
        
        // Update preview when card description changes (already handled by character counter)
        
        // Update preview when template type changes
        const templateType = document.getElementById('templateType');
        if (templateType) {
            templateType.addEventListener('change', updatePreview);
        }
        
        // Update preview when agent category changes
        const agentCategory = document.getElementById('agentCategory');
        if (agentCategory) {
            agentCategory.addEventListener('change', updatePreview);
        }
        
        // Update preview when card title changes
        const cardTitle = document.getElementById('cardTitle');
        if (cardTitle) {
            cardTitle.addEventListener('input', updatePreview);
        }
    }
    
    function updatePreview() {
        const previewMessage = document.getElementById('previewMessage');
        const quickReplies = document.getElementById('quickReplies');
        const cardDescription = document.getElementById('cardDescription');
        
        // Update message preview
        if (cardDescription && previewMessage) {
            const message = cardDescription.value || 'Template message preview will appear here...';
            // Highlight variables in the format {#var#}
            const highlightedMessage = message.replace(
                /\{#([^#]+)#\}/g, 
                '<span class="variable-highlight">{$1}</span>'
            );
            previewMessage.innerHTML = highlightedMessage;
        }
        
        // Update quick replies
        if (quickReplies) {
            quickReplies.innerHTML = '';
            const suggestionTexts = document.querySelectorAll('.suggestion-text');
            const suggestionActions = document.querySelectorAll('.suggestion-action');
            
            suggestionTexts.forEach((input, index) => {
                if (input.value.trim()) {
                    const action = suggestionActions[index] ? suggestionActions[index].value : 'Reply';
                    let icon = '';
                    
                    switch(action) {
                        case 'Reply':
                            icon = '<i class="fas fa-reply"></i>';
                            break;
                        case 'URL':
                            icon = '<i class="fas fa-link"></i>';
                            break;
                        case 'Dial':
                            icon = '<i class="fas fa-phone"></i>';
                            break;
                        default:
                            icon = '<i class="fas fa-arrow-right"></i>';
                    }
                    
                    const button = document.createElement('div');
                    button.className = 'quick-reply-btn';
                    button.innerHTML = `${icon}<span>${input.value}</span>`;
                    quickReplies.appendChild(button);
                }
            });
        }
    }
    
    function searchTemplates() {
        const searchTerm = this.value.toLowerCase().trim();
        const tableRows = document.querySelectorAll('#templatesTable tbody tr');
        let visibleCount = 0;
        
        tableRows.forEach(row => {
            const cells = row.cells;
            let shouldShow = false;
            
            // Skip action column (index 0)
            for (let i = 1; i < cells.length; i++) {
                const cellText = cells[i].textContent.toLowerCase();
                if (cellText.includes(searchTerm)) {
                    shouldShow = true;
                    break;
                }
            }
            
            if (shouldShow) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        updateTableInfo(visibleCount);
    }
    
    function updateTableEntries() {
        const entries = parseInt(this.value);
        showNotification(`Showing ${entries} entries per page`, 'info');
        // In a real app, this would fetch new data from the server
    }
    
    function deleteTemplate(row) {
        const templateName = row.cells[3]?.querySelector('strong')?.textContent.trim() || 'this template';
        
        if (confirm(`Are you sure you want to delete template "${templateName}"?`)) {
            // Show loading
            row.style.opacity = '0.5';
            row.style.pointerEvents = 'none';
            
            setTimeout(() => {
                showNotification(`Template "${templateName}" deleted successfully`, 'success');
                row.remove();
                updateTableInfo();
            }, 1000);
        }
    }
    
    function editTemplate(templateId) {
        // For now, just show the add modal with edit title
        const modalTitle = document.getElementById('modalTitle');
        const modalElement = document.getElementById('templateModal');
        
        if (modalTitle) modalTitle.textContent = 'Edit Template';
        
        // In a real app, you would load the template data here
        // For this example, we'll just show an empty form
        
        // Show modal
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
    
    function saveTemplate() {
        const saveTemplateBtn = document.getElementById('saveTemplateBtn');
        const templateName = document.getElementById('templateName').value.trim();
        const modalTitle = document.getElementById('modalTitle');
        const isEditMode = modalTitle?.textContent === 'Edit Template';
        
        if (!templateName) {
            showNotification('Please enter a template name', 'warning');
            document.getElementById('templateName').focus();
            return;
        }
        
        // Validate file if one is selected
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload.files.length > 0) {
            const file = fileUpload.files[0];
            const maxSize = 10 * 1024 * 1024;
            
            if (file.size > maxSize) {
                showNotification('File size must be less than 10MB', 'warning');
                return;
            }
        }
        
        // Collect template data
        const templateData = {
            name: templateName,
            agent: document.getElementById('agentName').value.trim(),
            description: document.getElementById('cardDescription').value.trim(),
            type: document.getElementById('templateType').value,
            category: document.getElementById('agentCategory').value,
            title: document.getElementById('cardTitle').value.trim(),
            suggestions: []
        };
        
        // Collect suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            const action = item.querySelector('.suggestion-action').value;
            const text = item.querySelector('.suggestion-text').value.trim();
            if (text) {
                templateData.suggestions.push({ action, text });
            }
        });
        
        // Show loading
        const originalText = saveTemplateBtn.innerHTML;
        saveTemplateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Saving...';
        saveTemplateBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            const modalElement = document.getElementById('templateModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
            
            if (isEditMode) {
                showNotification(`Template "${templateName}" updated successfully!`, 'success');
            } else {
                showNotification(`Template "${templateName}" added successfully!`, 'success');
                
                // In a real app, this would refresh the table with new data
                setTimeout(() => {
                    showNotification('Refresh the page to see the new template in the list', 'info');
                }, 500);
            }
            
            // Reset button
            saveTemplateBtn.innerHTML = originalText;
            saveTemplateBtn.disabled = false;
        }, 1500);
    }
    
    function updateTableInfo(visibleCount = null) {
        const visibleRows = visibleCount || document.querySelectorAll('#templatesTable tbody tr:not([style*="display: none"])').length;
        const totalRows = document.querySelectorAll('#templatesTable tbody tr').length;
        const infoElement = document.getElementById('tableInfo');
        
        if (infoElement) {
            if (visibleRows === totalRows) {
                infoElement.textContent = `Showing 1 to ${totalRows} of ${totalRows} entries`;
            } else {
                infoElement.textContent = `Showing 1 to ${visibleRows} of ${totalRows} entries (filtered)`;
            }
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
});