import json
import os

from src.config import Config


class JobRepository:
    def __init__(self, config: Config):
        self.config = config
        self.job_runs = os.listdir(config.jobs_destination)
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
