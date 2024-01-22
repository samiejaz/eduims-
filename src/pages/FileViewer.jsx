import { useEffect, useRef, useState } from "react";
import * as File from "react-file-viewer";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import Viewer from "react-office-viewer";
import React from "react";
export const FileViewer = React.forwardRef(
  ({ filePath = "", fileType = "" }, ref) => {
    const docs = [{ uri: filePath, fileType: fileType }];

    return (
      <div>
        {filePath !== "" && fileType !== "" && (
          <>
            {/* {fileType === "docx" || fileType === "xlsx" ? (
              <>
                <div className="hideInput" ref={ref}>
                  <Viewer file={filePath} />
                </div>
              </>
            ) : ( */}
            <>
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
              />
            </>
            {/* )} */}
          </>
        )}
      </div>
    );
  }
);
