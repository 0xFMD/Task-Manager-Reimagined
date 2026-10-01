import os
import psutil
import iptc
import socket

class NetworkManager:
    def __init__(self):
        self.handlers = {
            "get_usage_network": self.get_usage,
            "block_network": self.block,
            "unblock_network": self.unblock,
            "check_rule_exists": self._check_rule_exists,
        }

    def get_usage(self, pid=None):
        try:
            if pid:
                if not psutil.pid_exists(pid):
                    return {"isSuccess": False, "message": f"{pid} not found"}

                proc = psutil.Process(pid)

                conns = []
                for c in proc.net_connections(kind="inet"):
                    conns.append({
                        "fd": c.fd,
                        "family": "IPv4" if c.family == 2 else "IPv6",
                        "type": "TCP" if c.type == 1 else "UDP",
                        "laddr": f"{c.laddr.ip}:{c.laddr.port}" if c.laddr else "",
                        "raddr": f"{c.raddr.ip}:{c.raddr.port}" if c.raddr else "NONE",
                        "status": c.status
                    })
                return {
                    "isSuccess": True,
                    "data":{
                        "pid": pid,
                        "process_name": proc.name(),
                        "connections_count": len(conns),
                        "connections": conns
                    }
                    }
            else:
                io = psutil.net_io_counters()
                return {
                    "isSuccess": True,
                    "data": {
                        "bytes_sent_mb": round(io.bytes_sent / (1024 * 1024), 2),
                        "bytes_recv_mb": round(io.bytes_recv / (1024 * 1024), 2),
                    }
                }
        except Exception as e:
            return {"isSuccess": False, "message": str(e)}


    def block(self, pid):
        try:
        
            if not psutil.pid_exists(pid):
                return {"isSuccess": False, "message": f"{pid} not found"}

            proc = psutil.Process(pid)
            proc_name = proc.name()

            cgroup_name = f"network-pid-{pid}"

            cgroup_path = f"/sys/fs/cgroup/{cgroup_name}"

            if self._check_rule_exists(pid):
                return{
                    "isSuccess": True,
                    "message": f"Process {proc_name} (PID: {pid}) is already blocked.",
                    "data": {"pid": pid, "is_blocked": True},
                }

            os.mkdir(cgroup_path)

            with open(f"{cgroup_path}/cgroup.procs", "w") as f:
                f.write(str(pid))
            
            table = iptc.Table(iptc.Table.FILTER)
            chain = iptc.Chain(table, "OUTPUT")

            rule = iptc.Rule()

            match = rule.create_match("cgroup")
            

            target = rule.create_target("DROP")
            rule.target = target

            chain.insert_rule(rule)
            

            return{
                "isSuccess": True,
                "message": f"Network traffic blocked successfly for process '{proc_name}' (PID: {pid}).",
                "data": {
                    "pid": pid,
                    "process_name": proc_name,
                    "is_blocked": True,
                },
            }
        except PermissionError:
            return {"isSuccess": False, "message": "Permission denied. Ensure the daemon runs with root/sudo privileges.", 
                    }
    
        except Exception as e:
            return {"isSuccess": False, "message": str(e)}
        
    def unblock(self, pid):
        try:
            #new cgroup
            cgroup_name = f"network-pid-{pid}"

            cgroup_path = f"/sys/fs/cgroup/{cgroup_name}"
            
            table = iptc.Table(iptc.Table.FILTER)
            chain = iptc.Chain(table, "OUTPUT")

            found = False


            for rule in chain.rules:
                for match in rule.matches:
                    if (
                        match.name == "cgroup"
                        and getattr(match, "path", None) == cgroup_name
                    ):
                        chain.delete_rule(rule)

                        found = True
                        break
                if not found:
                            
                        return {
                            "isSuccess": False,
                            "message": f"No blocking rule found for PID {pid}.", 
                        }
                if psutil.pid_exists(pid):
                    with open("/sys/fs/cgroup/cgroup.procs", "w") as f:
                        f.write(str(pid))

                if os.path.exists(cgroup_path):
                    os.rmdir(cgroup_path)        
                    
            return {
                "isSuccess": True,
                "message": f"Network traffic unblocked for PID {pid}.",
                "data": {
                    "pid": pid,
                    "is_blocked": False
            }
            }
            
        except Exception as e:
            return {"isSuccess": False, "message": str(e)}

    def _check_rule_exists(self, pid):
        try:
            #new
            cgroup_name = f"network-pid-{pid}"


            table = iptc.Table(iptc.Table.FILTER)
            chain = iptc.Chain(table, "OUTPUT")


            #chain = iptc.Chain(iptc.Table(iptc.Table.FILTER), "OUTPUT")
            for rule in chain.rules:
                for match in rule.matches: 
                    #switch PID to cgroup
                    if(
                        match.name == "cgroup"
                        and getattr(match, "path", None) == str(cgroup_name)
                    ):
                        return True
                    
            return False
        
        except Exception:
            return False         
