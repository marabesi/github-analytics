from src.application.job_run import JobRun
from src.config import Config
from src.data_source.github_client import Client
from src.repositories.job_repository import JobRepository
from src.repositories.workflow_repository import WorkflowRepository

config = Config()
client = Client()

workflow_repository = WorkflowRepository(config, client)
job_repository = JobRepository(config, client)

job = JobRun(workflow_repository, job_repository)
job.run()
