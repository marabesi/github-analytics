class FetchWorkflowRun:
    def run(self):
        pass


class TestFetchWorkflowRun:
    def fetch_first_page_of_workflow_run(self):
        payload = {'page': 1, 'per_page': 100, 'branch': "main"}

        workflow = FetchWorkflowRun()

        # verify client was called with params
        # verify the output was sent