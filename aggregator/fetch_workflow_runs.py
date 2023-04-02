import requests
import json
import time
import os
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("GITHUB_API_TOKEN")
github_api = "https://api.github.com"

headers = {'Authorization': "Bearer {}".format(token)}

# start page to fetch data
page = 1  

# How many items per page to be fetched
size = 100

# Tracks the total of items in github
total = 0

#Tracks the total of items requested, this is also used as a exit condition
total_fetched = 0

user = "marabesi"
repository = "github-stats-dashboard"
workflow_file_name = "deploy.yml"

while True:
    payload = {'page': page, 'per_page': size}
    print("fetching {}".format(payload))

    url = github_api + "/repos/{}/{}/actions/workflows/{}/runs".format(user, repository, workflow_file_name)
    result = requests.get(url, params=payload)

    response = json.loads(result.text)

    for run in response["workflow_runs"]:
        with open("output/workflows/{}.json".format(run["id"]), "w") as workflow_run:
            workflow_run.write(json.dumps(run, indent=2))

    total = int(response["total_count"])

    total_fetched = total_fetched + size
    
    page = page + 1
    
    if total_fetched > total:
        print("Total in github {}, total requested {}".format(total, total_fetched))
        break

    time.sleep(5)
