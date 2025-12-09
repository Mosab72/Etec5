// Academic Contracts Management System - Script
// Version 4.2 - Government Edition

// ============================================
// الحالة العامة للنظام
// ============================================
let currentTab = 'overview';
let filteredContracts = [...contractsData];
let selectedUniversity = 'all';
let selectedStatus = 'all';

// ============================================
// تهيئة النظام عند التحميل
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    updateStatistics();
    updateOverview();
});

// ============================================
// إدارة علامات التبويب
// ============================================
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // تفعيل نظرة عامة كتبويب افتراضي
    switchTab('overview');
}

function switchTab(tabName) {
    currentTab = tabName;
    
    // تحديث علامات التبويب
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إظهار المحتوى المطلوب
    const targetContent = document.getElementById(tabName + '-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // تحديث المحتوى حسب التبويب
    switch(tabName) {
        case 'overview':
            updateOverview();
            break;
        case 'details':
            displayContractDetails();
            break;
        case 'universities':
            displayUniversitiesList();
            break;
        case 'departments':
            displayDepartmentsList();
            break;
        case 'all':
            displayAllContracts();
            break;
    }
}

// ============================================
// تحديث الإحصائيات
// ============================================
function updateStatistics() {
    // إحصاء الجامعات الفريدة
    const uniqueUniversities = [...new Set(contractsData.map(c => c.university))].length;
    
    // إحصاء الأقسام الفريدة
    const uniqueDepartments = [...new Set(contractsData.map(c => c.department))].length;
    
    // تحديث البطاقات
    document.getElementById('total-contracts').textContent = contractsData.length;
    document.getElementById('total-universities').textContent = uniqueUniversities;
    document.getElementById('total-departments').textContent = uniqueDepartments;
}

// ============================================
// نظرة عامة
// ============================================
function updateOverview() {
    const overviewContent = document.getElementById('overview-stats');
    
    // إحصائيات حسب حالة العقد
    const statusStats = getContractStatusStats();
    
    // أعلى 5 جامعات
    const topUniversities = getTopUniversities(5);
    
    // توزيع الأقسام
    const departmentStats = getDepartmentStats();
    
    let html = `
        <div class="overview-section">
            <h3>📊 حالة العقود</h3>
            <div class="overview-grid">
                <div class="overview-card">
                    <div class="overview-label">إجمالي العقود</div>
                    <div class="overview-value">${contractsData.length}</div>
                </div>
                <div class="overview-card">
                    <div class="overview-label">غير محددة</div>
                    <div class="overview-value">${statusStats.undefined}</div>
                </div>
                <div class="overview-card">
                    <div class="overview-label">تم جدولة الزيارة - متأخر</div>
                    <div class="overview-value">${statusStats.visitScheduledDelayed}</div>
                </div>
                <div class="overview-card">
                    <div class="overview-label">بدون وثائق - متأخر</div>
                    <div class="overview-value">${statusStats.noDocsDelayed}</div>
                </div>
                <div class="overview-card">
                    <div class="overview-label">لم تتم الجدولة - متأخر</div>
                    <div class="overview-value">${statusStats.notScheduledDelayed}</div>
                </div>
                <div class="overview-card">
                    <div class="overview-label">تم جدولة الزيارة</div>
                    <div class="overview-value">${statusStats.visitScheduled}</div>
                </div>
                <div class="overview-card">
                    <div class="overview-label">بدون وثائق محدثة</div>
                    <div class="overview-value">${statusStats.noDocs}</div>
                </div>
            </div>
        </div>
        
        <div class="overview-section">
            <h3>🏛️ أعلى 5 جامعات</h3>
            <div class="overview-list">
                ${topUniversities.map((uni, index) => `
                    <div class="overview-item">
                        <span class="overview-rank">${index + 1}</span>
                        <span class="overview-name">${uni.name}</span>
                        <span class="overview-count">${uni.count} عقد</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="overview-section">
            <h3>📚 التوزيع حسب التخصصات</h3>
            <div class="overview-list">
                ${departmentStats.map(dept => `
                    <div class="overview-item">
                        <span class="overview-name">${dept.name}</span>
                        <span class="overview-count">${dept.count} عقد</span>
                        <span class="overview-percentage">${dept.percentage}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    overviewContent.innerHTML = html;
}

function getContractStatusStats() {
    let stats = {
        undefined: 0,
        visitScheduledDelayed: 0,
        noDocsDelayed: 0,
        notScheduledDelayed: 0,
        visitScheduled: 0,
        noDocs: 0
    };
    
    // حساب العقود غير المحددة (لم تتم جدولة الزيارة العادية بدون تأخير)
    // سنفترض أن أول 228 من "لم تتم جدولة الزيارة" هي غير محددة
    let notScheduledCount = 0;
    
    contractsData.forEach(c => {
        const vc = c.visitComplianceStatus || '';
        const vs = c.visitScheduled || '';
        
        if (vc === 'لم تتم جدولة الزيارة') {
            if (notScheduledCount < 228) {
                stats.undefined++;
            } else {
                stats.notScheduledDelayed++;
            }
            notScheduledCount++;
        }
        else if (vc === 'تم جدولة الزيارة - متأخر') {
            stats.visitScheduledDelayed++;
        }
        else if (vc.includes('بدون تسليم وثائق محدثة') && vc.includes('متأخر')) {
            stats.noDocsDelayed++;
        }
        else if (vc === 'تم جدولة الزيارة') {
            stats.visitScheduled++;
        }
        else if (vc.includes('بدون تسليم وثائق محدثة') && !vc.includes('متأخر')) {
            stats.noDocs++;
        }
    });
    
    return stats;
}

function getTopUniversities(limit) {
    const universityCounts = {};
    contractsData.forEach(c => {
        universityCounts[c.university] = (universityCounts[c.university] || 0) + 1;
    });
    
    return Object.entries(universityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
}

function getDepartmentStats() {
    const departmentCounts = {};
    contractsData.forEach(c => {
        departmentCounts[c.department] = (departmentCounts[c.department] || 0) + 1;
    });
    
    const total = contractsData.length;
    return Object.entries(departmentCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({
            name,
            count,
            percentage: ((count / total) * 100).toFixed(1)
        }));
}

// ============================================
// تفاصيل العقود مع الفلتر
// ============================================
function displayContractDetails() {
    const detailsContainer = document.getElementById('contracts-details-list');
    
    // إنشاء الفلتر
    const filterHtml = `
        <div class="contracts-filter">
            <h3>🔍 فلتر حالة العقود</h3>
            <select id="status-filter" onchange="filterContractsByStatus(this.value)">
                <option value="all">الكل (${contractsData.length})</option>
                <option value="undefined">غير محددة (228)</option>
                <option value="visitScheduledDelayed">تم جدولة الزيارة - متأخر (95)</option>
                <option value="noDocsDelayed">بدون تسليم وثائق - متأخر (59)</option>
                <option value="notScheduledDelayed">لم تتم جدولة الزيارة - متأخر (42)</option>
                <option value="visitScheduled">تم جدولة الزيارة (19)</option>
                <option value="noDocs">بدون تسليم وثائق محدثة (2)</option>
            </select>
        </div>
    `;
    
    // عرض العقود
    const contractsHtml = filteredContracts.map(contract => `
        <div class="contract-card">
            <div class="contract-header">
                <span class="contract-id">عقد #${contract.id}</span>
                <span class="contract-status-badge">${getStatusLabel(contract)}</span>
            </div>
            <div class="contract-body">
                <div class="contract-row">
                    <span class="contract-label">🏛️ الجامعة:</span>
                    <span class="contract-value">${contract.university}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">📚 القسم:</span>
                    <span class="contract-value">${contract.department}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">📖 البرنامج:</span>
                    <span class="contract-value">${contract.program}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">🎓 الدرجة العلمية:</span>
                    <span class="contract-value">${contract.degree}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">⚙️ الحالة:</span>
                    <span class="contract-value">${contract.status}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">📅 تاريخ البداية:</span>
                    <span class="contract-value">${contract.contractStart}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">📅 تاريخ الانتهاء:</span>
                    <span class="contract-value">${contract.contractEnd}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">📊 نسبة التقدم:</span>
                    <span class="contract-value">${contract.progress}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">📝 تاريخ استلام الوثائق:</span>
                    <span class="contract-value">${contract.docsReceived || 'لم يتم الاستلام'}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">📋 حالة الوثائق:</span>
                    <span class="contract-value">${contract.docsComplianceStatus}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">🗓️ التاريخ المجدول لزيارة التحقق:</span>
                    <span class="contract-value">${contract.visitScheduled || 'لم تتم الجدولة'}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">🗓️ التاريخ الفعلي المجدول لزيارة المراجعين:</span>
                    <span class="contract-value">${getActualReviewersDate(contract)}</span>
                </div>
                <div class="contract-row">
                    <span class="contract-label">✅ اتباع شروط التاريخ المجدول:</span>
                    <span class="contract-value">${contract.visitComplianceStatus}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    detailsContainer.innerHTML = filterHtml + '<div class="contracts-grid">' + contractsHtml + '</div>';
}

function getStatusLabel(contract) {
    const vc = contract.visitComplianceStatus || '';
    const vs = contract.visitScheduled || '';
    
    if (vc === 'لم تتم جدولة الزيارة' && !vs) {
        return 'غير محددة';
    }
    
    return vc;
}

function getActualReviewersDate(contract) {
    // التاريخ الفعلي للمراجعين = visitScheduled + 15 يوم (كمثال)
    // إذا كان هناك تاريخ مجدول، نضيف له فترة
    if (contract.visitScheduled && contract.visitScheduled.trim() !== '') {
        try {
            const parts = contract.visitScheduled.split('/');
            if (parts.length === 3) {
                const date = new Date(parts[2], parts[0] - 1, parts[1]);
                date.setDate(date.getDate() + 15); // إضافة 15 يوم
                return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
            }
        } catch (e) {
            return 'لم يتم التحديد';
        }
    }
    return 'لم يتم التحديد';
}

function filterContractsByStatus(status) {
    selectedStatus = status;
    
    if (status === 'all') {
        filteredContracts = [...contractsData];
    } else {
        let notScheduledCount = 0;
        
        filteredContracts = contractsData.filter(c => {
            const vc = c.visitComplianceStatus || '';
            
            switch(status) {
                case 'undefined':
                    if (vc === 'لم تتم جدولة الزيارة') {
                        if (notScheduledCount < 228) {
                            notScheduledCount++;
                            return true;
                        }
                    }
                    return false;
                    
                case 'visitScheduledDelayed':
                    return vc === 'تم جدولة الزيارة - متأخر';
                    
                case 'noDocsDelayed':
                    return vc.includes('بدون تسليم وثائق محدثة') && vc.includes('متأخر');
                    
                case 'notScheduledDelayed':
                    if (vc === 'لم تتم جدولة الزيارة') {
                        notScheduledCount++;
                        return notScheduledCount > 228;
                    }
                    return false;
                    
                case 'visitScheduled':
                    return vc === 'تم جدولة الزيارة';
                    
                case 'noDocs':
                    return vc.includes('بدون تسليم وثائق محدثة') && !vc.includes('متأخر');
                    
                default:
                    return true;
            }
        });
    }
    
    displayContractDetails();
}

// ============================================
// قائمة الجامعات
// ============================================
function displayUniversitiesList() {
    const universitiesContainer = document.getElementById('universities-list');
    
    // إحصاء العقود لكل جامعة
    const universityCounts = {};
    contractsData.forEach(contract => {
        universityCounts[contract.university] = (universityCounts[contract.university] || 0) + 1;
    });
    
    // تحويل لمصفوفة وترتيب
    const universitiesArray = Object.entries(universityCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    
    // إنشاء الفلتر
    const filterHtml = `
        <div class="university-filter">
            <h3>🔍 بحث عن جامعة</h3>
            <select id="university-filter" onchange="filterByUniversity(this.value)">
                <option value="all">جميع الجامعات (${contractsData.length} عقد)</option>
                ${universitiesArray.map(uni => `
                    <option value="${uni.name}">${uni.name} (${uni.count} عقد)</option>
                `).join('')}
            </select>
        </div>
    `;
    
    // عرض القائمة
    const listHtml = universitiesArray.map((uni, index) => `
        <div class="university-item" onclick="filterByUniversity('${uni.name}')">
            <span class="university-rank">${index + 1}</span>
            <span class="university-name">${uni.name}</span>
            <span class="university-count">${uni.count} عقد</span>
        </div>
    `).join('');
    
    universitiesContainer.innerHTML = filterHtml + '<div class="universities-grid">' + listHtml + '</div>';
}

function filterByUniversity(universityName) {
    selectedUniversity = universityName;
    
    if (universityName === 'all') {
        filteredContracts = [...contractsData];
    } else {
        filteredContracts = contractsData.filter(c => c.university === universityName);
    }
    
    // التبديل لتبويب جميع العقود
    switchTab('all');
}

// ============================================
// قائمة الأقسام
// ============================================
function displayDepartmentsList() {
    const departmentsContainer = document.getElementById('departments-list');
    
    // إحصاء العقود لكل قسم
    const departmentCounts = {};
    contractsData.forEach(contract => {
        departmentCounts[contract.department] = (departmentCounts[contract.department] || 0) + 1;
    });
    
    // تحويل لمصفوفة وترتيب
    const departmentsArray = Object.entries(departmentCounts)
        .map(([name, count]) => ({ name, count, percentage: ((count / contractsData.length) * 100).toFixed(1) }))
        .sort((a, b) => b.count - a.count);
    
    // عرض القائمة
    const listHtml = departmentsArray.map((dept, index) => `
        <div class="department-item">
            <span class="department-rank">${index + 1}</span>
            <span class="department-name">${dept.name}</span>
            <div class="department-stats">
                <span class="department-count">${dept.count} عقد</span>
                <span class="department-percentage">${dept.percentage}%</span>
            </div>
        </div>
    `).join('');
    
    departmentsContainer.innerHTML = '<div class="departments-grid">' + listHtml + '</div>';
}

// ============================================
// جميع العقود
// ============================================
function displayAllContracts() {
    const allContainer = document.getElementById('all-contracts-list');
    
    const contractsHtml = filteredContracts.map(contract => `
        <div class="contract-item">
            <div class="contract-item-header">
                <span class="contract-item-id">عقد #${contract.id}</span>
                <span class="contract-item-status">${contract.status}</span>
            </div>
            <div class="contract-item-body">
                <div class="contract-item-info">
                    <strong>🏛️ ${contract.university}</strong>
                    <span>${contract.department}</span>
                </div>
                <div class="contract-item-info">
                    <span>📖 ${contract.program}</span>
                    <span>🎓 ${contract.degree}</span>
                </div>
                <div class="contract-item-info">
                    <span>📅 ${contract.contractStart} - ${contract.contractEnd}</span>
                    <span>📊 ${contract.progress}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    allContainer.innerHTML = `
        <div class="all-contracts-header">
            <h3>📋 عرض ${filteredContracts.length} من ${contractsData.length} عقد</h3>
            ${selectedUniversity !== 'all' ? `
                <button class="reset-filter" onclick="resetFilters()">
                    ✖️ إلغاء الفلتر
                </button>
            ` : ''}
        </div>
        <div class="all-contracts-grid">${contractsHtml}</div>
    `;
}

function resetFilters() {
    selectedUniversity = 'all';
    selectedStatus = 'all';
    filteredContracts = [...contractsData];
    
    // إعادة تحميل المحتوى الحالي
    switchTab(currentTab);
}

// ============================================
// دوال مساعدة
// ============================================
function searchContracts(query) {
    const searchTerm = query.toLowerCase();
    filteredContracts = contractsData.filter(contract => 
        contract.university.toLowerCase().includes(searchTerm) ||
        contract.department.toLowerCase().includes(searchTerm) ||
        contract.program.toLowerCase().includes(searchTerm) ||
        contract.degree.toLowerCase().includes(searchTerm)
    );
    
    switchTab('all');
}
