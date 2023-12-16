from firebase_functions import https_fn, options
from firebase_admin import initialize_app

from PyPDF2 import PdfReader

import urllib.request
import io

initialize_app()

@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"]))
def parse_pdf(req: https_fn.Request) -> https_fn.Response:
    data = req.get_json()
    if data and "pdf_link" in data:
        pdf_link = data["pdf_link"]
    text = ""
    request = urllib.request.Request(pdf_link, headers={"User-Agent": "Mozilla/5.0"})
    remote_file = urllib.request.urlopen(request).read()
    remote_file_bytes = io.BytesIO(remote_file)
    reader = PdfReader(remote_file_bytes)

    for i in range(len(reader.pages)):
        page = reader.pages[i]
        text += page.extract_text()
    return https_fn.Response(text)
