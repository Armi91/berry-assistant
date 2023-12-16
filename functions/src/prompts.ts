export const textFromPdfPrompt = (text: string) => {
  return `Here is the text from the pdf file. We'll use this to help you answer the question. I will call it file or plik in Polish.
  \n\n
  Start of text: ${text}
  \n\n
  End of text.
  In your next message answer that you recieved the file and ask me if I have any questions about it. Use the language that we were using before.
  `;
};
