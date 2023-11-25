export function FormatDate(dateString) {
  const formattedDate = `${dateString.slice(0, 4)}-${dateString.slice(
    5,
    7
  )}-${dateString.slice(8, 10)}`;
  return formattedDate;
}

export function preventFormByEnterKeySubmission(e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}

export function convertBase64StringToFile(imageString) {
  const base64Image = "data:image/png;base64," + imageString;
  const byteString = atob(base64Image.split(",")[1]);
  const bytes = new ArrayBuffer(byteString.length);
  const byteArray = new Uint8Array(bytes);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "image/png" });
  const fileName = "image.png";
  const file = new File([blob], fileName, { type: "image/png" });
  return file;
}

export function getTodaysDate() {
  const today = new Date();
  const month = today.getMonth() + 1; // Months are zero-indexed
  const date = today.getDate();
  const year = today.getFullYear();

  // Format the date in the desired format
  const formattedDate = `${date}-${month}-${year}`;

  return formattedDate;
}
