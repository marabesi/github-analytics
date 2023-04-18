from datetime import datetime
from operator import attrgetter

from src.config import Config
from src.repositories.job_repository import JobRepository


class RunningTimeRun:
    def __init__(self, config: Config, job_repository: JobRepository):
        self.config = config
        self.job_repository = job_repository

    def run(self):
        target_step = self.config.job_target
        step_status = self.config.job_status

        total_steps = 0

        data_points = []

        for step in self.job_repository.load_steps_inside_jobs():
            if step["name"] == target_step and step["conclusion"] == step_status:
                if self.load_filters(step):
                    total_steps = total_steps + 1
                    started_at_ = step["started_at"]
                    completed_at_ = step["completed_at"]
                    print("{} started {} ended {}".format(step["name"], started_at_, completed_at_))

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

        print("{} step(s) {}".format(target_step, total_steps))

        # return sorted(data_points, key=attrgetter('x'), reverse=False)
        return data_points

    def load_filters(self, row):
        result = row
        if len(self.config.filters):
            result = False
            for filter in self.config.filters:
                field = filter["field"]
                type = filter["type"]
                filter_value = filter["value"]
                condition = filter["condition"]

                step_value = row[field]

                if condition == "IS_IN_BETWEEN":
                    if type == "DATETIME":
                        drop_tz = row[field].split("T")
                        step_value = datetime.strptime(drop_tz[0], "%Y-%m-%d")

                        start = datetime.strptime(filter_value[0], "%Y-%m-%d")
                        end = datetime.strptime(filter_value[1], "%Y-%m-%d")

                    if start <= step_value <= end:
                        result = row
                        continue
        return result
