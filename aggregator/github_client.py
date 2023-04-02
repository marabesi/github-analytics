import json
import os
import requests
from dotenv import load_dotenv

load_dotenv()


class Client:
    def __init__(self):
        self.token = os.getenv("GITHUB_API_TOKEN")
        self.github_api = "https://api.github.com"
        self.headers = {'Authorization': "Bearer {}".format(self.token)}

    def fetch_json(self, url, payload):
        result = requests.get(self.github_api + url, params=payload, headers=self.headers)

        if result.status_code != 200:
            raise RuntimeError("Wrong request, status {}, error: {}, {}", result.status_code, str(result.content), str(result.request.headers))

        return json.loads(result.text)

    def fetch_json_from_raw_url(self, url):
        result = requests.get(url, headers=self.headers)

        if result.status_code != 200:
            raise RuntimeError("Wrong request, status {}, error: {}, {}", result.status_code, str(result.content), str(result.request.headers))

        return json.loads(result.text)
