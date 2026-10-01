class NetworkManager:
    def __init__(self):
        self.handlers = {
            "get_usage_network": self.get_usage,
            "block_network": self.block,
            "set_limit_network": self.set_limit,
        }

    def get_usage(self):
        pass

    def set_limit(self, pid, download, upload):
        pass

    def block(self, pid):
        pass
