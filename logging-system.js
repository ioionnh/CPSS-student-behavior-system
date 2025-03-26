class Logger {
    constructor(system) {
        this.system = system;
    }

    getLogsForStudent(studentId) {
        return this.system.data.allLogs
            .filter(log => log.studentId === studentId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getRecentLogs(limit = 50) {
        return [...this.system.data.allLogs]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
}
