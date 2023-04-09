from src.repositories.job_repository import JobRepository


class FakeConfig:
    def __init__(self):
        self.job_target = "Test"
        self.jobs_destination = "tests/integration/fixtures/single"


class FakeConfigMultiple:
    def __init__(self):
        self.job_target = "Test"
        self.jobs_destination = "tests/integration/fixtures/double"


class TestJobRepository:
    def test_should_load_all_steps_from_a_single_job_run(self):
        config = FakeConfig()
        repository = JobRepository(config)
        fetched = repository.load_steps_inside_jobs()

        steps_count_from_job = 11

        assert len(fetched) == steps_count_from_job

    def test_should_load_all_steps_from_multiple_job_run(self):
        config = FakeConfigMultiple()
        repository = JobRepository(config)
        fetched = repository.load_steps_inside_jobs()

        steps_count_from_job = 22

        assert len(fetched) == steps_count_from_job
