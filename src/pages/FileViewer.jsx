import { useEffect, useState } from "react";
import * as File from "react-file-viewer";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import Viewer from "react-office-viewer";
export function FileViewer({ filePath = "", fileType = "" }) {
  const docs = [{ uri: filePath, fileType: fileType }];

  return (
    <div>
      {filePath !== "" && fileType !== "" && (
        <>
          {fileType === "docx" || fileType === "xlsx" ? (
            <>
              <div id="hideInput">
                <Viewer file={filePath} />
              </div>
            </>
          ) : (
            <>
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default FileViewer;
