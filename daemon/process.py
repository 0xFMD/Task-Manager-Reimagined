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

        for process in psutil.process_iter(
            [
                "pid",
                "ppid",
                "name",
                "status",
                "username",
                "cpu_percent",
                "memory_percent",
                "memory_info",
                "num_threads",
                "cpu_num",
            ]
        ):

            processes.append(process.info)

            return {"isSuccess": True, "data": processes}

    def suspend_process(self, pid):
        try:
            proc = psutil.Process(pid)
            proc.suspend()
            return {
                "isSuccess": True,
                "message": f"Process {pid} suspended successfully.",
            }
        except psutil.NoSuchProcess:
            return {
                "isSuccess": False,
                "message": f"Process {pid} does not exist.",
            }
        except psutil.AccessDenied:
            return {
                "isSuccess": False,
                "message": f"Access denied to suspend process {pid}.",
            }
        except Exception as e:
            return {"isSuccess": False, "message": str(e)}

    def resume_process(self, pid):
        try:
            proc = psutil.Process(pid)
            proc.resume()
            return {
                "isSuccess": True,
                "message": f"Process {pid} resumed successfully.",
            }
        except psutil.NoSuchProcess:
            return {
                "isSuccess": False,
                "message": f"Process {pid} does not exist.",
            }
        except psutil.AccessDenied:
            return {
                "isSuccess": False,
                "message": f"Access denied to resume process {pid}.",
            }
        except Exception as e:
            return {"isSuccess": False, "message": str(e)}

    def kill_process(self, pid):
        try:
            proc = psutil.Process(pid)
            proc.kill()
            return {
                "isSuccess": True,
                "message": f"Process {pid} killed successfully",
            }
        except psutil.NoSuchProcess:
            return {"isSuccess": False, "message": f"Process {pid} not found"}
        except psutil.AccessDenied:
            return {
                "isSuccess": False,
                "message": f"Access denied to kill process {pid}",
            }
        except Exception as e:
            return {"isSuccess": False, "message": str(e)}


if __name__ == "__main__":
    pm = ProcessManager()
    print(pm.list_process())
