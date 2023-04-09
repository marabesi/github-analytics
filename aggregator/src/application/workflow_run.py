import time

from src.repositories.workflow_repository import WorkflowRepository


class WorkflowRun:
    def __init__(self, workflow_repository: WorkflowRepository):
        self.workflow_repository = workflow_repository

    def run(self):
        page = 1
        size = 100
        total_fetched = 0
        while True:
            response = self.workflow_repository.fetch(page, size)
            total = int(response["total_count"])

            total_fetched = total_fetched + size

            page = page + 1

            if total_fetched > total:
                print("Total in github {}, total requested {}".format(total, total_fetched))
                break

            time.sleep(5)
