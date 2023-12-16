import axios from "axios";

export const getTextFromPdf = async (pdf_link: string) => {
  // const functionUrl = 'http://127.0.0.1:5001/berry-assistant-f865d/us-central1/parse_pdf'
  const functionUrl = 'https://parse-pdf-vsx63c7hga-uc.a.run.app';
  const body = {
    pdf_link
  }
  try {
    const response = await axios.post(functionUrl, body);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
