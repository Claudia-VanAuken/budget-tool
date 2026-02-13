/**
 * Family Finance Dashboard - Core Engine
 * Logic: Global State -> User Input -> State Update -> UI Sync -> Storage
 */

// --- 1. GLOBAL STATE ---
let currentBalance = 0;
let transactions = []; 
let categories = ["Food", "Bills", "General"];
let myPieChart = null; 

// Master Sync Function
function syncApp() {
    saveToLocalStorage();
    renderTransactionHistory();
    updateBalanceDisplay();
    renderChart();
}

// --- 2. CORE LOGIC ---

function addExpense() {
    // Read from expense modal inputs (or fall back to inline inputs if present)
    const nameInput = document.getElementById('expense-name-modal') || document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount-modal') || document.getElementById('expense-amount');
    const categoryDropdown = document.getElementById('expense-category-modal') || document.getElementById('category-dropdown');

    if (!nameInput || !amountInput) return;

    const cost = Number(amountInput.value);
    const category = categoryDropdown && categoryDropdown.value ? categoryDropdown.value : "General";

    if (cost > 0 && nameInput.value.trim() !== "") {
        transactions.push({
            id: Date.now(),
            name: nameInput.value.trim(),
            amount: cost,
            category: category,
            type: 'expense'
        });
        currentBalance -= cost;
        syncApp();
        nameInput.value = "";
        amountInput.value = "";
        // Close modal if it was used
        const modal = document.getElementById('expense-modal');
        if (modal && modal.style.display === 'flex') toggleExpenseModal();
    } else {
        alert('Please enter an item name and a valid amount');
    }
}

function toggleIncomeModal() {
    const modal = document.getElementById('income-modal');
    modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
}

function saveIncome() {
    const name = document.getElementById('income-name').value;
    const amount = Number(document.getElementById('income-amount').value);
    const category = document.getElementById('income-category').value;

    if (amount > 0 && name.trim() !== "") {
        transactions.push({
            id: Date.now(),
            name: name,
            amount: amount,
            category: category,
            type: 'income'
        });

        currentBalance += amount; // Increases my total balance
        syncApp(); // Re-renders the chart and list
        
        // Reset and close
        document.getElementById('income-name').value = "";
        document.getElementById('income-amount').value = "";
        toggleIncomeModal();
    } else {
        alert("Please enter a name and a valid amount!");
    }
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    // Recalculate balance from current array
    currentBalance = transactions.reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
    syncApp();
}

// --- 3. UI RENDERING ---

function updateBalanceDisplay() {
    const display = document.getElementById('balance-display');
    if (display) display.textContent = `$${currentBalance.toFixed(2)}`;
}

function renderTransactionHistory() {
    const list = document.getElementById('expense-list');
    if (!list) return;
    list.innerHTML = "";

    transactions.forEach(t => {
        const li = document.createElement('li');
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.padding = "10px";
        li.style.marginBottom = "5px";
        li.style.borderRadius = "8px";
        li.style.background = "rgba(255,255,255,0.1)";
        li.style.borderLeft = t.type === 'income' ? "5px solid #2ecc71" : "5px solid #ff4d4d";
        
        li.innerHTML = `
            <span>[${t.category}] ${t.name}: ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}</span>
            <button onclick="deleteTransaction(${t.id})" style="background:none !important; border:none !important; color:#ff4d4d; cursor:pointer; font-size:18px;">&times;</button>
        `;
        list.appendChild(li);
    });
}

function renderCategoryDropdown() {
    const dropdown = document.getElementById('category-dropdown');
    // Update main expense dropdown
    if (dropdown) {
        dropdown.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            dropdown.appendChild(opt);
        });
    }
    // Also update income modal category select if present
    const incomeSelect = document.getElementById('income-category');
    if (incomeSelect) {
        incomeSelect.innerHTML = '';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            incomeSelect.appendChild(opt);
        });
    }
    // Also update expense modal category select if present
    const expenseSelect = document.getElementById('expense-category-modal');
    if (expenseSelect) {
        expenseSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select Category';
        expenseSelect.appendChild(placeholder);
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            expenseSelect.appendChild(opt);
        });
    }
}

function createNewCategory() {
    const input = document.getElementById('new-category-name');
    const name = input.value.trim();
    if (name && !categories.includes(name)) {
        categories.push(name);
        renderCategoryDropdown();
        saveToLocalStorage();
        input.value = "";
    }
}

// Toggle and save handlers for the category modal
function toggleCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (!modal) return;
    modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
}

function saveCategory() {
    const input = document.getElementById('category-name-modal');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { alert('Enter a category name'); return; }
    if (!categories.includes(name)) {
        categories.push(name);
        renderCategoryDropdown();
        saveToLocalStorage();
    }
    input.value = '';
    toggleCategoryModal();
}

function toggleModal() {
    const modal = document.getElementById('income-modal');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

function toggleExpenseModal() {
    const modal = document.getElementById('expense-modal');
    if (!modal) return;
    modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
}

// --- 4. CHART & DATA ---

function getCategoryTotals() {
    const totals = {};
    categories.forEach(cat => totals[cat] = 0);
    transactions.forEach(t => {
        if (t.type === 'expense' && totals[t.category] !== undefined) {
            totals[t.category] += t.amount;
        }
    });
    return Object.values(totals);
}

function renderChart() {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (myPieChart) myPieChart.destroy();

    myPieChart = new Chart(ctx, {
        type: 'pie',
        plugins: [ChartDataLabels],
        data: {
            labels: categories,
            datasets: [{
                data: getCategoryTotals(),
                // Sunset/Meadow Palette
                backgroundColor: ['#ff85a1', '#ffc3a0', '#95e1d3', '#eaffd0', '#fce38a'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { bottom: 30 } },
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { color: 'white', padding: 15 } 
                },
                datalabels: {
                    color: 'white',
                    font: { weight: 'bold', size: 14 },
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => sum += data);
                        return sum === 0 ? "" : (value * 100 / sum).toFixed(1) + "%";
                    }
                }
            }
        }
    });
}

// --- 5. PERSISTENCE ---

function saveToLocalStorage() {
    localStorage.setItem('totalBalance', currentBalance);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
}

function loadAllData() {
    const b = localStorage.getItem('totalBalance');
    const t = localStorage.getItem('transactions');
    const c = localStorage.getItem('budgetCategories');

    if (b) currentBalance = parseFloat(b);
    if (t) transactions = JSON.parse(t);
    if (c) categories = JSON.parse(c);

    renderCategoryDropdown();
    syncApp();
}

function clearData() {
    if (confirm("Reset everything?")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = loadAllData;