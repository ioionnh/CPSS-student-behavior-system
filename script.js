// ตัวแปรระบบ
const ADMIN_SECURITY_CODE = '065391';
let currentUser = null;
let selectedRequestId = null;

// In-memory data store
const dataStore = {
    users: [
        { id: "64001", name: "นักเรียน หนึ่ง", password: "64001", role: "student", class: "ม.1/1", score: 80, logs: [] },
        { id: "64002", name: "นักเรียน สอง", password: "64002", role: "student", class: "ม.1/2", score: 77, logs: [] },
        { id: "64003", name: "นักเรียน สาม", password: "64003", role: "student", class: "ม.2/1", score: 90, logs: [] },
        { id: "64004", name: "นักเรียน สี่", password: "64004", role: "student", class: "ม.2/2", score: 68, logs: [] },
        { id: "64005", name: "นักเรียน ห้า", password: "64005", role: "student", class: "ม.3/1", score: 77, logs: [] },
        { id: "64006", name: "นักเรียน หก", password: "64006", role: "student", class: "ม.3/2", score: 85, logs: [] },
        { id: "64007", name: "นักเรียน เจ็ด", password: "64007", role: "student", class: "ม.4/1", score: 92, logs: [] },
        { id: "64008", name: "นักเรียน แปด", password: "64008", role: "student", class: "ม.4/2", score: 65, logs: [] },
        { id: "64009", name: "นักเรียน เก้า", password: "64009", role: "student", class: "ม.5/1", score: 78, logs: [] },
        { id: "64010", name: "นักเรียน สิบ", password: "64010", role: "student", class: "ม.5/2", score: 88, logs: [] },
        { id: "64011", name: "นักเรียน สิบเอ็ด", password: "64011", role: "student", class: "ม.6/1", score: 95, logs: [] },
        { id: "64012", name: "นักเรียน สิบสอง", password: "64012", role: "student", class: "ม.6/2", score: 70, logs: [] },
        { id: "t001", name: "ครู สมชาย", password: "t001", role: "teacher" },
        { id: "t002", name: "ครู สมหญิง", password: "t002", role: "teacher" },
        { id: "admin", name: "ผู้บริหาร ใหญ่", password: "admin", role: "admin" }
    ],
    allLogs: [],
    pendingRequests: [],
    notifications: []
};

// โหลดข้อมูลเริ่มต้นเมื่อเริ่มต้น
async function initializeSystem() {
    try {
        // No initialization needed for in-memory store as data is already defined
        console.log('System initialized with in-memory data');
    } catch (error) {
        console.error('Error initializing system:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดระบบ', 'error');
    }
}

// โหลดข้อมูลผู้ใช้
async function loadUsers() {
    try {
        return Promise.resolve(dataStore.users);
    } catch (error) {
        console.error('Error loading users:', error);
        throw error;
    }
}

// บันทึกข้อมูลผู้ใช้
async function saveUser(user) {
    try {
        const index = dataStore.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            dataStore.users[index] = { ...dataStore.users[index], ...user };
        } else {
            dataStore.users.push(user);
        }
        return Promise.resolve();
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

// โหลด logs
async function loadLogs() {
    try {
        return Promise.resolve(dataStore.allLogs);
    } catch (error) {
        console.error('Error loading logs:', error);
        throw error;
    }
}

// บันทึก logs
async function saveLogs(logs) {
    try {
        dataStore.allLogs = logs;
        return Promise.resolve();
    } catch (error) {
        console.error('Error saving logs:', error);
        throw error;
    }
}

// โหลด pending requests
async function loadPendingRequests() {
    try {
        return Promise.resolve(dataStore.pendingRequests);
    } catch (error) {
        console.error('Error loading pending requests:', error);
        throw error;
    }
}

// บันทึก pending requests
async function savePendingRequests(requests) {
    try {
        dataStore.pendingRequests = requests;
        return Promise.resolve();
    } catch (error) {
        console.error('Error saving pending requests:', error);
        throw error;
    }
}

// โหลด notifications
async function loadNotifications() {
    try {
        return Promise.resolve(dataStore.notifications);
    } catch (error) {
        console.error('Error loading notifications:', error);
        throw error;
    }
}

// บันทึก notifications
async function saveNotifications(notifications) {
    try {
        dataStore.notifications = notifications;
        return Promise.resolve();
    } catch (error) {
        console.error('Error saving notifications:', error);
        throw error;
    }
}

// แสดง Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// เปิด/ปิด Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('active');
}

// อัปเดตชื่อผู้ใช้ใน header และจัดการปุ่ม
function updateHeaderUser() {
    const userNameSpan = document.getElementById('currentUserName');
    const headerButtons = document.getElementById('headerButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const menuBtn = document.getElementById('menuBtn');

    if (currentUser) {
        userNameSpan.textContent = currentUser.name;
        logoutBtn.style.display = 'inline-flex';
        menuBtn.style.display = 'inline-flex';
        if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
            headerButtons.style.display = 'flex';
        } else {
            headerButtons.style.display = 'none';
        }
    } else {
        userNameSpan.textContent = '';
        logoutBtn.style.display = 'none';
        menuBtn.style.display = 'none';
        headerButtons.style.display = 'none';
    }
}

// เข้าสู่ระบบ
async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showToast('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน!', 'error');
        return;
    }

    const loginBtn = document.getElementById('loginBtn');
    loginBtn.classList.add('active');
    setTimeout(() => loginBtn.classList.remove('active'), 500);

    try {
        const users = await loadUsers();
        currentUser = users.find(user => user.id === username && user.password === password);

        if (currentUser) {
            document.getElementById('loginSection').style.display = 'none';
            updateHeaderUser();
            currentUser.lastLogin = new Date().toISOString();
            await saveUser(currentUser);
            showToast('เข้าสู่ระบบสำเร็จ!', 'success');

            const panels = {
                'student': showStudentPanel,
                'teacher': showTeacherPanel,
                'admin': showAdminPanel
            };
            panels[currentUser.role]();
        } else {
            showToast('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'error');
    }
}

// ออกจากระบบ
function logout() {
    currentUser = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('studentPanel').style.display = 'none';
    document.getElementById('teacherPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    updateHeaderUser();
    showToast('ออกจากระบบสำเร็จ!', 'success');
}

// แสดงแผงนักเรียน
async function showStudentPanel() {
    const panel = document.getElementById('studentPanel');
    panel.style.display = 'block';

    document.getElementById('studentInfo').innerHTML = `
        <p><strong>รหัสนักเรียน:</strong> ${currentUser.id}</p>
        <p><strong>ชื่อนักเรียน:</strong> ${currentUser.name}</p>
        ${currentUser.class ? `<p><strong>ระดับชั้น:</strong> ${currentUser.class}</p>` : ''}
    `;

    const tbody = document.getElementById('studentScoreBody');
    tbody.innerHTML = '';

    if (currentUser.logs && currentUser.logs.length > 0) {
        currentUser.logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(log.date)}</td>
                <td>${log.reason}</td>
                <td class="${log.change > 0 ? 'positive' : 'negative'}">${log.change}</td>
                <td>${log.by}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" style="text-align: center;">ไม่มีประวัติการเปลี่ยนแปลงคะแนน</td>';
        tbody.appendChild(row);
    }

    document.getElementById('studentTotalScore').innerHTML = `
        <p><strong>คะแนนรวม:</strong> <span class="${currentUser.score >= 0 ? 'positive' : 'negative'}">${currentUser.score}</span></p>
    `;
}

// แสดงแผงครู
async function showTeacherPanel() {
    const panel = document.getElementById('teacherPanel');
    panel.style.display = 'block';

    await Promise.all([
        loadTeacherStudents(),
        loadTeacherPendingRequests(),
        loadTeacherNotifications()
    ]);
}

// โหลดข้อมูลนักเรียนสำหรับครู
async function loadTeacherStudents() {
    const tbody = document.getElementById('teacherStudentBody');
    tbody.innerHTML = '';

    const classFilter = document.getElementById('teacherClassFilter').value;
    const searchQuery = document.getElementById('teacherSearch').value.trim().toLowerCase();

    try {
        const users = await loadUsers();
        let students = users.filter(user => user.role === 'student');

        if (classFilter) {
            students = students.filter(student => student.class && student.class.startsWith(classFilter));
        }

        if (searchQuery) {
            students = students.filter(student =>
                student.name.toLowerCase().includes(searchQuery) ||
                student.id.toLowerCase().includes(searchQuery)
            );
        }

        const classGroups = {};
        students.forEach(student => {
            const mainClass = student.class ? student.class.split('/')[0] : 'ไม่มีข้อมูล';
            if (!classGroups[mainClass]) {
                classGroups[mainClass] = [];
            }
            classGroups[mainClass].push(student);
        });

        Object.keys(classGroups).sort().forEach(mainClass => {
            const headerRow = document.createElement('tr');
            headerRow.className = 'class-header';
            headerRow.innerHTML = `<td colspan="5">${mainClass}</td>`;
            tbody.appendChild(headerRow);

            classGroups[mainClass].forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class || '-'}</td>
                    <td class="${student.score >= 0 ? 'positive' : 'negative'}">${student.score}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-increase" onclick="openAddScoreModal('${student.id}', true)">
                                <i class="fas fa-plus"></i> เพิ่ม
                            </button>
                            <button class="btn btn-decrease" onclick="openAddScoreModal('${student.id}', false)">
                                <i class="fas fa-minus"></i> ลด
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });

        if (students.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" style="text-align: center;">
                    ไม่พบข้อมูลนักเรียน${classFilter || searchQuery ? 'ตามเงื่อนไขที่เลือก' : ''}
                </td>
            `;
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading teacher students:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดข้อมูลนักเรียน', 'error');
    }
}

// โหลดคำขอที่รออนุมัติสำหรับครู
async function loadTeacherPendingRequests() {
    const container = document.getElementById('teacherRequestsContainer');
    container.innerHTML = '';

    try {
        const pendingRequests = await loadPendingRequests();
        const teacherRequests = pendingRequests.filter(req => req.requestedBy === currentUser.id);

        if (teacherRequests.length === 0) {
            container.innerHTML = '<p>ไม่มีคำขอที่รอการอนุมัติ</p>';
            return;
        }

        teacherRequests.forEach(request => {
            const accordion = document.createElement('div');
            accordion.className = 'accordion';
            accordion.innerHTML = `
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <span>
                        <strong>${request.studentName} (${request.studentId})</strong> - 
                        ${request.change > 0 ? '+' : ''}${request.change} คะแนน
                        <span class="status-pending">(รออนุมัติ)</span>
                    </span>
                    <i class="fas fa-chevron-right accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <p><strong>เหตุผล:</strong> ${request.reason}</p>
                    <p><strong>วันที่ส่งคำขอ:</strong> ${formatDate(request.requestDate)}</p>
                    <p><strong>ระดับชั้น:</strong> ${request.studentClass}</p>
                    <div class="btn-group" style="margin-top: 10px;">
                        <button class="btn btn-edit" onclick="editRequest('${request.id}')">
                            <i class="fas fa-edit"></i> แก้ไข
                        </button>
                        <button class="btn btn-remove" onclick="cancelRequest('${request.id}')">
                            <i class="fas fa-trash"></i> ยกเลิก
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(accordion);
        });
    } catch (error) {
        console.error('Error loading teacher pending requests:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดคำขอ', 'error');
    }
}

// โหลดการแจ้งเตือนสำหรับครู
async function loadTeacherNotifications() {
    const container = document.getElementById('teacherNotificationsContainer');
    container.innerHTML = '';

    try {
        let notifications = await loadNotifications();
        let teacherNotifications = notifications.filter(notif => notif.teacherId === currentUser.id);

        const now = new Date();
        teacherNotifications = teacherNotifications.filter(notif => {
            const createdAt = new Date(notif.createdAt);
            const ageInHours = (now - createdAt) / (1000 * 60 * 60);
            return ageInHours <= 24;
        });

        notifications = notifications.filter(notif => {
            const createdAt = new Date(notif.createdAt);
            const ageInHours = (now - createdAt) / (1000 * 60 * 60);
            return ageInHours <= 24;
        });
        await saveNotifications(notifications);

        if (teacherNotifications.length === 0) {
            container.innerHTML = '<p>ไม่มีข้อความแจ้งเตือน</p>';
            return;
        }

        teacherNotifications.forEach(notif => {
            const accordion = document.createElement('div');
            accordion.className = 'accordion';
            accordion.innerHTML = `
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <span>
                        <strong>การแจ้งเตือน</strong> - 
                        <span class="status-${notif.status}">${notif.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}</span>
                    </span>
                    <i class="fas fa-chevron-right accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <p>${notif.message}</p>
                    <p><strong>วันที่:</strong> ${formatDate(notif.createdAt)}</p>
                </div>
            `;
            container.appendChild(accordion);
        });
    } catch (error) {
        console.error('Error loading teacher notifications:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดการแจ้งเตือน', 'error');
    }
}

// แสดงแผงผู้ดูแล
async function showAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = 'block';
    openTab('adminStudents');
}

// เปิดแท็บ
async function openTab(tabName) {
    document.querySelectorAll('#adminPanel .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('#adminPanel .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('active');

    if (tabName === 'adminStudents') {
        await loadAdminStudents();
    } else if (tabName === 'adminTeachers') {
        await loadAdminTeachers();
    } else if (tabName === 'adminPendingRequests') {
        await loadAdminPendingRequests();
    } else if (tabName === 'adminLogs') {
        await loadAdminLogs();
    }
}

// โหลดข้อมูลนักเรียนสำหรับผู้ดูแล
async function loadAdminStudents() {
    const tbody = document.getElementById('adminStudentBody');
    tbody.innerHTML = '';

    const classFilter = document.getElementById('adminClassFilter').value;
    const searchQuery = document.getElementById('adminSearch').value.trim().toLowerCase();

    try {
        const users = await loadUsers();
        let students = users.filter(user => user.role === 'student');

        if (classFilter) {
            students = students.filter(student => student.class && student.class.startsWith(classFilter));
        }

        if (searchQuery) {
            students = students.filter(student =>
                student.name.toLowerCase().includes(searchQuery) ||
                student.id.toLowerCase().includes(searchQuery)
            );
        }

        const classGroups = {};
        students.forEach(student => {
            const mainClass = student.class ? student.class.split('/')[0] : 'ไม่มีข้อมูล';
            if (!classGroups[mainClass]) {
                classGroups[mainClass] = [];
            }
            classGroups[mainClass].push(student);
        });

        Object.keys(classGroups).sort().forEach(mainClass => {
            const headerRow = document.createElement('tr');
            headerRow.className = 'class-header';
            headerRow.innerHTML = `<td colspan="5">${mainClass}</td>`;
            tbody.appendChild(headerRow);

            classGroups[mainClass].forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class || '-'}</td>
                    <td class="${student.score >= 0 ? 'positive' : 'negative'}">${student.score}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editUser('${student.id}')">
                            <i class="fas fa-edit"></i> แก้ไข
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });

        if (students.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" style="text-align: center;">
                    ไม่พบข้อมูลนักเรียน${classFilter || searchQuery ? 'ตามเงื่อนไขที่เลือก' : ''}
                </td>
            `;
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading admin students:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดข้อมูลนักเรียน', 'error');
    }
}

// โหลดข้อมูลครูสำหรับผู้ดูแล
async function loadAdminTeachers() {
    const tbody = document.getElementById('adminTeacherBody');
    tbody.innerHTML = '';

    try {
        const users = await loadUsers();
        const teachers = users.filter(user => user.role === 'teacher');

        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>
                    <button class="btn btn-edit" onclick="editUser('${teacher.id}')">
                        <i class="fas fa-edit"></i> แก้ไข
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        if (teachers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3" style="text-align: center;">ไม่มีข้อมูลครู</td>';
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading admin teachers:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดข้อมูลครู', 'error');
    }
}

// โหลดคำขอที่รออนุมัติสำหรับผู้ดูแล
async function loadAdminPendingRequests() {
    const container = document.getElementById('adminRequestsContainer');
    container.innerHTML = '';

    try {
        const pendingRequests = await loadPendingRequests();

        if (pendingRequests.length === 0) {
            container.innerHTML = '<p>ไม่มีคำขอที่รอการอนุมัติ</p>';
            return;
        }

        pendingRequests.forEach(request => {
            const accordion = document.createElement('div');
            accordion.className = 'accordion';
            accordion.innerHTML = `
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <span>
                        <strong>${request.studentName} (${request.studentId})</strong> - 
                        ${request.change > 0 ? '+' : ''}${request.change} คะแนน
                        <span class="status-pending">(รออนุมัติ)</span>
                    </span>
                    <i class="fas fa-chevron-right accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <p><strong>เหตุผล:</strong> ${request.reason}</p>
                    <p><strong>วันที่ส่งคำขอ:</strong> ${formatDate(request.requestDate)}</p>
                    <p><strong>ระดับชั้น:</strong> ${request.studentClass}</p>
                    <p><strong>ขอโดย:</strong> ${request.teacherName}</p>
                    <button class="btn btn-approve" onclick="openApprovalModal('${request.id}')">
                        <i class="fas fa-check"></i> ตรวจสอบ
                    </button>
                </div>
            `;
            container.appendChild(accordion);
        });
    } catch (error) {
        console.error('Error loading admin pending requests:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดคำขอ', 'error');
    }
}

// โหลดประวัติการเปลี่ยนแปลงสำหรับผู้ดูแล
async function loadAdminLogs() {
    const container = document.getElementById('adminLogsContainer');
    container.innerHTML = '';

    try {
        const allLogs = await loadLogs();

        if (allLogs.length === 0) {
            container.innerHTML = '<p>ไม่มีประวัติการเปลี่ยนแปลง</p>';
            return;
        }

        allLogs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `
                <p><strong>วันที่:</strong> ${formatDate(log.date)}</p>
                <p><strong>นักเรียน:</strong> ${log.studentName} (${log.studentId})</p>
                <p><strong>การเปลี่ยนแปลง:</strong> <span class="${log.change >= 0 ? 'positive' : 'negative'}">${log.change}</span></p>
                <p><strong>เหตุผล:</strong> ${log.reason}</p>
                <p><strong>โดย:</strong> ${log.by}</p>
                <p><strong>สถานะ:</strong> <span class="status-${log.status}">${log.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}</span></p>
                ${log.comment ? `<p><strong>ความคิดเห็น:</strong> ${log.comment}</p>` : ''}
            `;
            container.appendChild(logEntry);
        });
    } catch (error) {
        console.error('Error loading admin logs:', error);
        showToast('เกิดข้อผิดพลาดในการโหลดประวัติ', 'error');
    }
}

// เปิดโมดอลเพิ่ม/ลดคะแนน
async function openAddScoreModal(studentId, isIncrease) {
    try {
        const users = await loadUsers();
        const student = users.find(user => user.id === studentId && user.role === 'student');
        if (!student) {
            showToast('ไม่พบข้อมูลนักเรียน!', 'error');
            return;
        }

        const modal = document.getElementById('addScoreModal');
        const studentSelect = document.getElementById('scoreStudentId');
        studentSelect.innerHTML = `<option value="${student.id}">${student.name} (${student.id})</option>`;
        document.getElementById('scoreClass').value = student.class ? student.class.split('/')[0] : 'ม.1';
        document.getElementById('scoreChange').value = isIncrease ? '1' : '-1';
        document.getElementById('scoreReason').value = '';
        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error opening add score modal:', error);
        showToast('เกิดข้อผิดพลาดในการเปิดโมดอล', 'error');
    }
}

// ตั้งค่าคะแนน
function setScoreValue(value) {
    const scoreInput = document.getElementById('scoreChange');
    scoreInput.value = value;
}

// ส่งคำขอเปลี่ยนแปลงคะแนน
async function submitScoreRequest() {
    const studentId = document.getElementById('scoreStudentId').value;
    const change = parseInt(document.getElementById('scoreChange').value);
    const reason = document.getElementById('scoreReason').value.trim();
    const studentClass = document.getElementById('scoreClass').value;

    if (!studentId) {
        showToast('กรุณาเลือกนักเรียน!', 'error');
        return;
    }

    if (isNaN(change) || change === 0) {
        showToast('กรุณากรอกจำนวนคะแนนเป็นตัวเลขที่ไม่ใช่ 0!', 'error');
        return;
    }

    if (!reason || reason.length < 5) {
        showToast('กรุณากรอกเหตุผลอย่างน้อย 5 ตัวอักษร!', 'error');
        return;
    }

    try {
        const users = await loadUsers();
        const student = users.find(user => user.id === studentId && user.role === 'student');
        if (student) {
            const requestId = 'req-' + Date.now();
            const newRequest = {
                id: requestId,
                studentId: student.id,
                studentName: student.name,
                studentClass: student.class || studentClass,
                change: change,
                reason: reason,
                teacherName: currentUser.name,
                requestedBy: currentUser.id,
                requestDate: new Date().toISOString(),
                status: 'pending'
            };

            const pendingRequests = await loadPendingRequests();
            pendingRequests.push(newRequest);
            await savePendingRequests(pendingRequests);
            closeModal('addScoreModal');

            showToast('ส่งคำขอเปลี่ยนแปลงคะแนนเรียบร้อย รอการอนุมัติจากผู้บริหาร', 'success');

            if (currentUser.role === 'teacher') {
                await loadTeacherPendingRequests();
            }
        } else {
            showToast('ไม่พบข้อมูลนักเรียน!', 'error');
        }
    } catch (error) {
        console.error('Error submitting score request:', error);
        showToast('เกิดข้อผิดพลาดในการส่งคำขอ', 'error');
    }
}

// เปิดโมดอลอนุมัติคำขอ
async function openApprovalModal(requestId) {
    try {
        const pendingRequests = await loadPendingRequests();
        const request = pendingRequests.find(req => req.id === requestId);
        if (!request) {
            showToast('ไม่พบคำขอ!', 'error');
            return;
        }

        selectedRequestId = requestId;
        const modal = document.getElementById('approvalModal');
        document.getElementById('requestDetails').innerHTML = `
            <p><strong>นักเรียน:</strong> ${request.studentName} (${request.studentId})</p>
            <p><strong>ระดับชั้น:</strong> ${request.studentClass}</p>
            <p><strong>การเปลี่ยนแปลง:</strong> <span class="${request.change >= 0 ? 'positive' : 'negative'}">${request.change}</span></p>
            <p><strong>เหตุผล:</strong> ${request.reason}</p>
            <p><strong>ขอโดย:</strong> ${request.teacherName}</p>
            <p><strong>วันที่ส่งคำขอ:</strong> ${formatDate(request.requestDate)}</p>
        `;
        document.getElementById('approvalComment').value = '';
        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error opening approval modal:', error);
        showToast('เกิดข้อผิดพลาดในการเปิดโมดอลอนุมัติ', 'error');
    }
}

// อนุมัติหรือปฏิเสธคำขอ
async function approveRequest(isApproved) {
    try {
        const pendingRequests = await loadPendingRequests();
        const request = pendingRequests.find(req => req.id === selectedRequestId);
        if (!request) return;

        const users = await loadUsers();
        const student = users.find(user => user.id === request.studentId && user.role === 'student');
        const teacher = users.find(user => user.id === request.requestedBy);
        let notifications = await loadNotifications();
        let allLogs = await loadLogs();

        const comment = document.getElementById('approvalComment').value.trim();
        const status = isApproved ? 'approved' : 'rejected';

        if (isApproved && student) {
            student.score = (student.score || 0) + request.change;
            student.logs = student.logs || [];
            student.logs.push({
                date: new Date().toISOString(),
                reason: request.reason,
                change: request.change,
                by: request.teacherName
            });
            await saveUser(student);
        }

        allLogs.push({
            date: new Date().toISOString(),
            studentId: request.studentId,
            studentName: request.studentName,
            change: request.change,
            reason: request.reason,
            by: request.teacherName,
            status: status,
            comment: comment
        });

        notifications.push({
            id: 'notif-' + Date.now(),
            teacherId: request.requestedBy,
            message: `คำขอเปลี่ยนแปลงคะแนนสำหรับ ${request.studentName} (${request.change} คะแนน) ได้รับการ${isApproved ? 'อนุมัติ' : 'ปฏิเสธ'}${comment ? ': ' + comment : ''}`,
            status: status,
            createdAt: new Date().toISOString()
        });

        const updatedRequests = pendingRequests.filter(req => req.id !== selectedRequestId);
        await Promise.all([
            savePendingRequests(updatedRequests),
            saveLogs(allLogs),
            saveNotifications(notifications),
            student && isApproved ? saveUser(student) : Promise.resolve()
        ]);

        closeModal('approvalModal');
        showToast(`คำขอได้รับการ${isApproved ? 'อนุมัติ' : 'ปฏิเสธ'}เรียบร้อยแล้ว!`, 'success');
        await loadAdminPendingRequests();
    } catch (error) {
        console.error('Error approving request:', error);
        showToast('เกิดข้อผิดพลาดในการอนุมัติคำขอ', 'error');
    }
}

// แก้ไขคำขอ
async function editRequest(requestId) {
    try {
        const pendingRequests = await loadPendingRequests();
        const request = pendingRequests.find(req => req.id === requestId);
        if (!request) {
            showToast('ไม่พบคำขอ!', 'error');
            return;
        }

        const modal = document.getElementById('addScoreModal');
        const studentSelect = document.getElementById('scoreStudentId');
        studentSelect.innerHTML = `<option value="${request.studentId}">${request.studentName} (${request.studentId})</option>`;
        document.getElementById('scoreClass').value = request.studentClass ? request.studentClass.split('/')[0] : 'ม.1';
        document.getElementById('scoreChange').value = request.change;
        document.getElementById('scoreReason').value = request.reason;
        modal.style.display = 'flex';

        const updatedRequests = pendingRequests.filter(req => req.id !== requestId);
        await savePendingRequests(updatedRequests);
    } catch (error) {
        console.error('Error editing request:', error);
        showToast('เกิดข้อผิดพลาดในการแก้ไขคำขอ', 'error');
    }
}

// ยกเลิกคำขอ
async function cancelRequest(requestId) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำขอนี้?')) return;

    try {
        const pendingRequests = await loadPendingRequests();
        const updatedRequests = pendingRequests.filter(req => req.id !== requestId);
        await savePendingRequests(updatedRequests);
        showToast('ยกเลิกคำขอเรียบร้อยแล้ว!', 'success');
        await loadTeacherPendingRequests();
    } catch (error) {
        console.error('Error canceling request:', error);
        showToast('เกิดข้อผิดพลาดในการยกเลิกคำขอ', 'error');
    }
}

// เปิดโมดอลเพิ่มผู้ใช้
function openAddUserModal() {
    const modal = document.getElementById('addUserModal');
    document.getElementById('newUserType').value = 'student';
    document.getElementById('newUserId').value = '';
    document.getElementById('newUserName').value = '';
    document.getElementById('newUserClass').value = 'ม.1';
    document.getElementById('newUserSubClass').value = '';
    document.getElementById('newUserPassword').value = '';
    toggleClassField();
    modal.style.display = 'flex';
}

// สลับการแสดงฟิลด์ระดับชั้น
function toggleClassField() {
    const userType = document.getElementById('newUserType').value;
    const classGroup = document.getElementById('newUserClassGroup');
    const subClassGroup = document.getElementById('newUserSubClassGroup');
    if (userType === 'student') {
        classGroup.style.display = 'block';
        subClassGroup.style.display = 'block';
    } else {
        classGroup.style.display = 'none';
        subClassGroup.style.display = 'none';
    }
}

// เพิ่มผู้ใช้ใหม่
async function addNewUser() {
    const userType = document.getElementById('newUserType').value;
    const userId = document.getElementById('newUserId').value.trim();
    const userName = document.getElementById('newUserName').value.trim();
    const userClass = document.getElementById('newUserClass').value;
    const userSubClass = document.getElementById('newUserSubClass').value.trim();
    const password = document.getElementById('newUserPassword').value;

    if (!userId || !userName || !password) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน!', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร!', 'error');
        return;
    }

    try {
        const users = await loadUsers();
        if (users.some(user => user.id === userId)) {
            showToast('รหัสผู้ใช้นี้มีอยู่แล้ว!', 'error');
            return;
        }

        const newUser = {
            id: userId,
            name: userName,
            password: password,
            role: userType
        };

        if (userType === 'student') {
            newUser.class = userSubClass ? `${userClass}/${userSubClass}` : userClass;
            newUser.score = 80;
            newUser.logs = [];
        }

        await saveUser(newUser);
        closeModal('addUserModal');

        if (userType === 'student') {
            await loadAdminStudents();
        } else if (userType === 'teacher') {
            await loadAdminTeachers();
        }

        showToast('เพิ่มผู้ใช้เรียบร้อยแล้ว!', 'success');
    } catch (error) {
        console.error('Error adding new user:', error);
        showToast('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้', 'error');
    }
}

// เปิดโมดอลแก้ไขผู้ใช้
async function editUser(userId) {
    try {
        const users = await loadUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
            showToast('ไม่พบผู้ใช้!', 'error');
            return;
        }

        const modal = document.getElementById('editUserModal');
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.name;

        const classGroup = document.getElementById('editUserClassGroup');
        const subClassGroup = document.getElementById('editUserSubClassGroup');

        if (user.role === 'student') {
            classGroup.style.display = 'block';
            subClassGroup.style.display = 'block';
            if (user.class) {
                const [mainClass, subClass] = user.class.split('/');
                document.getElementById('editUserClass').value = mainClass || 'ม.1';
                document.getElementById('editUserSubClass').value = subClass || '';
            } else {
                document.getElementById('editUserClass').value = 'ม.1';
                document.getElementById('editUserSubClass').value = '';
            }
        } else {
            classGroup.style.display = 'none';
            subClassGroup.style.display = 'none';
        }

        document.getElementById('editUserPassword').value = '';
        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error editing user:', error);
        showToast('เกิดข้อผิดพลาดในการแก้ไขผู้ใช้', 'error');
    }
}

// อัปเดตข้อมูลผู้ใช้
async function updateUser() {
    const userId = document.getElementById('editUserId').value;
    try {
        const users = await loadUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
            showToast('ไม่พบผู้ใช้!', 'error');
            return;
        }

        const newName = document.getElementById('editUserName').value.trim();
        const newClass = document.getElementById('editUserClass').value;
        const newSubClass = document.getElementById('editUserSubClass').value.trim();
        const newPassword = document.getElementById('editUserPassword').value;

        if (!newName) {
            showToast('กรุณากรอกชื่อ-สกุล!', 'error');
            return;
        }

        user.name = newName;
        if (user.role === 'student') {
            user.class = newSubClass ? `${newClass}/${newSubClass}` : newClass;
        }
        if (newPassword) {
            if (newPassword.length < 6) {
                showToast('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร!', 'error');
                return;
            }
            user.password = newPassword;
        }

        await saveUser(user);
        closeModal('editUserModal');

        if (user.role === 'student') {
            await loadAdminStudents();
        } else if (user.role === 'teacher') {
            await loadAdminTeachers();
        }

        showToast('อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว!', 'success');
    } catch (error) {
        console.error('Error updating user:', error);
        showToast('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้', 'error');
    }
}

// ลบผู้ใช้
async function deleteUser() {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return;

    const userId = document.getElementById('editUserId').value;
    try {
        const users = await loadUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
            showToast('ไม่พบผู้ใช้!', 'error');
            return;
        }

        dataStore.users = users.filter(u => u.id !== userId);
        closeModal('editUserModal');

        if (user.role === 'student') {
            await loadAdminStudents();
        } else if (user.role === 'teacher') {
            await loadAdminTeachers();
        }

        showToast('ลบผู้ใช้เรียบร้อยแล้ว!', 'success');
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('เกิดข้อผิดพลาดในการลบผู้ใช้', 'error');
    }
}

// เปิดโมดอลเปลี่ยนรหัสผ่านผู้บริหาร
function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    document.getElementById('adminSecurityCode').value = '';
    document.getElementById('newAdminPassword').value = '';
    document.getElementById('confirmAdminPassword').value = '';
    modal.style.display = 'flex';
}

// เปลี่ยนรหัสผ่านผู้บริหาร
async function changeAdminPassword() {
    const securityCode = document.getElementById('adminSecurityCode').value;
    const newPassword = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('confirmAdminPassword').value;

    if (securityCode !== ADMIN_SECURITY_CODE) {
        showToast('รหัสยืนยันไม่ถูกต้อง!', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน!', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร!', 'error');
        return;
    }

    try {
        const users = await loadUsers();
        const admin = users.find(u => u.id === 'admin');
        if (admin) {
            admin.password = newPassword;
            await saveUser(admin);
            closeModal('changePasswordModal');
            showToast('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!', 'success');
        } else {
            showToast('ไม่พบผู้ใช้ผู้บริหาร!', 'error');
        }
    } catch (error) {
        console.error('Error changing admin password:', error);
        showToast('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', 'error');
    }
}

// ปิดโมดอล
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// ฟังก์ชันสลับ accordion
function toggleAccordion(element) {
    const accordion = element.parentElement;
    accordion.classList.toggle('active');
    const content = element.nextElementSibling;
    content.style.display = accordion.classList.contains('active') ? 'block' : 'none';
}

// รูปแบบวันที่
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// เริ่มต้นระบบ
initializeSystem();
