import time

from src.config import Config
from src.data_source.github_client import Client
from src.repositories.job_repository import JobRepository
from src.repositories.workflow_repository import WorkflowRepository

config = Config()
client = Client()

workflow_repository = WorkflowRepository(config, client)
job_repository = JobRepository(config, client)

for run in workflow_repository.fetch_stored_workflows():
    try:
        job = job_repository.fetch_job(run)
        job_repository.store_job(job)
    except Exception as error:
        print("cannot load file {} {}".format(run["id"], error))
    print("done {}".format(run["id"]))
    time.sleep(2)
