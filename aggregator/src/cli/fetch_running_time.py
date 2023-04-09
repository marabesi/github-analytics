from src.application.running_time_run import RunningTimeRun
from src.config import Config
from src.data_source.github_client import Client
from src.repositories.data_points_repository import DataPointsRepository
from src.repositories.job_repository import JobRepository

config = Config()
client = Client()

job_repository = JobRepository(config, client)
data_points_repository = DataPointsRepository(config)

running = RunningTimeRun(config, job_repository)
data_points = running.run()

data_points_repository.store_data_points(data_points)
