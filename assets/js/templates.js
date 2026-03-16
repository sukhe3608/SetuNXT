// SetuNXT Templates Management
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Global variable to track suggestion count
    let suggestionCounter = 0;
    
    // Initialize templates functionality
    initializeTemplates();
    
    function initializeTemplates() {
        // Determine which page we're on based on URL or elements present
        const isTemplateFormPage = window.location.pathname.includes('template-form.html') || 
                                   document.getElementById('templateForm') !== null;
        
        if (isTemplateFormPage) {
            initTemplateForm();
        } else {
            initTemplatesList();
        }
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
                                data-template-id="${template.id}"
                                data-template-name="${template.templateName}"
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
        
        // Initialize delete buttons with SweetAlert2
        const deleteBtns = document.querySelectorAll('.delete-template-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const templateId = this.getAttribute('data-template-id');
                const templateName = this.getAttribute('data-template-name');
                deleteTemplate(templateId, templateName, this);
            });
        });
        
        updateTableInfo();
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
    
    async function deleteTemplate(templateId, templateName, button) {
        const row = button.closest('tr');
        
        // Get current theme for SweetAlert2 styling
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        const result = await Swal.fire({
            title: 'Delete Template',
            html: `Are you sure you want to delete template <strong>"${templateName}"</strong>?<br><br>
                  <small class="text-muted">This action cannot be undone.</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
            customClass: {
                popup: isDarkMode ? 'dark-swal' : '',
                title: isDarkMode ? 'text-light' : '',
                htmlContainer: isDarkMode ? 'text-light' : ''
            },
            buttonsStyling: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 1000);
                });
            }
        });
        
        if (result.isConfirmed) {
            // Show loading state
            if (row) {
                row.style.opacity = '0.5';
                row.style.pointerEvents = 'none';
            }
            
            // Simulate API call
            setTimeout(() => {
                if (row) {
                    row.remove();
                }
                
                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    html: `Template <strong>"${templateName}"</strong> has been deleted successfully.`,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: isDarkMode ? 'dark-swal' : '',
                        title: isDarkMode ? 'text-light' : '',
                        htmlContainer: isDarkMode ? 'text-light' : ''
                    }
                });
                
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
            addSuggestionBtn.addEventListener('click', function() {
                addSuggestion();
                updatePreview(); // Force update preview after adding
            });
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
        
        // Initialize time in preview
        updatePreviewTime();
        
        // Initial preview update
        updatePreview();
        
        // Update time every minute
        setInterval(updatePreviewTime, 60000);
    }
    
    function updatePreviewTime() {
        const previewTime = document.getElementById('previewTime');
        if (previewTime) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            previewTime.textContent = `${hours}:${minutes} ${ampm}`;
        }
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
        
        // Reset counter
        suggestionCounter = 0;
        
        // Populate suggestions
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            
            templateData.suggestions.forEach((suggestion, index) => {
                suggestionCounter++;
                addSuggestionToForm(suggestion.action, suggestion.text, suggestionCounter);
            });
        }
        
        // Update character counter and preview
        updateCharacterCounter();
        updatePreview();
    }
    
    function addInitialSuggestion() {
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            suggestionCounter = 1;
            addSuggestionToForm('Reply', 'Sample Reply', suggestionCounter);
        }
    }
    
    function getActionIcon(action) {
        switch(action) {
            case 'Reply': return 'fas fa-reply';
            case 'URL': return 'fas fa-link';
            case 'Dial': return 'fas fa-phone';
            case 'Postback': return 'fas fa-arrow-right';
            default: return 'fas fa-reply';
        }
    }
    
    function getActionIconClass(action) {
        switch(action) {
            case 'Reply': return 'suggestion-type-reply';
            case 'URL': return 'suggestion-type-url';
            case 'Dial': return 'suggestion-type-dial';
            case 'Postback': return 'suggestion-type-postback';
            default: return 'suggestion-type-reply';
        }
    }
    
    function getButtonClass(action) {
        switch(action) {
            case 'Reply': return 'btn-outline-primary';
            case 'URL': return 'btn-outline-info';
            case 'Dial': return 'btn-outline-success';
            case 'Postback': return 'btn-outline-warning';
            default: return 'btn-outline-primary';
        }
    }
    
    function getButtonIcon(action) {
        switch(action) {
            case 'Reply': return 'fas fa-reply';
            case 'URL': return 'fas fa-external-link-alt';
            case 'Dial': return 'fas fa-phone';
            case 'Postback': return 'fas fa-arrow-right';
            default: return 'fas fa-reply';
        }
    }
    
    function addSuggestionToForm(action, text, index) {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;
        
        const icon = getActionIcon(action);
        const iconClass = getActionIconClass(action);
        
        const suggestionHTML = `
            <div class="suggestion-item" data-suggestion-index="${index}">
                <div class="suggestion-header">
                    <span class="suggestion-label">
                        <div class="suggestion-type-icon ${iconClass}">
                            <i class="${icon}"></i>
                        </div>
                        Suggestion ${index} - ${action}
                    </span>
                    <div class="suggestion-actions">
                        <button type="button" class="btn btn-sm btn-outline-danger remove-suggestion-btn" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="row g-2">
                    <div class="col-md-4">
                        <select class="form-select form-select-sm suggestion-action" data-index="${index}">
                            <option value="Reply" ${action === 'Reply' ? 'selected' : ''}>Reply</option>
                            <option value="URL" ${action === 'URL' ? 'selected' : ''}>URL</option>
                            <option value="Dial" ${action === 'Dial' ? 'selected' : ''}>Dial</option>
                            <option value="Postback" ${action === 'Postback' ? 'selected' : ''}>Postback</option>
                        </select>
                    </div>
                    <div class="col-md-8">
                        <input type="text" class="form-control form-control-sm suggestion-text" data-index="${index}"
                               placeholder="Enter Text or URL" value="${text || ''}">
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', suggestionHTML);
        
        // Get the newly added suggestion
        const newSuggestion = container.lastElementChild;
        
        // Add event listener to remove button
        const removeBtn = newSuggestion.querySelector('.remove-suggestion-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                removeSuggestion(this);
            });
        }
        
        // Add event listeners to inputs
        const suggestionText = newSuggestion.querySelector('.suggestion-text');
        const suggestionAction = newSuggestion.querySelector('.suggestion-action');
        
        if (suggestionText) {
            suggestionText.addEventListener('input', function() {
                updateSuggestionLabel(newSuggestion);
                updatePreview(); // Update preview when text changes
            });
        }
        
        if (suggestionAction) {
            suggestionAction.addEventListener('change', function() {
                updateSuggestionIcon(newSuggestion, this.value);
                updatePreview(); // Update preview when action changes
            });
        }
        
        // Update the suggestion label immediately
        updateSuggestionLabel(newSuggestion);
        
        // Update preview after adding
        setTimeout(updatePreview, 10);
    }
    
    function updateSuggestionLabel(suggestionElement) {
        const index = suggestionElement.getAttribute('data-suggestion-index');
        const actionSelect = suggestionElement.querySelector('.suggestion-action');
        const action = actionSelect ? actionSelect.value : 'Reply';
        
        const label = suggestionElement.querySelector('.suggestion-label');
        const icon = getActionIcon(action);
        const iconClass = getActionIconClass(action);
        
        if (label) {
            label.innerHTML = `
                <div class="suggestion-type-icon ${iconClass}">
                    <i class="${icon}"></i>
                </div>
                Suggestion ${index} - ${action}
            `;
        }
    }
    
    function updateSuggestionIcon(suggestionElement, action) {
        const iconElement = suggestionElement.querySelector('.suggestion-type-icon i');
        const iconContainer = suggestionElement.querySelector('.suggestion-type-icon');
        
        if (iconElement && iconContainer) {
            const newIcon = getActionIcon(action);
            const newIconClass = getActionIconClass(action);
            
            iconElement.className = newIcon;
            iconContainer.className = `suggestion-type-icon ${newIconClass}`;
            
            // Update the label text
            const label = suggestionElement.querySelector('.suggestion-label');
            const index = suggestionElement.getAttribute('data-suggestion-index');
            
            if (label) {
                label.innerHTML = `
                    <div class="suggestion-type-icon ${newIconClass}">
                        <i class="${newIcon}"></i>
                    </div>
                    Suggestion ${index} - ${action}
                `;
            }
        }
    }
    
    function addSuggestion() {
        suggestionCounter++;
        addSuggestionToForm('Reply', '', suggestionCounter);
    }
    
    async function removeSuggestion(button) {
        const suggestionItem = button.closest('.suggestion-item');
        if (!suggestionItem) return;
        
        const index = suggestionItem.getAttribute('data-suggestion-index');
        const action = suggestionItem.querySelector('.suggestion-action').value;
        
        // Get current theme for SweetAlert2 styling
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        const result = await Swal.fire({
            title: 'Remove Suggestion',
            html: `Are you sure you want to remove <strong>Suggestion ${index} - ${action}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
            customClass: {
                popup: isDarkMode ? 'dark-swal' : '',
                title: isDarkMode ? 'text-light' : '',
                htmlContainer: isDarkMode ? 'text-light' : ''
            },
            buttonsStyling: true
        });
        
        if (result.isConfirmed) {
            suggestionItem.remove();
            renumberSuggestions();
            updatePreview(); // Update preview after removal
            
            // Show success message
            Swal.fire({
                title: 'Removed!',
                text: 'Suggestion has been removed.',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    popup: isDarkMode ? 'dark-swal' : '',
                    title: isDarkMode ? 'text-light' : '',
                    htmlContainer: isDarkMode ? 'text-light' : ''
                }
            });
        }
    }
    
    function renumberSuggestions() {
        const suggestions = document.querySelectorAll('.suggestion-item');
        let newIndex = 1;
        
        suggestions.forEach((item) => {
            item.setAttribute('data-suggestion-index', newIndex);
            
            // Update the index attribute in child elements
            const actionSelect = item.querySelector('.suggestion-action');
            const textInput = item.querySelector('.suggestion-text');
            const removeBtn = item.querySelector('.remove-suggestion-btn');
            
            if (actionSelect) actionSelect.setAttribute('data-index', newIndex);
            if (textInput) textInput.setAttribute('data-index', newIndex);
            if (removeBtn) removeBtn.setAttribute('data-index', newIndex);
            
            // Update the label
            updateSuggestionLabel(item);
            newIndex++;
        });
        
        // Update the global counter
        suggestionCounter = newIndex - 1;
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
        const previewCardTitle = document.getElementById('previewCardTitle');
        const previewButtons = document.getElementById('previewButtons');
        const cardDescription = document.getElementById('cardDescription');
        const cardTitle = document.getElementById('cardTitle');
        
        // Update card title preview
        if (cardTitle && previewCardTitle) {
            previewCardTitle.textContent = cardTitle.value || 'Card Title';
        }
        
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
        
        // Update buttons with icons
        if (previewButtons) {
            previewButtons.innerHTML = '';
            const suggestionItems = document.querySelectorAll('.suggestion-item');
            
            if (suggestionItems.length > 0) {
                suggestionItems.forEach((item) => {
                    const textInput = item.querySelector('.suggestion-text');
                    const actionSelect = item.querySelector('.suggestion-action');
                    
                    if (textInput && textInput.value.trim() && actionSelect) {
                        const action = actionSelect.value;
                        const text = textInput.value;
                        const buttonClass = getButtonClass(action);
                        const buttonIcon = getButtonIcon(action);
                        
                        const button = document.createElement('button');
                        button.className = `btn btn-sm ${buttonClass}`;
                        button.type = 'button';
                        button.innerHTML = `<i class="${buttonIcon} me-1"></i>${text}`;
                        previewButtons.appendChild(button);
                    }
                });
            }
            
            // Only show sample if there are no suggestions at all
            if (previewButtons.children.length === 0) {
                const button1 = document.createElement('button');
                button1.className = 'btn btn-sm btn-outline-primary';
                button1.type = 'button';
                button1.innerHTML = '<i class="fas fa-external-link-alt me-1"></i>Visit Store';
                previewButtons.appendChild(button1);
                
                const button2 = document.createElement('button');
                button2.className = 'btn btn-sm btn-outline-success';
                button2.type = 'button';
                button2.innerHTML = '<i class="fas fa-phone me-1"></i>Call Support';
                previewButtons.appendChild(button2);
            }
            
            // Update button grid layout
            if (previewButtons.children.length === 1) {
                previewButtons.className = 'd-flex justify-content-center';
            } else {
                previewButtons.className = 'd-grid gap-2';
            }
        }
        
        // Log for debugging
        console.log(`Preview updated. Suggestions found: ${document.querySelectorAll('.suggestion-item').length}`);
    }
    
    async function handleSaveTemplate() {
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
        
        // Get current theme for SweetAlert2 styling
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Check if we're in edit mode
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('id');
        const isEditMode = templateId !== null;
        
        const result = await Swal.fire({
            title: isEditMode ? 'Update Template' : 'Save Template',
            html: isEditMode 
                ? `Are you sure you want to update template <strong>"${templateName}"</strong>?`
                : `Are you sure you want to save template <strong>"${templateName}"</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: isEditMode ? 'Yes, update it!' : 'Yes, save it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
            customClass: {
                popup: isDarkMode ? 'dark-swal' : '',
                title: isDarkMode ? 'text-light' : '',
                htmlContainer: isDarkMode ? 'text-light' : ''
            },
            buttonsStyling: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve) => {
                    // Simulate form data collection
                    setTimeout(() => {
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
                                templateData.suggestions.push({ 
                                    action, 
                                    text,
                                    icon: getActionIcon(action),
                                    iconClass: getActionIconClass(action),
                                    buttonClass: getButtonClass(action),
                                    buttonIcon: getButtonIcon(action)
                                });
                            }
                        });
                        
                        resolve(templateData);
                    }, 1000);
                });
            }
        });
        
        if (result.isConfirmed) {
            // Show loading
            const originalText = saveTemplateBtn.innerHTML;
            saveTemplateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Saving...';
            saveTemplateBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                saveTemplateBtn.innerHTML = originalText;
                saveTemplateBtn.disabled = false;
                
                // Show success message
                Swal.fire({
                    title: isEditMode ? 'Updated!' : 'Saved!',
                    html: isEditMode
                        ? `Template <strong>"${templateName}"</strong> has been updated successfully!`
                        : `Template <strong>"${templateName}"</strong> has been added successfully!`,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: isDarkMode ? 'dark-swal' : '',
                        title: isDarkMode ? 'text-light' : '',
                        htmlContainer: isDarkMode ? 'text-light' : ''
                    }
                });
                
                // Redirect back to template list after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'template.html';
                }, 1500);
            }, 1000);
        }
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
            
            // Determine toast class based on type
            let toastClass = 'text-bg-info';
            let icon = 'info-circle';
            
            switch(type) {
                case 'success':
                    toastClass = 'text-bg-success';
                    icon = 'check-circle';
                    break;
                case 'warning':
                    toastClass = 'text-bg-warning';
                    icon = 'exclamation-triangle';
                    break;
                case 'error':
                case 'danger':
                    toastClass = 'text-bg-danger';
                    icon = 'times-circle';
                    break;
            }
            
            const toastHtml = `
                <div class="toast align-items-center ${toastClass} border-0" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center">
                            <i class="fas fa-${icon} me-2"></i>
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
        } else if (typeof Swal !== 'undefined') {
            // Use SweetAlert2 as fallback
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            Swal.fire({
                title: type.charAt(0).toUpperCase() + type.slice(1),
                text: message,
                icon: type,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    popup: isDarkMode ? 'dark-swal' : '',
                    title: isDarkMode ? 'text-light' : '',
                    htmlContainer: isDarkMode ? 'text-light' : ''
                }
            });
        } else {
            // Fallback to alert
            alert(message);
        }
    }
});