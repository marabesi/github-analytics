#!/usr/bin/bash

poetry run python fetch_workflow_runs.py
poetry run python fetch_job_runs.py
poetry run python fetch_coverage_running_time.py
poetry run python plot.py
