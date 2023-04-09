import json
import os

from src.config import Config
from src.data_source.github_client import Client


class WorkflowRepository:
    def __init__(self, config: Config, client: Client):
        self.config = config
        self.client = client

    def fetch(self, page=1, size=100):
        user = self.config.user
        repository = self.config.repository
        workflow_file_name = self.config.workflow_file_name
        branch = self.config.branch

        destination = self.config.workflows_destination
        payload = {'page': page, 'per_page': size, 'branch': branch}
        print("fetching {}".format(payload))

        url = "/repos/{}/{}/actions/workflows/{}/runs".format(user, repository, workflow_file_name)
        response = self.client.fetch_json(url, payload)

        for run in response["workflow_runs"]:
            full_path = "{}/{}.json".format(destination, run["id"])
            # https://stackoverflow.com/questions/12517451/automatically-creating-directories-with-file-output
            os.makedirs(os.path.dirname(full_path), exist_ok=True)

            with open(full_path, "w") as workflow_run:
                workflow_run.write(json.dumps(run, indent=2))

        return response

    def fetch_stored_workflows(self):
        stored_workflows = []
        workflow_runs = os.listdir(self.config.workflows_destination)
        for run in workflow_runs:
            if run.endswith(".json"):
                print("loading {}".format(run))
                with open("{}/{}".format(self.config.workflows_destination, run), "r") as file:
                    try:
                        read = file.read()
                        content = json.loads(read)
                        stored_workflows.append(content)
                    except Exception as error:
                        print("cannot load file {} {}".format(run, error))
        return stored_workflows
