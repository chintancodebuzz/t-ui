"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct } from "../../store/slices/productSlice";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SearchableSelect from "../ui/SearchableSelect";
import Button from "../ui/Button";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const ProductForm = ({ product, onClose, mode = "create" }) => {
  const dispatch = useDispatch();
  const { options } = useSelector((state) => state.products);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image?.url || "");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Conditionally require status only for edit mode
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Product name is required")
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name must be less than 100 characters"),
    category: Yup.string().required("Category is required"),
    mrp: Yup.number()
      .required("MRP is required")
      .positive("MRP must be positive")
      .typeError("MRP must be a number")
      .test(
        "maxDecimal",
        "MRP can have maximum 2 decimal places",
        (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
      ),
    distributorRate: Yup.number()
      .required("Distributor rate is required")
      .positive("Distributor rate must be positive")
      .typeError("Distributor rate must be a number")
      .test(
        "maxDecimal",
        "Distributor rate can have maximum 2 decimal places",
        (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
      ),
    retailerPrice: Yup.number()
      .required("Retailer price is required")
      .positive("Retailer price must be positive")
      .typeError("Retailer price must be a number")
      .test(
        "maxDecimal",
        "Retailer price can have maximum 2 decimal places",
        (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
      ),
    uom: Yup.string().required("Unit of Measure is required"),
    unit: Yup.number()
      .required("Unit is required")
      .integer("Unit must be a whole number")
      .positive("Unit must be positive")
      .min(1, "Unit must be at least 1")
      .typeError("Unit must be a number"),
    crt: Yup.number()
      .required("CRT is required")
      .positive("CRT must be positive")
      .typeError("CRT must be a number")
      .test(
        "maxDecimal",
        "CRT can have maximum 2 decimal places",
        (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
      ),
    weight: Yup.number()
      .nullable()
      .positive("Weight must be positive")
      .typeError("Weight must be a number")
      .test(
        "maxDecimal",
        "Weight can have maximum 2 decimal places",
        (value) => !value || /^\d+(\.\d{1,2})?$/.test(value)
      ),
    weightUnit: Yup.string().nullable(),
    // Conditionally require status only for edit mode
    ...(mode === "edit" && {
      status: Yup.string().required("Status is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      category: product?.category || "",
      mrp: product?.mrp || "",
      distributorRate: product?.distributorRate || "",
      retailerPrice: product?.retailerPrice || "",
      uom: product?.uom || "",
      unit: product?.unit || "",
      crt: product?.crt || "",
      weight: product?.weight || "",
      weightUnit: product?.weightUnit || "",
      // Only set status for edit mode
      ...(mode === "edit" && { status: product?.status || "active" }),
    },
    validationSchema,
    onSubmit: async (values) => {
      if (mode === "create" && !imageFile && !imagePreview) {
        return;
      }

      if (
        mode === "edit" &&
        !imageFile &&
        !product?.image?.url &&
        !imagePreview
      ) {
        return;
      }

      setLoading(true);
      setUploadProgress(0);

      try {
        const formDataToSend = new FormData();

        Object.keys(values).forEach((key) => {
          if (
            values[key] !== "" &&
            values[key] !== null &&
            values[key] !== undefined
          ) {
            formDataToSend.append(key, values[key]);
          }
        });

        if (imageFile) {
          formDataToSend.append("image", imageFile);

          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + Math.random() * 30;
            });
          }, 200);
        } else if (mode === "edit" && product?.image?.url && !imageFile) {
          formDataToSend.append("existingImage", product.image.url);
        }

        if (mode === "create") {
          await dispatch(
            createProduct({
              data: formDataToSend,
              hasImage: !!imageFile,
            })
          ).unwrap();
        } else {
          await dispatch(
            updateProduct({
              id: product._id,
              data: formDataToSend,
              hasImage: !!imageFile,
            })
          ).unwrap();
        }

        setUploadProgress(100);
        onClose();
      } catch (error) {
        console.error("Form submission error:", error);
        setUploadProgress(0);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let actualValue = value;
    if (value && typeof value === "object" && value.target) {
      actualValue = value.target.value;
    }

    const processedValue = [
      "mrp",
      "distributorRate",
      "retailerPrice",
      "unit",
      "crt",
      "weight",
    ].includes(name)
      ? actualValue === ""
        ? ""
        : actualValue
      : actualValue;

    formik.setFieldValue(name, processedValue);
    formik.setFieldTouched(name, true, false);
  };

  const handleBlur = (e) => {
    formik.handleBlur(e);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, PNG, and GIF images are allowed");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name *"
          name="name"
          value={formik.values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.name && formik.errors.name}
          required
          placeholder="Enter product name"
        />

        <SearchableSelect
          label="Category *"
          name="category"
          value={formik.values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.category && formik.errors.category}
          required
          options={
            options?.categories?.map((cat) => ({ label: cat, value: cat })) ||
            []
          }
          placeholder="Search category"
        />

        <Input
          label="MRP (Maximum Retail Price) *"
          name="mrp"
          type="number"
          value={formik.values.mrp}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.mrp && formik.errors.mrp}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <Input
          label="Distributor Rate *"
          name="distributorRate"
          type="number"
          value={formik.values.distributorRate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            formik.touched.distributorRate && formik.errors.distributorRate
          }
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <Input
          label="Retailer Price *"
          name="retailerPrice"
          type="number"
          value={formik.values.retailerPrice}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.retailerPrice && formik.errors.retailerPrice}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <SearchableSelect
          label="Unit of Measure (UOM) *"
          name="uom"
          value={formik.values.uom}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.uom && formik.errors.uom}
          required
          options={
            options?.uoms?.map((uom) => ({ label: uom, value: uom })) || []
          }
          placeholder="Search UOM"
        />

        <Input
          label="Unit *"
          name="unit"
          type="number"
          value={formik.values.unit}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.unit && formik.errors.unit}
          required
          min="1"
          placeholder="1"
        />

        <Input
          label="CRT *"
          name="crt"
          type="number"
          value={formik.values.crt}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.crt && formik.errors.crt}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <Input
          label="Weight"
          name="weight"
          type="number"
          value={formik.values.weight}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.weight && formik.errors.weight}
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <Select
          label="Weight Unit"
          name="weightUnit"
          value={formik.values.weightUnit}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.weightUnit && formik.errors.weightUnit}
          options={
            options?.weightUnits?.map((unit) => ({
              label: unit,
              value: unit,
            })) || []
          }
          placeholder="Select weight unit"
        />

        {/* Conditionally render status field only in edit mode */}
        {mode === "edit" && (
          <Select
            label="Status *"
            name="status"
            value={formik.values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formik.touched.status && formik.errors.status}
            required
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            placeholder="Select status"
          />
        )}
      </div>

      <div className="space-y-3 border-t border-[var(--border-color)] pt-6">
        <label className="block text-sm font-semibold text-[var(--text-primary)]">
          Product Image *
        </label>
        <div className="flex items-center gap-6">
          <div className="relative flex-1">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center gap-3 px-4 py-4 bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary-500)] transition-all duration-200 group"
            >
              <Icon
                icon="mdi:cloud-upload-outline"
                className="text-2xl text-[var(--primary-600)] group-hover:scale-110 transition-transform"
              />
              <div className="text-left">
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  Choose Image
                </span>
                <span className="block text-xs text-[var(--text-tertiary)]">
                  JPG, PNG, GIF. Max 5MB
                </span>
              </div>
            </label>
          </div>

          {imagePreview && (
            <div className="relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-[var(--border-color)] shadow-md">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");
                  setUploadProgress(0);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent-red)] text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-md"
              >
                <Icon icon="mdi:close" className="text-sm" />
              </button>
            </div>
          )}
        </div>

        {mode === "create" && !imagePreview && formik.submitCount > 0 && (
          <p className="text-sm text-red-500">Product image is required</p>
        )}
        {mode === "edit" &&
          !imagePreview &&
          !product?.image?.url &&
          formik.submitCount > 0 && (
            <p className="text-sm text-red-500">Product image is required</p>
          )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Uploading image...
              </span>
              <span className="text-xs font-medium text-[var(--primary-600)]">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading || formik.isSubmitting}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
