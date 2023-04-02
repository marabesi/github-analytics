import requests
import json
import time
import os

from config import Config

from dotenv import load_dotenv

from github_client import Client

load_dotenv()

token = os.getenv("GITHUB_API_TOKEN")
github_api = "https://api.github.com"

headers = {'Authorization': "Bearer {}".format(token)}

config = Config()
client = Client()

workflow_runs = os.listdir(config.workflows_destination)
jobs_destination = config.jobs_destination


def fetch_job(workflow_run):
    url = workflow_run["jobs_url"]
    response = client.fetch_json_from_raw_url(url)
    return response


def store_job(job_data):
    for current_job in job_data["jobs"]:
        full_path = "{}/{}.json".format(jobs_destination, current_job["id"])
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, "w") as job_run:
            job_run.write(json.dumps(current_job, indent=2))


for run in workflow_runs:
    if run.endswith(".json"):
        print("loading {}".format(run))
        with open("{}/{}".format(config.workflows_destination, run), "r") as file:
            try:
                read = file.read()
                content = json.loads(read)
                job = fetch_job(content)
                store_job(job)
            except Exception as error:
                print("cannot load file {} {}".format(run, error))
    print("done {}".format(run))
    time.sleep(2)
