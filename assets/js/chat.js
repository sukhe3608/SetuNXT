class Chat {
    constructor() {
        this.mockContacts = [
            { id: 1, name: 'John Smith', initials: 'JS', color: 'bg-primary', lastMsg: 'Looking forward to the campaign...', time: '10:42 AM', unread: true, timestamp: Date.now() - 3600000, isMe: false },
            { id: 2, name: 'Alice Doe', initials: 'AD', color: 'bg-info', lastMsg: 'Can we change the target?', time: 'Yesterday', unread: false, timestamp: Date.now() - 86400000, isMe: false },
            { id: 3, name: 'Marketing Team', initials: 'MT', color: 'bg-success', lastMsg: 'The new assets are ready.', time: 'Monday', unread: true, timestamp: Date.now() - 172800000, isMe: false },
            { id: 4, name: 'My Notes (Me)', initials: 'ME', color: 'bg-secondary', lastMsg: 'Don\'t forget to check the bounce rate.', time: '10:00 AM', unread: false, timestamp: Date.now() - 7200000, isMe: true },
            { id: 5, name: 'Bob Johnson', initials: 'BJ', color: 'bg-warning', lastMsg: 'Approved.', time: '1:00 PM', unread: false, timestamp: Date.now() - 5400000, isMe: false }
        ];

        this.currentTab = 'all'; // all, unread, me
        this.sortDesc = true; // true = latest first
        this.searchTerm = '';
        this.currentContact = null;
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderContacts();
    }

    cacheDOM() {
        this.chatInput = document.getElementById('chatInput');
        this.chatSendBtn = document.getElementById('chatSendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatContactList = document.getElementById('chatContactList');
        
        // Header
        this.currentContactAvatar = document.getElementById('currentContactAvatar');
        this.currentContactInfo = document.getElementById('currentContactInfo');
        this.currentContactName = document.getElementById('currentContactName');
        this.chatHeaderPlaceholder = document.getElementById('chatHeaderPlaceholder');
        this.currentContactActions = document.getElementById('currentContactActions');
        
        // Input Area
        this.chatInputArea = document.getElementById('chatInputArea');
        this.emptyChatState = document.getElementById('emptyChatState');
        
        // Search & Filters
        this.searchToggleBtn = document.getElementById('chatContactSearchToggleBtn');
        this.searchBar = document.getElementById('chatContactSearchBar');
        this.searchInput = document.getElementById('chatContactSearchInput');
        this.sortBtn = document.getElementById('chatContactSortBtn');
        this.tabs = document.querySelectorAll('#chatSidebarTabs .nav-link');
        
        // Message Search
        this.chatSearchBtn = document.getElementById('chatSearchBtn');
        this.chatSearchBar = document.getElementById('chatSearchBar');
        this.chatSearchCloseBtn = document.getElementById('chatSearchCloseBtn');
        this.chatSearchInput = document.getElementById('chatSearchInput');
        
        // Emojis and Attachments
        this.emojiPicker = document.getElementById('emojiPicker');
        this.chatSmileBtn = document.getElementById('chatSmileBtn');
        this.chatAttachBtn = document.getElementById('chatAttachBtn');
        this.chatFileInput = document.getElementById('chatFileInput');
    }

    bindEvents() {
        if (!this.chatInput || !this.chatSendBtn) return;

        // Send message
        this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Contact Search
        if (this.searchToggleBtn && this.searchBar && this.searchInput) {
            this.searchToggleBtn.addEventListener('click', () => {
                this.searchBar.classList.toggle('d-none');
                if (!this.searchBar.classList.contains('d-none')) {
                    this.searchInput.focus();
                } else {
                    this.searchTerm = '';
                    this.searchInput.value = '';
                    this.renderContacts();
                }
            });
            this.searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderContacts();
            });
        }

        // Contact Sort
        if (this.sortBtn) {
            this.sortBtn.addEventListener('click', () => {
                this.sortDesc = !this.sortDesc;
                this.sortBtn.innerHTML = this.sortDesc ? '<i class="fas fa-sort-amount-down"></i>' : '<i class="fas fa-sort-amount-up"></i>';
                this.renderContacts();
            });
        }

        // Tabs
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTab = e.target.dataset.chatTab;
                this.renderContacts();
            });
        });

        // Emojis
        if (this.chatSmileBtn && this.emojiPicker) {
            this.chatSmileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.emojiPicker.classList.toggle('d-none');
            });
            document.addEventListener('click', (e) => {
                if (!this.emojiPicker.contains(e.target) && e.target !== this.chatSmileBtn) {
                    this.emojiPicker.classList.add('d-none');
                }
            });
            this.emojiPicker.addEventListener('emoji-click', event => {
                this.chatInput.value += event.detail.unicode;
                this.chatInput.focus();
            });
        }

        // Attachments
        if (this.chatAttachBtn && this.chatFileInput) {
            this.chatAttachBtn.addEventListener('click', () => {
                this.chatFileInput.click();
            });
            this.chatFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const fileName = e.target.files[0].name;
                    this.sendAttachmentMessage(fileName);
                    this.chatFileInput.value = '';
                }
            });
        }

        // Message Search
        if (this.chatSearchBtn && this.chatSearchBar && this.chatSearchCloseBtn && this.chatSearchInput) {
            this.chatSearchBtn.addEventListener('click', () => {
                this.chatSearchBar.classList.toggle('d-none');
                if (!this.chatSearchBar.classList.contains('d-none')) {
                    this.chatSearchInput.focus();
                } else {
                    this.chatSearchInput.value = '';
                    this.chatSearchInput.dispatchEvent(new Event('input'));
                }
            });
            this.chatSearchCloseBtn.addEventListener('click', () => {
                this.chatSearchBar.classList.add('d-none');
                this.chatSearchInput.value = '';
                this.chatSearchInput.dispatchEvent(new Event('input'));
            });
            this.chatSearchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const messages = this.chatMessages.querySelectorAll('.message');
                messages.forEach(msg => {
                    const text = msg.querySelector('.message-content').textContent.toLowerCase();
                    if (text.includes(term)) {
                        msg.style.display = '';
                    } else {
                        msg.style.display = 'none';
                    }
                });
            });
        }
        
        // Mobile Back Button (if we add it later to chat header)
        const backBtn = document.getElementById('chatBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                document.querySelector('.chat-main').classList.remove('active');
            });
        }
    }

    renderContacts() {
        if (!this.chatContactList) return;

        let filtered = this.mockContacts.filter(c => {
            if (this.currentTab === 'unread' && !c.unread) return false;
            if (this.currentTab === 'me' && !c.isMe) return false;
            if (this.searchTerm && !c.name.toLowerCase().includes(this.searchTerm)) return false;
            return true;
        });

        filtered.sort((a, b) => this.sortDesc ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);

        this.chatContactList.innerHTML = '';
        
        if (filtered.length === 0) {
            this.chatContactList.innerHTML = '<div class="p-3 text-center text-muted"><small>No contacts found.</small></div>';
            return;
        }

        filtered.forEach((contact, index) => {
            const div = document.createElement('div');
            // If there's a currently selected contact, highlight it
            const isActive = this.currentContact && this.currentContact.id === contact.id;
            
            div.className = `chat-contact ${isActive ? 'active' : ''}`;
            div.innerHTML = `
                <div class="contact-avatar ${contact.color} text-white">${contact.initials}</div>
                <div class="contact-info">
                    <h6>${contact.name}</h6>
                    <p>${contact.unread ? '<strong>' + contact.lastMsg + '</strong>' : contact.lastMsg}</p>
                </div>
                <div class="contact-time">${contact.time}</div>
            `;

            div.addEventListener('click', () => {
                this.selectContact(contact, div);
            });

            this.chatContactList.appendChild(div);
        });
    }

    selectContact(contact, contactElement) {
        this.currentContact = contact;
        
        // Update active class
        document.querySelectorAll('.chat-contact').forEach(c => c.classList.remove('active'));
        if (contactElement) {
            contactElement.classList.add('active');
        }

        // Update header
        if (this.currentContactAvatar) {
            this.currentContactAvatar.textContent = contact.initials;
            this.currentContactAvatar.className = `contact-avatar ${contact.color} text-white`;
            this.currentContactAvatar.classList.remove('d-none');
        }
        
        if (this.currentContactInfo && this.currentContactName) {
            this.currentContactName.textContent = contact.name;
            this.currentContactInfo.classList.remove('d-none');
        }
        
        if (this.chatHeaderPlaceholder) this.chatHeaderPlaceholder.classList.add('d-none');
        if (this.currentContactActions) this.currentContactActions.classList.remove('d-none');
        
        // Update UI
        if (this.emptyChatState) this.emptyChatState.classList.add('d-none');
        if (this.chatInputArea) this.chatInputArea.classList.remove('d-none');
        
        // Show chat on mobile
        const chatMain = document.querySelector('.chat-main');
        if (chatMain) {
            chatMain.classList.add('active');
        }

        // Mock loading messages
        this.chatMessages.innerHTML = '';
        
        // Add some mock messages based on contact
        setTimeout(() => {
            const today = new Date().toLocaleDateString();
            
            this.chatMessages.innerHTML = `
                <div class="text-center my-3"><small class="text-muted bg-white px-3 py-1 rounded-pill shadow-sm">${today}</small></div>
                <div class="message received">
                    <div class="message-content">Hello! How are things going with the latest campaign?</div>
                    <div class="message-time">09:45 AM</div>
                </div>
                <div class="message sent">
                    <div class="message-content">Hi ${contact.name.split(' ')[0]}, things are going well. We launched it an hour ago.</div>
                    <div class="message-time">10:30 AM</div>
                </div>
                <div class="message received">
                    <div class="message-content">${contact.lastMsg}</div>
                    <div class="message-time">${contact.time.includes('AM') || contact.time.includes('PM') ? contact.time : '10:45 AM'}</div>
                </div>
            `;
            this.scrollToBottom();
        }, 100);
    }

    sendMessage() {
        const messageText = this.chatInput.value.trim();
        if (messageText === '' || !this.currentContact) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHTML(messageText)}</div>
            <div class="message-time">${timeString}</div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.chatInput.value = '';
        this.scrollToBottom();

        // Simulate reply after 1-2 seconds
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'message received';
            const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            replyDiv.innerHTML = `
                <div class="message-content">Thanks for the update. I'll review it and get back to you shortly.</div>
                <div class="message-time">${replyTime}</div>
            `;
            this.chatMessages.appendChild(replyDiv);
            this.scrollToBottom();
        }, 1000 + Math.random() * 1000);
    }

    sendAttachmentMessage(fileName) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="d-flex align-items-center">
                    <div class="bg-white text-primary rounded p-2 me-2">
                        <i class="fas fa-file-alt fa-lg"></i>
                    </div>
                    <div>
                        <strong>${this.escapeHTML(fileName)}</strong>
                        <div class="small opacity-75">Document</div>
                    </div>
                </div>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    // Load theme first
    if (typeof window.ThemeManager === 'function' && !window.themeManager) {
        window.themeManager = new ThemeManager();
    }

    // Initialize chat
    window.chat = new Chat();
    window.chat.init();
});
