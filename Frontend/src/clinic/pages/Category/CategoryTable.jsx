import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  Snackbar,
  styled,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";


import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import UpdateCategoryForm from "./UpdateCategoryForm";
import { useDispatch } from "react-redux";
import { deleteCategory } from "../../../Redux/Category/action";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};




export default function CategoryTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [openUpdateCategoryForm, setUpdateCategoryForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const handleOpenUpdateCategoryForm = (id) => () => {
    navigate(`/clinic-dashboard/category/${id}`);
    setUpdateCategoryForm(true);
  };
  const handleCloseUpdateCategoryForm = () => setUpdateCategoryForm(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedCategoryId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCategoryId) return;
    dispatch(deleteCategory(selectedCategoryId));
    handleCloseDeleteDialog();
  };


  const handleCloseDeleteDialog = () => {
    setSelectedCategoryId(null);
    setOpenDeleteDialog(false);
  };

  React.useEffect(() => {
    if (category.updated || category.error) {
      setOpenSnackbar(true);
    }
  }, [category.updated, category.error]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell align="center">Update</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {category.categories.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell component="th" scope="row">
                  <div className="flex gap-1 flex-wrap">
                    <img className="w-20 rounded-md" src={item.image} alt="" />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{item.name}</StyledTableCell>

                <StyledTableCell align="center">
                  <IconButton
                    onClick={handleOpenUpdateCategoryForm(item.id)}
                    color="primary"
                    sx={{
                      backgroundColor: "#e0f7fa",
                      "&:hover": { backgroundColor: "#b2ebf2" },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>

                <StyledTableCell align="center">
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(item.id)}
                    color="error"
                    sx={{
                      backgroundColor: "#ffebee",
                      "&:hover": { backgroundColor: "#ffcdd2" },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={openUpdateCategoryForm}
        onClose={handleCloseUpdateCategoryForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateCategoryForm onClose={handleCloseUpdateCategoryForm} />
        </Box>
      </Modal>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={category.updated ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {category.updated
            ? "Category updated successfully"
            : category.error?.message || "Something went wrong"}
        </Alert>

      </Snackbar>
    </>
  );
}
