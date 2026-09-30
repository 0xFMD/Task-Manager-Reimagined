import psutil


class ProcessManager:
    def __init__(self):
        self.handlers = {
            "list_process": self.list_process,
            "suspend_process": self.suspend_process,
            "resume_process": self.resume_process,
            "kill_process": self.kill_process,

        }

    def list_process(self):
        processes = []
        for proc in psutil.process_iter():
            try:
                with proc.oneshot():
                    pinfo = {
                        "pid":proc.pid,
                        "ppid":proc.ppid(),
                        "name":proc.name(),
                        "status":proc.status(),
                        "cpu_percent":proc.cpu_percent(interval=none),
                        "memory_percent":round(proc.memory_percent(), 2),
                    }
                    processes.append(pinfo)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
            return {"isSuccess": True, "data": processes}
       


    def suspend_process(self, pid):
        pass

    def resume_process(self, pid):
        pass

    def kill_process(self, pid):
        pass
