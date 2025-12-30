document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Determine which page we're on based on URL or elements present
    const isTemplateFormPage = window.location.pathname.includes('template-form.html') || 
                               document.getElementById('templateForm') !== null;
    
    if (isTemplateFormPage) {
        initTemplateForm();
    } else {
        initTemplatesList();
    }
    
    // ============================================
    // TEMPLATE LIST PAGE FUNCTIONS
    // ============================================
    
    function initTemplatesList() {
        // DOM Elements for template list page
        const addTemplateBtn = document.getElementById('addTemplateBtn');
        const templateSearch = document.getElementById('templateSearch');
        const entriesSelect = document.getElementById('entriesSelect');
        
        // Initialize data
        loadTemplatesData();
        
        // Initialize event listeners
        if (addTemplateBtn) {
            addTemplateBtn.addEventListener('click', function() {
                // Redirect to template form page for adding new template
                window.location.href = 'template-form.html';
            });
        }
        
        if (templateSearch) {
            templateSearch.addEventListener('input', searchTemplates);
        }
        
        if (entriesSelect) {
            entriesSelect.addEventListener('change', updateTableEntries);
        }
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
                        <a href="template-form.html?id=${template.id}" 
                           class="btn btn-sm btn-outline-primary border-0 agent-action-btn edit-template-btn" 
                           data-template-id="${template.id}"
                           title="Edit Template">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="btn btn-sm btn-outline-danger border-0 agent-action-btn delete-template-btn"
                                title="Delete Template">
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
    
    // ============================================
    // TEMPLATE FORM PAGE FUNCTIONS
    // ============================================
    
    function initTemplateForm() {
        // DOM Elements for template form page
        const saveTemplateBtn = document.getElementById('saveTemplateBtn');
        const addSuggestionBtn = document.getElementById('addSuggestionBtn');
        const browseFileBtn = document.getElementById('browseFileBtn');
        const fileUpload = document.getElementById('fileUpload');
        const fileName = document.getElementById('fileName');
        const cardDescription = document.getElementById('cardDescription');
        const charCount = document.getElementById('charCount');
        const templateForm = document.getElementById('templateForm');
        const pageTitle = document.getElementById('pageTitle');
        
        // Check if we're in edit mode
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('id');
        const isEditMode = templateId !== null;
        
        // Initialize form based on mode
        if (isEditMode) {
            // Set page title for edit mode
            if (pageTitle) pageTitle.textContent = 'EDIT TEMPLATE';
            
            // Load template data for editing
            loadTemplateData(templateId);
        } else {
            // Add initial suggestion for new template
            addInitialSuggestion();
        }
        
        // Initialize event listeners
        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', handleSaveTemplate);
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
        
        if (templateForm) {
            templateForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSaveTemplate();
            });
        }
        
        // Initialize real-time preview updates
        initPreviewUpdates();
        
        // Initialize character counter
        updateCharacterCounter();
        
        // Update preview
        updatePreview();
    }
    
    function loadTemplateData(templateId) {
        // Sample template data - in real app, fetch from API
        const templateData = {
            id: parseInt(templateId),
            name: "Dec_Full2025",
            agent: "https://www.facebook.com/google/",
            description: "This is a sample template description with {#variable#}",
            type: "Standalone",
            category: "General",
            title: "Card Title",
            suggestions: [
                { action: "Reply", text: "Yes, I'm interested" },
                { action: "URL", text: "Visit Website" },
                { action: "Dial", text: "Call Support" }
            ]
        };
        
        // Populate form fields
        document.getElementById('templateName').value = templateData.name;
        document.getElementById('agentName').value = templateData.agent;
        document.getElementById('cardDescription').value = templateData.description;
        document.getElementById('templateType').value = templateData.type;
        document.getElementById('agentCategory').value = templateData.category;
        document.getElementById('cardTitle').value = templateData.title;
        
        // Populate suggestions
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            
            templateData.suggestions.forEach((suggestion, index) => {
                addSuggestionToForm(suggestion.action, suggestion.text, index + 1);
            });
        }
        
        // Update character counter and preview
        updateCharacterCounter();
        updatePreview();
    }
    
    function addInitialSuggestion() {
        addSuggestionToForm('Reply', 'Sample Reply', 1);
    }
    
    function addSuggestionToForm(action, text, index) {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;
        
        const suggestionHTML = `
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <span class="suggestion-label">Suggestion ${index}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-suggestion-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-4">
                        <select class="form-select form-select-sm suggestion-action">
                            <option value="Reply" ${action === 'Reply' ? 'selected' : ''}>Reply</option>
                            <option value="URL" ${action === 'URL' ? 'selected' : ''}>URL</option>
                            <option value="Dial" ${action === 'Dial' ? 'selected' : ''}>Dial</option>
                            <option value="Postback" ${action === 'Postback' ? 'selected' : ''}>Postback</option>
                        </select>
                    </div>
                    <div class="col-md-8">
                        <input type="text" class="form-control form-control-sm suggestion-text" 
                               placeholder="Enter Text or URL" value="${text || ''}">
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
    
    function addSuggestion() {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;
        
        const suggestionCount = container.children.length + 1;
        addSuggestionToForm('Reply', '', suggestionCount);
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
        
        // Update preview when card description changes
        const cardDescription = document.getElementById('cardDescription');
        if (cardDescription) {
            cardDescription.addEventListener('input', updatePreview);
        }
        
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
    
    function handleSaveTemplate() {
        const saveTemplateBtn = document.getElementById('saveTemplateBtn');
        const templateName = document.getElementById('templateName').value.trim();
        
        if (!templateName) {
            showNotification('Please enter a template name', 'warning');
            document.getElementById('templateName').focus();
            return;
        }
        
        // Validate required fields
        const requiredFields = document.querySelectorAll('#templateForm [required]');
        let isValid = true;
        
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
            // Reset button
            saveTemplateBtn.innerHTML = originalText;
            saveTemplateBtn.disabled = false;
            
            // Check if we're in edit mode
            const urlParams = new URLSearchParams(window.location.search);
            const templateId = urlParams.get('id');
            const isEditMode = templateId !== null;
            
            if (isEditMode) {
                showNotification(`Template "${templateName}" updated successfully!`, 'success');
            } else {
                showNotification(`Template "${templateName}" added successfully!`, 'success');
            }
            
            // Redirect back to template list after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'template.html';
            }, 1500);
            
        }, 1500);
    }
    
    // ============================================
    // SHARED FUNCTIONS
    // ============================================
    
    // Show notification function (shared between both pages)
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