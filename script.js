// نظام إدارة عقود الاعتماد الأكاديمي
// تاريخ الإنشاء: 2025-12-09
// الإصدار: 6.1 (مع فلتر نسبة التقدم)

// البيانات الإحصائية
const universities = [
    { name: "جامعة الملك عبد العزيز", count: 83, rank: 1 },
    { name: "جامعة طيبة", count: 39, rank: 2 },
    { name: "جامعة الإمام عبد الرحمن بن فيصل", count: 36, rank: 3 },
    { name: "جامعة الملك سعود", count: 30, rank: 4 },
    { name: "جامعة جدة", count: 28, rank: 5 },
    { name: "جامعة حفر الباطن", count: 26, rank: 6 },
    { name: "جامعة الطائف", count: 23, rank: 7 },
    { name: "جامعة الملك فيصل", count: 22, rank: 8 },
    { name: "جامعة القصيم", count: 18, rank: 9 },
    { name: "جامعة الأميرة نورة بنت عبد الرحمن", count: 17, rank: 10 },
    { name: "جامعة جازان", count: 16, rank: 11 },
    { name: "جامعة الباحة", count: 10, rank: 12 },
    { name: "جامعة أم القرى", count: 10, rank: 13 },
    { name: "جامعة شقراء", count: 10, rank: 14 },
    { name: "جامعة الأمير سطام بن عبد العزيز", count: 9, rank: 15 },
    { name: "جامعة المجمعة", count: 7, rank: 16 },
    { name: "جامعة نجران", count: 7, rank: 17 },
    { name: "جامعة الجوف", count: 6, rank: 18 },
    { name: "جامعة حائل", count: 6, rank: 19 },
    { name: "جامعة المعرفة", count: 4, rank: 20 },
    { name: "كليات الأصالة", count: 4, rank: 21 },
    { name: "كليات بريدة الأهلية", count: 4, rank: 22 },
    { name: "الجامعة الإسلامية", count: 3, rank: 23 },
    { name: "جامعة الأعمال والتكنولوجيا", count: 3, rank: 24 },
    { name: "جامعة بيشة", count: 3, rank: 25 },
    { name: "جامعة الإمام محمد بن سعود الإسلامية", count: 2, rank: 26 },
    { name: "جامعة الملك سعود بن عبد العزيز للعلوم الصحية", count: 2, rank: 27 },
    { name: "جامعة تبوك", count: 2, rank: 28 },
    { name: "جامعة عفت", count: 2, rank: 29 },
    { name: "كليات عنيزة", count: 2, rank: 30 },
    { name: "كلية الأمير سلطان العسكرية للعلوم الصحية بالظهران", count: 2, rank: 31 },
    { name: "كلية جدة العالمية", count: 2, rank: 32 },
    { name: "جامعة الفيصل", count: 1, rank: 33 },
    { name: "جامعة الملك خالد", count: 1, rank: 34 },
    { name: "جامعة اليمامة", count: 1, rank: 35 },
    { name: "جامعة سليمان الراجحي", count: 1, rank: 36 },
    { name: "كلية الخليج للعلوم الإدارية والإنسانية", count: 1, rank: 37 },
    { name: "كلية الريان الأهلية", count: 1, rank: 38 },
    { name: "كلية الملك فهد الأمنية", count: 1, rank: 39 }
];

const departments = [
    { name: "إدارة برامج العلوم الإنسانية والتربوية", count: 156, percentage: 35.1, rank: 1 },
    { name: "إدارة برامج العلوم الصحية", count: 91, percentage: 20.4, rank: 2 },
    { name: "إدارة برامج التخصصات العلمية", count: 77, percentage: 17.3, rank: 3 },
    { name: "إدارة برامج العلوم الهندسية والحاسوبية", count: 73, percentage: 16.4, rank: 4 },
    { name: "إدارة برامج العلوم الإسلامية والعربية", count: 48, percentage: 10.8, rank: 5 }
];

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    renderUniversities();
    renderDepartments();
    renderContracts();
    setupFilters();
    setupSearch();
});

// التنقل بين التبويبات
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // إزالة الحالة النشطة من جميع الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // إخفاء جميع المحتويات
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // إظهار المحتوى المطلوب
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// عرض الجامعات
function renderUniversities() {
    const container = document.getElementById('universitiesList');
    let html = '';
    
    universities.forEach(uni => {
        html += `
            <div class="university-card" data-university="${uni.name}">
                <div>
                    <span class="university-rank">${uni.rank}</span>
                    <span class="university-name">${uni.name}</span>
                </div>
                <div style="margin-top: 10px;">
                    <span class="university-count">${uni.count}</span>
                    <span class="university-label"> عقد</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// عرض الأقسام
function renderDepartments() {
    const container = document.getElementById('departmentsList');
    let html = '';
    
    departments.forEach(dept => {
        html += `
            <div class="department-card">
                <div class="department-info">
                    <span class="department-rank">${dept.rank}</span>
                    <span class="department-name">${dept.name}</span>
                </div>
                <div class="department-stats">
                    <span class="department-count">${dept.count}</span>
                    <span class="department-percentage">${dept.percentage}%</span>
                    <div style="font-size: 13px; color: #666; margin-top: 5px;">عقد</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// استخراج نسبة التقدم
function extractProgressPercentage(progress) {
    const match = progress.match(/(\d+)%/);
    return match ? match[1] + '%' : 'غير محدد';
}

// عرض العقود
function renderContracts() {
    // تم جدولة الزيارة
    const scheduled = contractsData.filter(c => c.visitComplianceStatus === "تم جدولة الزيارة");
    renderContractsList(scheduled, 'scheduledContracts', 'Scheduled');
    
    // لم تتم الجدولة
    const notScheduled = contractsData.filter(c => c.visitComplianceStatus === "لم تتم جدولة الزيارة -متاخر عن التاريخ المجدول للزيارة");
    renderContractsList(notScheduled, 'notScheduledContracts', 'NotScheduled');
    
    // غير محددة
    const undefined = contractsData.filter(c => c.visitComplianceStatus === "غير محددة");
    renderContractsList(undefined, 'undefinedContracts', 'Undefined');
}

// عرض قائمة العقود
function renderContractsList(contracts, containerId, tabSuffix) {
    const container = document.getElementById(containerId);
    
    if (contracts.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">📭</div>
                <div class="no-results-text">لا توجد عقود في هذه الفئة</div>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    contracts.forEach(contract => {
        const statusClass = getStatusClass(contract.visitComplianceStatus);
        const visitDate = contract.visitScheduled && contract.visitScheduled.trim() 
            ? contract.visitScheduled 
            : 'لم تتم الجدولة';
        
        html += `
            <div class="contract-card">
                <div class="contract-header">
                    <div class="contract-id">عقد رقم #${contract.id}</div>
                    <div class="contract-university">🏛️ ${contract.university}</div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">📚</span>
                    <div class="field-content">
                        <span class="field-label">الإدارة</span>
                        <span class="field-value">${contract.department}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">📖</span>
                    <div class="field-content">
                        <span class="field-label">البرنامج</span>
                        <span class="field-value">${contract.program}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">🎓</span>
                    <div class="field-content">
                        <span class="field-label">الدرجة العلمية</span>
                        <span class="field-value">${contract.degree}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">⚙️</span>
                    <div class="field-content">
                        <span class="field-label">الحالة</span>
                        <span class="field-value">${contract.status}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">📅</span>
                    <div class="field-content">
                        <span class="field-label">تاريخ البداية</span>
                        <span class="field-value">${contract.contractStart}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">📅</span>
                    <div class="field-content">
                        <span class="field-label">تاريخ الانتهاء</span>
                        <span class="field-value">${contract.contractEnd}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">📊</span>
                    <div class="field-content">
                        <span class="field-label">نسبة التقدم</span>
                        <span class="field-value">${contract.progress}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">📝</span>
                    <div class="field-content">
                        <span class="field-label">تاريخ استلام الوثائق</span>
                        <span class="field-value">${contract.docsReceived}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">📋</span>
                    <div class="field-content">
                        <span class="field-label">حالة الوثائق</span>
                        <span class="field-value">${contract.docsComplianceStatus}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">🗓️</span>
                    <div class="field-content">
                        <span class="field-label">التاريخ المجدول لزيارة المراجعين</span>
                        <span class="field-value">${visitDate}</span>
                    </div>
                </div>
                
                <div class="contract-field">
                    <span class="field-icon">✅</span>
                    <div class="field-content">
                        <span class="field-label">اتباع شروط التاريخ المجدول</span>
                        <span class="status-badge ${statusClass}">${contract.visitComplianceStatus}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // تحديث عداد النتائج
    updateResultsCounter(contracts.length, tabSuffix);
}

// تحديث عداد النتائج
function updateResultsCounter(count, tabSuffix) {
    const counter = document.getElementById(`resultsCount${tabSuffix}`);
    if (counter) {
        counter.textContent = `عرض ${count} عقد من أصل ${getTotalForTab(tabSuffix)}`;
    }
}

// الحصول على الإجمالي لكل تبويب
function getTotalForTab(tabSuffix) {
    if (tabSuffix === 'Scheduled') return 175;
    if (tabSuffix === 'NotScheduled') return 42;
    if (tabSuffix === 'Undefined') return 228;
    return 0;
}

// تحديد فئة الحالة
function getStatusClass(status) {
    if (status === "تم جدولة الزيارة") return "status-scheduled";
    if (status === "لم تتم جدولة الزيارة -متاخر عن التاريخ المجدول للزيارة") return "status-not-scheduled";
    return "status-undefined";
}

// إعداد الفلاتر
function setupFilters() {
    const filterSelects = [
        'filterUniversityScheduled',
        'filterDepartmentScheduled',
        'filterProgressScheduled',
        'filterUniversityNotScheduled',
        'filterDepartmentNotScheduled',
        'filterProgressNotScheduled',
        'filterUniversityUndefined',
        'filterDepartmentUndefined',
        'filterProgressUndefined'
    ];
    
    // ملء قوائم الجامعات
    filterSelects.filter(id => id.includes('University')).forEach(id => {
        const select = document.getElementById(id);
        universities.forEach(uni => {
            const option = document.createElement('option');
            option.value = uni.name;
            option.textContent = uni.name;
            select.appendChild(option);
        });
    });
    
    // ملء قوائم الأقسام
    filterSelects.filter(id => id.includes('Department')).forEach(id => {
        const select = document.getElementById(id);
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.name;
            option.textContent = dept.name;
            select.appendChild(option);
        });
    });
    
    // إضافة مستمعي الأحداث
    filterSelects.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

// تطبيق الفلاتر
function applyFilters() {
    const tabs = ['Scheduled', 'NotScheduled', 'Undefined'];
    
    tabs.forEach(tab => {
        const universityFilter = document.getElementById(`filterUniversity${tab}`).value;
        const departmentFilter = document.getElementById(`filterDepartment${tab}`).value;
        const progressFilter = document.getElementById(`filterProgress${tab}`).value;
        const searchValue = document.getElementById(`search${tab}`).value.toLowerCase();
        
        let statusValue;
        if (tab === 'Scheduled') statusValue = "تم جدولة الزيارة";
        else if (tab === 'NotScheduled') statusValue = "لم تتم جدولة الزيارة -متاخر عن التاريخ المجدول للزيارة";
        else statusValue = "غير محددة";
        
        let filtered = contractsData.filter(c => c.visitComplianceStatus === statusValue);
        
        if (universityFilter) {
            filtered = filtered.filter(c => c.university === universityFilter);
        }
        
        if (departmentFilter) {
            filtered = filtered.filter(c => c.department === departmentFilter);
        }
        
        if (progressFilter) {
            filtered = filtered.filter(c => extractProgressPercentage(c.progress) === progressFilter);
        }
        
        if (searchValue) {
            filtered = filtered.filter(c => 
                c.university.toLowerCase().includes(searchValue) ||
                c.department.toLowerCase().includes(searchValue) ||
                c.program.toLowerCase().includes(searchValue)
            );
        }
        
        renderContractsList(filtered, `${tab.charAt(0).toLowerCase() + tab.slice(1)}Contracts`, tab);
    });
}

// إعداد البحث
function setupSearch() {
    const searchInputs = ['searchScheduled', 'searchNotScheduled', 'searchUndefined'];
    
    searchInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', applyFilters);
        }
    });
    
    // بحث الجامعات
    document.getElementById('universitySearch').addEventListener('input', function(e) {
        const searchValue = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.university-card');
        
        cards.forEach(card => {
            const universityName = card.getAttribute('data-university').toLowerCase();
            if (universityName.includes(searchValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
