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
        proc_dict = {}

        for proc in psutil.process_iter():
            try:
                with proc.oneshot():
                    pid = proc.pid
                    proc_dict[pid] = {
                        "pid": pid,
                        "ppid": proc.ppid(),
                        "name": proc.name(),
                        "status": proc.status(),
                        "cpu_percent": proc.cpu_percent(interval=None),
                        "memory_percent": round(proc.memory_percent(), 2),
                        "children": []
                    }
            except (
                psutil.NoSuchProcess,
                psutil.AccessDenied,
                psutil.ZombieProcess,
            ):
                continue

        tree = []

        for pid, pinfo in proc_dict.items():
            ppid = pinfo["ppid"]

            if ppid in proc_dict and ppid != pid:
                proc_dict[ppid]["children"].append(pinfo)
            else:
                tree.append(pinfo)

        return {"isSuccess": True, "data": tree}

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