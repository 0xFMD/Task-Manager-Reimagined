import socket
import json
import os

from process import ProcessManager
from network import NetworkManager

SOCKET_NAME = "process-manager.sock"
SOCKET_PATH = f"{os.getenv('XDG_RUNTIME_DIR')}/{SOCKET_NAME}"


class Daemon:
    def __init__(self):
        self.server = None
        self.processes = ProcessManager()
        self.network = NetworkManager()

        self.actions = {
            "process": self.processes.handlers,
            "network": self.network.handlers,
        }

    def daemonize(self):
        pid = os.fork()

        if pid > 0:
            os._exit(0)

        os.setsid()

        pid = os.fork()

        if pid > 0:
            os._exit(0)

        devnull = os.open(os.devnull, os.O_RDWR)
        os.dup2(devnull, 0)
        os.dup2(devnull, 1)
        os.dup2(devnull, 2)

        os.close(devnull)

    def start(self):
        self.daemonize()

        if os.path.exists(SOCKET_PATH):
            os.remove(SOCKET_PATH)
        self.server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.server.bind(SOCKET_PATH)
        self.server.listen()

        print(f"Listening {SOCKET_PATH}")

        while True:
            connection, address = self.server.accept()
            self.handle_client(connection)

    def handle_client(self, client):
        client.settimeout(3)

        while True:

            try:
                data = client.recv(4096)
                if not data:
                    break
                res = self.handle_request(json.loads(data.decode()))
            except socket.timeout:
                res = {
                    "type": "event",
                    "event": "list_process",
                    "data": self.processes.list_process().get("data"),
                }

            try:
                client.send((json.dumps(res) + "\n").encode())
            except:
                break

        client.close()

    def handle_request(self, req):
        req_type = req.get("type")
        req_action = req.get("action")
        data = req.get("data", {})

        handler = self.actions[req_type][req_action]

        if handler is None:
            return {"isSuccess": False, "message": "invalid handler"}

        return handler(**data)


if __name__ == "__main__":
    Daemon().start()
