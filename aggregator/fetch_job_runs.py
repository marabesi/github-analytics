import requests
import json
import time
import os

workflow_runs = os.listdir("./output/workflows")

def fetch_job(workflow_run):
    url = workflow_run["jobs_url"]
    result = requests.get(url)

    response = json.loads(result.text)

    return response

def store_job(job_data):
    for job in job_data["jobs"]:
        with open("output/jobs/{}.json".format(job["id"]), "w") as job_run:
            job_run.write(json.dumps(job, indent=2))

for run in workflow_runs:
    if run.endswith(".json"):
        print("loading {}".format(run))
        with open("./output/workflows/{}".format(run), "r") as file:
            try:
                read = file.read()
                content = json.loads(read)
                job = fetch_job(content)
                store_job(job)
            except:
                print("cannot load file {}".format(run))
    print("done {}".format(run))
    time.sleep(2)
