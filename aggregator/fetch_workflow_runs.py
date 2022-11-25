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
repository = "json-tool"
workflow_file_name = "ci.yml"

while True:
    payload = {'page': page, 'per_page': size}
    print("fetching {}".format(payload))
    
    result = requests.get(github_api + "/repos/{}/{}/actions/workflows/{}/runs".format(user, repository, workflow_file_name), params=payload)

    response = json.loads(result.text)
    
    total = int(response["total_count"])

    total_fetched = total_fetched + size
    
    page = page + 1
    
    if total_fetched > total:
        print("Total in github {}, total requested {}".format(total, total_fetched))
        break

    time.sleep(5)
