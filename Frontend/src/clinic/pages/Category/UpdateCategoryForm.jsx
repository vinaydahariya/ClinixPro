import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Grid2,
} from "@mui/material";
import "tailwindcss/tailwind.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../../Redux/Category/action";
import { useParams } from "react-router-dom";

const UpdateCategoryForm = ({onClose}) => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { category } = useSelector((store) => store);



  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(updateCategory({ category: values, id }));
      onClose();
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    // const image = URL.createObjectURL(file);
    console.log("uploaded images : ", image);
    formik.setFieldValue("image", image);
    setUploadingImage(false);
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", "");
  };



  useEffect(() => {
    dispatch(getCategoryById(id));
  }, []);

  useEffect(() => {
    if (category.category) {
      formik.setFieldValue("name", category.category.name);
      formik.setFieldValue("image", category.category.image);
    }
  }, [category.category]);


  return (
    <div className="flex justify-center items-center">
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4 w-full ">
        <Grid2 container spacing={2}>
          <Grid2 className="w-24 h-24" size={{ xs: 12 }}>
            {formik.values.image ? (
              <div className="relative border ">
                <img
                  className="w-24 h-24 object-cover"
                  src={formik.values.image}
                  alt={`Service-Image `}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  className=""
                  size="small"
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    outline: "none",
                  }}
                >
                  <CloseIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <label className="relative" htmlFor="fileInput">
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                    <AddPhotoAlternateIcon className="text-gray-700" />
                  </span>
                  {uploadImage && (
                    <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                      <CircularProgress />
                    </div>
                  )}
                </label>
              </>
            )}
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 12 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              required
            />
          </Grid2>

          <Grid2 size={12}>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              sx={{ py: ".8rem" }}
            >
              update
            </Button>
          </Grid2>
        </Grid2>
      </form>
      
    </div>
  );
};

export default UpdateCategoryForm;
