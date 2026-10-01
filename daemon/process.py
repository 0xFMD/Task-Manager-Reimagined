import psutil


class ProcessManager:
    def __init__(self):
        self.handlers = {
            "list_process": self.list_process,
            "get_process": self.get_process,
            "suspend_process": self.suspend_process,
            "resume_process": self.resume_process,
            "kill_process": self.kill_process,
        }

    def list_process(self):
        pass

    def get_process(self, pid):
        pass

    def suspend_process(self, pid):
        pass

    def resume_process(self, pid):
        pass

    def kill_process(self, pid):
        pass
