from process import ProcessManager
from network import NetworkManager

class Daemon:
    def __init__(self):
            self.processes = ProcessManager()
            self.network = NetworkManager() 