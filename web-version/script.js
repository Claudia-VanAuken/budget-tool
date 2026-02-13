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


    let transactions = []; // Our master data list

function addExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const categoryDropdown = document.getElementById('category-dropdown');
    
    const cost = Number(amountInput.value);
    const category = categoryDropdown.value || "General";

    if (cost > 0 && nameInput.value.trim() !== "") {
        // 1. Create the Transaction Object
        const newTransaction = {
            id: Date.now(), // Unique timestamp ID
            name: nameInput.value,
            amount: cost,
            category: category,
            type: 'expense'
        };

        // 2. Add to the array and update balance
        transactions.push(newTransaction);
        currentBalance -= cost;

        // 3. Update UI and Save
        updateDisplay();
        renderTransactionHistory(); // We'll build this below
        saveToLocalStorage();
        
        // 4. Clear inputs
        nameInput.value = "";
        amountInput.value = "";
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
    // Convert our array of objects into a JSON string
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
}

function loadAllData() {
    const savedBalance = localStorage.getItem('totalBalance');
    if (savedBalance !== null) {
        currentBalance = parseFloat(savedBalance);
        updateDisplay();
    }

    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        // Convert the string back into a real Array of Objects
        transactions = JSON.parse(savedTransactions);
        renderTransactionHistory();
    }

    const savedCats = localStorage.getItem('budgetCategories');
    if (savedCats) {
        categories = JSON.parse(savedCats);
        renderCategoryDropdown();
    }
}

function clearData() {
    if (confirm("Wipe all data?")) {
        localStorage.clear();
        location.reload(); // Refresh the page to reset everything
    }
}

function renderTransactionHistory() {
    const list = document.getElementById('expense-list');
    list.innerHTML = ""; // Clear current list

    transactions.forEach(t => {
        const listItem = document.createElement('li');
        listItem.textContent = `[${t.category}] ${t.name}: ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}`;
        
        if (t.type === 'income') {
            listItem.style.borderLeft = "5px solid #28a745";
        }
        
        list.appendChild(listItem);
    });
}

// START THE APP
loadAllData();