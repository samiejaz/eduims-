import { Row, ButtonGroup, Button, Spinner } from "react-bootstrap";
function ButtonRow({
  isDirty,
  isValid,
  editMode,
  isSubmitting,
  handleAddNew,
  handleCancel,
  viewRecord,
  editRecord,
  newRecord,
  handleEdit,
  handleDelete,
  disableDelete = false,
  customOnClick = undefined,
}) {
  return (
    <Row className="p-3" style={{ marginTop: "-25px" }}>
      <ButtonGroup className="gap-2 rounded-2">
        {viewRecord && (
          <>
            <Button
              disabled={editMode}
              variant="success"
              style={{ marginTop: "30px" }}
              className="btn btn-primary p-2 rounded-sm fw-bold"
              onClick={() => handleEdit()}
            >
              Edit
            </Button>
            <Button
              disabled={editMode}
              variant="primary"
              style={{ marginTop: "30px" }}
              className="btn btn-primary p-2 rounded-sm fw-bold"
              onClick={() => handleAddNew()}
            >
              Add New
            </Button>
            <Button
              variant="danger"
              style={{ marginTop: "30px" }}
              className="btn btn-danger p-2 rounded-sm fw-bold"
              onClick={() => handleDelete()}
              disabled={disableDelete}
            >
              Delete
            </Button>
          </>
        )}
        {editRecord && (
          <>
            <Button
              disabled={!isValid || !editMode || isSubmitting}
              variant="success"
              style={{ marginTop: "30px" }}
              className="btn btn-primary p-2 rounded-sm fw-bold"
              type="submit"
              //  type="button"
              onClick={() => customOnClick()}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span> Updating...</span>
                </>
              ) : (
                "Update"
              )}
            </Button>

            <Button
              variant="danger"
              disabled={isSubmitting}
              style={{ marginTop: "30px" }}
              className="btn btn-danger p-2 rounded-sm fw-bold"
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </>
        )}
        {newRecord && (
          <>
            <Button
              disabled={!isValid || !editMode || isSubmitting}
              variant="success"
              style={{ marginTop: "30px" }}
              className="btn btn-primary p-2 rounded-sm fw-bold"
              type="submit"
              onClick={customOnClick}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span> Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </Button>

            <Button
              disabled={!isValid || !editMode || isSubmitting}
              variant="danger"
              style={{ marginTop: "30px" }}
              className="btn btn-danger p-2 rounded-sm fw-bold"
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </>
        )}
      </ButtonGroup>
    </Row>
  );
}

export default ButtonRow;
