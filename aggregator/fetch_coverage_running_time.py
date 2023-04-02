import os
import json

job_runs = os.listdir("./output/jobs")

target_step = "Coverage ✅"

total_steps = 0

for job in job_runs:
    if job.endswith(".json"):
        with open("./output/jobs/{}".format(job), "r") as job_file:
            try:
                read = job_file.read()
                content = json.loads(read)

                for step in content["steps"]:
                    if step["name"] == target_step:
                        total_steps = total_steps + 1
                        print("coverage started {} ended {}".format(step["started_at"], step["completed_at"]))
            except:
                print("cannot load file {}".format(job))

print("{} step(s) {}".format(target_step, total_steps))
