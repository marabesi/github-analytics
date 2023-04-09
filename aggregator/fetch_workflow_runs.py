from src.application.workflow_run import WorkflowRun
from src.config import Config
from src.data_source.github_client import Client
from src.repositories.workflow_repository import WorkflowRepository

# start page to fetch data
page = 1

# How many items per page to be fetched
size = 100

# Tracks the total of items in github
total = 0

# Tracks the total of items requested, this is also used as a exit condition
total_fetched = 0

client = Client()

config = Config()

# user = config.user
# repository = config.repository
# workflow_file_name = config.workflow_file_name
# branch = config.branch
#
# destination = config.workflows_destination
#
# while True:
#     payload = {'page': page, 'per_page': size, 'branch': branch}
#     print("fetching {}".format(payload))
#
#     url = "/repos/{}/{}/actions/workflows/{}/runs".format(user, repository, workflow_file_name)
#     response = client.fetch_json(url, payload)
#
#     for run in response["workflow_runs"]:
#         full_path = "{}/{}.json".format(destination, run["id"])
#         # https://stackoverflow.com/questions/12517451/automatically-creating-directories-with-file-output
#         os.makedirs(os.path.dirname(full_path), exist_ok=True)
#
#         with open(full_path, "w") as workflow_run:
#             workflow_run.write(json.dumps(run, indent=2))
#
#     total = int(response["total_count"])
#
#     total_fetched = total_fetched + size
#
#     page = page + 1
#
#     if total_fetched > total:
#         print("Total in github {}, total requested {}".format(total, total_fetched))
#         break
#
#     time.sleep(5)

workflow_run_repository = WorkflowRepository(config, client)
workflow = WorkflowRun(workflow_run_repository)
workflow.run()
