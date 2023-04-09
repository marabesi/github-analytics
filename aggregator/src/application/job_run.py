import time

from src.repositories.job_repository import JobRepository
from src.repositories.workflow_repository import WorkflowRepository


class JobRun:
    def __init__(self, workflow_repository: WorkflowRepository, job_repository: JobRepository):
        self.job_repository = job_repository
        self.workflow_repository = workflow_repository

    def run(self):
        for run in self.workflow_repository.fetch_stored_workflows():
            try:
                job = self.job_repository.fetch_job(run)
                self.job_repository.store_job(job)
            except Exception as error:
                print("cannot load file {} {}".format(run["id"], error))
            print("done {}".format(run["id"]))
            time.sleep(2)
