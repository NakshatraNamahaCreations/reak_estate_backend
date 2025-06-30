const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByCity,
  getPropertiesByType,
  getPropertyByDetails,
  getPropertyByIDandType,
} = require("../../Controller/Sellproperty/Sellproperty");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/sellproperty");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only jpeg, jpg, and png files are allowed."));
    }
  },
});

const router = express.Router();

router.get("/properties", getAllProperties);

router.get("/properties/:id", getPropertyById);

router.post("/properties", upload.array("propertyimage", 5), createProperty);

router.put("/properties/:id", upload.array("propertyimage", 5), updateProperty);

router.delete("/properties/:id", deleteProperty);

router.get("/properties/city", getPropertiesByCity);

router.get("/properties/type", getPropertiesByType);

router.get("/properties/:propertyId/:customerId/:type", getPropertyByDetails);

router.get("/getPropertyByIDandType/:propertyId/:type", getPropertyByIDandType);

module.exports = router;
