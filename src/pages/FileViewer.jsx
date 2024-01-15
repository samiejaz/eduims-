// import axios from "axios";
// import React, { useState, useEffect } from "react";

// const FileViewer = () => {
//   const [html, setHTML] = useState();

//   useEffect(() => {
//     async function FetchFile() {
//       const response = await axios.get(
//         "http://192.168.9.110:90/api/data_LeadIntroduction/DownloadLeadProposal?filename=638409364336147468.docx",
//         {}, // replace {} with your request body if needed
//         { responseType: "blob" }
//       );
//       var url = window.URL.createObjectURL(
//         new Blob([response.data], { type: "application/docx" })
//       );
//       setHTML(url);
//     }

//     FetchFile();
//   }, []);

//   return (
//     <>
//       <h1>FileViewer</h1>
//       <iframe
//         title="Document Viewer"
//         src={
//           "http://192.168.9.110:90/api/data_LeadIntroduction/DownloadLeadProposal?filename=638409363789685189.xlsx"
//         }
//         // src={`https://docs.google.com/gview?url=http://192.168.9.110:90/api/data_LeadIntroduction/DownloadLeadProposal?filename=638409364336147468.docx`}
//         width="100%"
//         height="600"
//       />
//     </>
//   );
// };

// export default FileViewer;
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

function FileViewer() {
  const docs = [
    {
      uri: "https://192.168.9.110:90/api/data_LeadIntroduction/DownloadLeadProposal?filename=638409363789685189.xlsx",
    }, // Remote file
  ];

  return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
}

export default FileViewer;
