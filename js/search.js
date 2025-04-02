document.addEventListener('DOMContentLoaded', function() {
    // Create search UI elements
    const messagesContainer = document.getElementById('messages');
    const inputArea = document.querySelector('.input-area');
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search messages...">
        <button id="clearSearch"><i class="fas fa-times"></i></button>
    `;
    
    // Insert search container before messages
    messagesContainer.parentNode.insertBefore(searchContainer, messagesContainer);
    
    // Add event listeners
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', filterMessages);
    clearButton.addEventListener('click', clearSearch);
    
    // Filter messages based on search input
    function filterMessages() {
        const searchTerm = searchInput.value.toLowerCase();
        const messages = document.querySelectorAll('.message');
        let matchCount = 0;
        
        messages.forEach(message => {
            const author = message.querySelector('.message-author').textContent.toLowerCase();
            const content = message.querySelector('.message-content').textContent.toLowerCase();
            
            if (author.includes(searchTerm) || content.includes(searchTerm)) {
                message.style.display = 'block';
                message.classList.add('search-match');
                matchCount++;
            } else {
                message.style.display = 'none';
                message.classList.remove('search-match');
            }
        });
        
        // Update UI to show search results
        updateSearchStatus(matchCount, searchTerm);
    }
    
    // Clear the search
    function clearSearch() {
        searchInput.value = '';
        
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            message.style.display = 'block';
            message.classList.remove('search-match');
        });
        
        // Remove search status
        const statusElement = document.getElementById('searchStatus');
        if (statusElement) statusElement.remove();
    }
    
    // Update search status indicator
    function updateSearchStatus(count, term) {
        let statusElement = document.getElementById('searchStatus');
        
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'searchStatus';
            searchContainer.appendChild(statusElement);
        }
        
        if (term) {
            statusElement.textContent = `Found ${count} message(s) matching "${term}"`;
            statusElement.style.display = 'block';
        } else {
            statusElement.style.display = 'none';
        }
    }
    
    // Create observer to handle new messages being added
    const observer = new MutationObserver(mutations => {
        if (searchInput.value.trim() !== '') {
            filterMessages();
        }
    });
    
    // Start observing the messages container
    observer.observe(messagesContainer, { childList: true });
});