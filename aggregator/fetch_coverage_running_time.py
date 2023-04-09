import os
import json
from datetime import datetime

from config import Config

config = Config()

job_runs = os.listdir(config.jobs_destination)

target_step = config.job_target

total_steps = 0

data_points = []

for job in job_runs:
    if job.endswith(".json"):
        with open("{}/{}".format(config.jobs_destination, job), "r") as job_file:
            try:
                read = job_file.read()
                content = json.loads(read)

                for step in content["steps"]:
                    if step["name"] == target_step and step["status"] == "completed":
                        total_steps = total_steps + 1
                        started_at_ = step["started_at"]
                        completed_at_ = step["completed_at"]
                        print("coverage started {} ended {}".format(started_at_, completed_at_))

                        # refs https://www.tutorialspoint.com/How-do-I-get-an-ISO-8601-date-in-string-format-in-Python
                        start_time = datetime.strptime(started_at_, "%Y-%m-%dT%H:%M:%S.%f%z")
                        completed_time = datetime.strptime(completed_at_, "%Y-%m-%dT%H:%M:%S.%f%z")

                        delta = completed_time - start_time
                        seconds = delta.total_seconds()

                        print("{} seconds".format(seconds))
                        data_points.append({
                            'x': seconds,
                            'y': 1
                        })

            except Exception as error:
                print("cannot load file {}, {}".format(job, error))

with open("{}".format(config.result_destination), "w") as result:
    result.write(json.dumps(data_points))

print("{} step(s) {}".format(target_step, total_steps))
