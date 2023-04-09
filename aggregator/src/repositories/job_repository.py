import json
import os

from src.config import Config
from src.data_source.github_client import Client


class JobRepository:
    def __init__(self, config: Config, client: Client):
        self.config = config
        self.client = client
        self.target_step = config.job_target

    def load_steps_inside_jobs(self):
        steps = []
        job_runs = os.listdir(self.config.jobs_destination)
        for job in job_runs:
            if job.endswith(".json"):
                with open("{}/{}".format(self.config.jobs_destination, job), "r") as job_file:
                    try:
                        read = job_file.read()
                        content = json.loads(read)

                        for step in content["steps"]:
                            steps.append(step)
                    except Exception as error:
                        print("cannot load file {}, {}".format(job, error))
        return steps

    def fetch_job(self, workflow_run):
        url = workflow_run["jobs_url"]
        response = self.client.fetch_json_from_raw_url(url)
        return response

    def store_job(self, job_data):
        for current_job in job_data["jobs"]:
            full_path = "{}/{}.json".format(self.config.jobs_destination, current_job["id"])
            os.makedirs(os.path.dirname(full_path), exist_ok=True)

            with open(full_path, "w") as job_run:
                job_run.write(json.dumps(current_job, indent=2))

