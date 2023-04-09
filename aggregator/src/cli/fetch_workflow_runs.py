from src.application.workflow_run import WorkflowRun
from src.config import Config
from src.data_source.github_client import Client
from src.repositories.workflow_repository import WorkflowRepository

client = Client()
config = Config()

workflow_run_repository = WorkflowRepository(config, client)
workflow = WorkflowRun(workflow_run_repository)
workflow.run()
