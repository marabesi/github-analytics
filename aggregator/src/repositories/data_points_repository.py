import json

from src.config import Config


class DataPointsRepository:
    def __init__(self, config: Config):
        self.config = config

    def store_data_points(self, data_points):
        with open("{}".format(self.config.result_destination), "w") as result:
            result.write(json.dumps(data_points))
