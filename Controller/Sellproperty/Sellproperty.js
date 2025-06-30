const Property = require("../../Model/Sellproperty/Sellproperty");

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching properties" });
  }
};

exports.getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching property" });
  }
};

exports.createProperty = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const propertyData = { ...req.body };

    ["amenities", "nearbyplace", "googleaddress"].forEach((field) => {
      if (propertyData[field] && typeof propertyData[field] === "string") {
        try {
          propertyData[field] = JSON.parse(propertyData[field]);
        } catch (error) {
          return res.status(400).json({
            message: `Invalid JSON format in ${field}`,
            error: error.message,
          });
        }
      }
    });

    if (req.files && req.files.length > 0) {
      propertyData.propertyimage = req.files.map((file) => file.path);
    }

    const property = new Property(propertyData);
    await property.save();

    const savedProperty = await Property.findById(property._id);

    res.status(201).json({
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : undefined;

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        ...req.body,
        propertyimage: imagePaths ? imagePaths : undefined,
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found to update" });
    }

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating property" });
  }
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found to delete" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting property" });
  }
};

exports.getPropertiesByCity = async (req, res) => {
  const { city } = req.query;
  try {
    const properties = await Property.find({ city: city });
    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: "No properties found for this city" });
    }
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching properties by city" });
  }
};

exports.getPropertiesByType = async (req, res) => {
  const { type } = req.query;
  try {
    const properties = await Property.find({ type: type });
    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: "No properties found for this type" });
    }
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching properties by type" });
  }
};

exports.getPropertyByDetails = async (req, res) => {
  const { propertyId, customerId, type } = req.params;

  try {
    const property = await Property.findOne({
      _id: propertyId,
      customerId: customerId,
      type: type,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found for this customer with the specified type",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching property by propertyId, customerId, and type",
    });
  }
};

exports.getPropertyByIDandType = async (req, res) => {
  const { propertyId, type } = req.params;

  try {
    const property = await Property.findOne({
      _id: propertyId,
      type: type,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found for this customer with the specified type",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching property by propertyId, customerId, and type",
    });
  }
};
