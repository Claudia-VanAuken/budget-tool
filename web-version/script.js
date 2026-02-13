// --- GLOBAL STATE ---
let currentBalance = 0;
let categories = ["Food", "Bills", "General"]; // Default categories

// --- CORE LOGIC ---
function updateDisplay() {
    const balanceDisplay = document.getElementById('balance-display');
    if (balanceDisplay) {
        balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
    }
}

function toggleModal() {
    const modal = document.getElementById('income-modal');
    if (modal) {
        modal.style.display = (modal.style.display === "block") ? "none" : "block";
    }
}

// --- INCOME & EXPENSES ---
function setIncome() {
    const incomeInput = document.getElementById('income-input');
    const amount = Number(incomeInput.value);

    if (amount > 0) {
        currentBalance += amount;
        
        // --- History Tracking ---
        const list = document.getElementById('expense-list');
        const listItem = document.createElement('li');
        listItem.textContent = `Income Added: +$${amount.toFixed(2)}`;
        listItem.style.borderLeft = "5px solid #28a745"; // Green stripe for income
        list.appendChild(listItem);
        // -------------------------------

        updateDisplay();
        saveToLocalStorage();
        incomeInput.value = "";
        toggleModal();
    }
}

function addExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const categoryDropdown = document.getElementById('category-dropdown');
    const list = document.getElementById('expense-list');
    
    const cost = Number(amountInput.value);
    const selectedCategory = categoryDropdown.value || "General";
    
    if (cost > 0) {
        currentBalance -= cost;
        
        const listItem = document.createElement('li');
        listItem.textContent = `[${selectedCategory}] ${nameInput.value}: -$${cost.toFixed(2)}`;
        list.appendChild(listItem);

        nameInput.value = "";
        amountInput.value = "";
        listItem.style.borderLeft = "5px solid #dc3545"; // Red stripe for expenses
        updateDisplay();
        saveToLocalStorage();
    }
}

// --- CATEGORY MANAGEMENT ---
function createNewCategory() {
    const input = document.getElementById('new-category-name');
    const name = input.value.trim();

    if (name && !categories.includes(name)) {
        categories.push(name);
        renderCategoryDropdown();
        saveToLocalStorage(); // Save categories along with everything else
        input.value = "";
    }
}

function renderCategoryDropdown() {
    const dropdown = document.getElementById('category-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        dropdown.appendChild(option);
    });
}

// --- STORAGE & INITIALIZATION ---
function saveToLocalStorage() {
    localStorage.setItem('totalBalance', currentBalance);
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
    
    const list = document.getElementById('expense-list');
    if (list) {
        localStorage.setItem('TransactionHistory', list.innerHTML);
    }
}

function loadAllData() {
    // Load Balance
    const savedBalance = localStorage.getItem('totalBalance');
    if (savedBalance !== null) {
        currentBalance = parseFloat(savedBalance);
        updateDisplay();
    }

    // Load Categories
    const savedCats = localStorage.getItem('budgetCategories');
    if (savedCats) {
        categories = JSON.parse(savedCats);
    }
    renderCategoryDropdown();

    // Load History
    const savedHistory = localStorage.getItem('TransactionHistory');
    const list = document.getElementById('expense-list');
    if (savedHistory && list) {
        list.innerHTML = savedHistory;
    }
}

function clearData() {
    if (confirm("Wipe all data?")) {
        localStorage.clear();
        location.reload(); // Refresh the page to reset everything
    }
}

// START THE APP
loadAllData();