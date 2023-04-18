from slugify import slugify


class Config:
    def __init__(self):
        # self.user = "marabesi"
        # self.repository = "social-publisher"
        # self.workflow_file_name = "ci.yml"
        # self.branch = "main"
        # self.job_target = "Test integration with twitter"
        # # self.job_target = "Build with Gradle"
        # # self.job_target = "Test and coverage"
        self.filters = [
            # {'field': "status", 'value': "completed", 'condition': "==", 'type': "Text"},
            # {'field': "completed_at", 'value': ["2023-04-01", "2023-04-30"], 'condition': "IS_IN_BETWEEN", 'type': "DATETIME"},
        ]
        self.sort = [
            {'completed': "asc"}
        ]

        # self.user = "marabesi"
        # self.repository = "tdd-anti-patterns-book"
        # self.workflow_file_name = "latex.yml"
        # self.branch = "main"
        # self.job_target = "Compile LaTeX document"

        # self.user = "marabesi"
        # self.repository = "jest-clipboard"
        # self.workflow_file_name = "delivery.yml"
        # self.branch = "main"
        # self.job_target = "Run npm run coveralls"

        # self.user = "marabesi"
        # self.repository = "git-bot-release"
        # self.workflow_file_name = "php.yml"
        # self.branch = "main"
        # self.job_target = "Run unit test suite"

        # self.user = "marabesi"
        # self.repository = "github-stats-dashboard"
        # self.workflow_file_name = "deploy.yml"
        # self.branch = "main"
        # self.job_target = "Coverage ✅"

        self.job_target_folder = slugify(self.job_target)

        # workflows
        self.workflows_destination = "output/workflows/" + self.user + "-" + self.repository + "/" + self.workflow_file_name

        # jobs
        self.jobs_destination = "output/jobs/" + self.workflow_file_name + "/" + self.job_target_folder + "/" + self.user + "-" + self.repository

        # result
        self.result_destination = "output/" + self.user + "-" + self.repository + "-result.json"
