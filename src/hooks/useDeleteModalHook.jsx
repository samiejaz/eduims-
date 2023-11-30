import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { ButtonGroup } from "react-bootstrap";

const useDeleteModal = (handleDelete) => {
  const [show, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

  const handleShow = (id) => {
    setIdToDelete(id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return {
    handleShow,
    handleClose,
    setIdToDelete,
    render: (
      <Dialog
        visible={show}
        onHide={handleClose}
        header="Confirm Delete"
        style={{ width: "30vw", height: "28vh" }}
        footer={
          <>
            <ButtonGroup className="gap-2">
              <Button
                className="rounded"
                onClick={handleClose}
                type="button"
                severity="secondary"
              >
                No
              </Button>
              <Button
                className="rounded"
                severity="danger"
                type="button"
                onClick={() => handleDelete(idToDelete)}
              >
                Yes
              </Button>
            </ButtonGroup>
          </>
        }
      >
        Are you sure you want to delete?
      </Dialog>
    ),
  };
};

export default useDeleteModal;
