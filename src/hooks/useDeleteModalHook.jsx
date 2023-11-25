import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

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
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the record?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="danger" onClick={() => handleDelete(idToDelete)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    ),
  };
};

export default useDeleteModal;
