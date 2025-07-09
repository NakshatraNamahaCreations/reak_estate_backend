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

exports.toggleFavorite = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.favorite = !property.favorite;

    await property.save();

    res.status(200).json({
      message: `Favorite status updated to ${property.favorite}`,
      favorite: property.favorite,
    });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFavoritePropertiesByCustomer = async (req, res) => {
  const { customerId } = req.params;

  try {
    const favorites = await Property.find({
      customerId,
      favorite: true,
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    res.status(500).json({ message: "Internal server error" });
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

// exports.createProperty = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: "Request body is empty" });
//     }

//     const propertyData = { ...req.body };

//     ["amenities", "nearbyplace", "googleaddress", "occupancy_type"].forEach(
//       (field) => {
//         if (propertyData[field] && typeof propertyData[field] === "string") {
//           try {
//             propertyData[field] = JSON.parse(propertyData[field]);
//           } catch (error) {
//             return res.status(400).json({
//               message: `Invalid JSON format in ${field}`,
//               error: error.message,
//             });
//           }
//         }
//       }
//     );

//     if (req.files && req.files.length > 0) {
//       propertyData.propertyimage = req.files.map((file) => file.path);
//     }

//     const property = new Property(propertyData);
//     await property.save();

//     const savedProperty = await Property.findById(property._id);

//     res.status(201).json({
//       message: "Property created successfully",
//       property: savedProperty,
//     });
//   } catch (error) {
//     console.error("Create Property Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

exports.createProperty = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const propertyData = { ...req.body };

    // List all fields that may come as JSON strings and should be parsed
    [
      "amenities",
      "nearbyplace",
      "googleaddress",
      "occupancy_type",
      "profession_Type",
    ].forEach((field) => {
      if (propertyData[field] && typeof propertyData[field] === "string") {
        try {
          propertyData[field] = JSON.parse(propertyData[field]);
        } catch (error) {
          return res.status(400).json({
            message: "Invalid JSON format in ${field}",
            error: error.message,
          });
        }
      }
    });

    // Handle property images if files are uploaded
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
    console.error("Create Property Error:", error);
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

// exports.searchProperties = async (req, res) => {
//   try {
//     const {
//       propertytype,
//       type,
//       residentialtype,
//       commercialtype,
//       saletype,
//       sellertype,
//       Facing,
//       Dimensions,
//       totalarea,
//       city,
//       address,
//       landmark,
//       bedrooms,
//       bathrooms,
//       furnishing,
//       possessionstatus,
//       approvalauthority,
//       reraregistered,
//       expect_price,
//       floor_no,
//       customerId,
//       customerName,
//       customerNumber,
//       office_seats,
//       acre,
//       kunte,
//       diet,
//       bachelor_allowed,
//       occupancy_type,
//       food_provided,
//       profession_Type,
//       favorite,
//     } = req.body;

//     const filter = {};

//     if (propertytype) filter.propertytype = propertytype;
//     if (type) filter.type = type;
//     if (residentialtype) filter.residentialtype = residentialtype;
//     if (commercialtype) filter.commercialtype = commercialtype;
//     if (saletype) filter.saletype = saletype;
//     if (sellertype) filter.sellertype = sellertype;
//     if (Facing) filter.Facing = Facing;
//     if (Dimensions) filter.Dimensions = Dimensions;
//     if (totalarea) filter.totalarea = totalarea;
//     if (city) filter.city = city;
//     if (address) filter.address = new RegExp(address, "i");
//     if (landmark) filter.landmark = new RegExp(landmark, "i");
//     if (bedrooms) filter.bedrooms = bedrooms;
//     if (bathrooms) filter.bathrooms = bathrooms;
//     if (furnishing) filter.furnishing = furnishing;
//     if (possessionstatus) filter.possessionstatus = possessionstatus;
//     if (approvalauthority) filter.approvalauthority = approvalauthority;
//     if (reraregistered !== undefined)
//       filter.reraregistered =
//         reraregistered === true || reraregistered === "true";
//     if (expect_price) filter.expect_price = expect_price;
//     if (floor_no) filter.floor_no = floor_no;
//     if (customerId) filter.customerId = customerId;
//     if (customerName) filter.customerName = new RegExp(customerName, "i");
//     if (customerNumber) filter.customerNumber = customerNumber;
//     if (office_seats) filter.office_seats = Number(office_seats);
//     if (acre) filter.acre = acre;
//     if (kunte) filter.kunte = kunte;
//     if (diet) filter.diet = diet;
//     if (bachelor_allowed) filter.bachelor_allowed = bachelor_allowed;
//     if (occupancy_type) filter.occupancy_type = occupancy_type;
//     if (food_provided) filter.food_provided = food_provided;
//     if (profession_Type) filter.profession_Type = profession_Type;
//     if (favorite !== undefined)
//       filter.favorite = favorite === true || favorite === "true";

//     const properties = await Property.find(filter);
//     res.status(200).json(properties);
//   } catch (error) {
//     console.error("Search Properties Error:", error);
//     res.status(500).json({ message: "Error searching properties" });
//   }
// };

exports.searchProperties = async (req, res) => {
  try {
    const {
      propertytype,
      type,
      residentialtype,
      commercialtype,
      saletype,
      sellertype,
      Facing,
      Dimensions,
      totalarea,
      city,
      address,
      landmark,
      googleaddress,
      bedrooms,
      bathrooms,
      furnishing,
      possessionstatus,
      approvalauthority,
      reraregistered,
      amenities,
      expect_price,
      booking_tokenamount,
      nearbyplace,
      floor_no,
      customerId,
      customerName,
      customerNumber,
      propertyimage,
      office_seats,
      acre,
      kunte,
      diet,
      bachelor_allowed,
      occupancy_type,
      food_provided,
      profession_Type,
      favorite,
    } = req.body;

    const filter = {};

    if (propertytype) filter.propertytype = propertytype;
    if (type) filter.type = type;
    if (residentialtype) filter.residentialtype = residentialtype;
    if (commercialtype) filter.commercialtype = commercialtype;
    if (saletype) filter.saletype = saletype;
    if (sellertype) filter.sellertype = sellertype;
    if (Facing) filter.Facing = Facing;
    if (Dimensions) filter.Dimensions = Dimensions;
    if (totalarea) filter.totalarea = totalarea;
    if (city) filter.city = city;
    if (bedrooms) filter.bedrooms = bedrooms;
    if (bathrooms) filter.bathrooms = bathrooms;
    if (furnishing) filter.furnishing = furnishing;
    if (possessionstatus) filter.possessionstatus = possessionstatus;
    if (approvalauthority) filter.approvalauthority = approvalauthority;
    if (expect_price) filter.expect_price = expect_price;
    if (booking_tokenamount) filter.booking_tokenamount = booking_tokenamount;
    if (floor_no) filter.floor_no = floor_no;
    if (customerId) filter.customerId = customerId;
    if (customerNumber) filter.customerNumber = customerNumber;
    if (office_seats) filter.office_seats = Number(office_seats);
    if (acre) filter.acre = acre;
    if (kunte) filter.kunte = kunte;
    if (diet) filter.diet = diet;
    if (bachelor_allowed) filter.bachelor_allowed = bachelor_allowed;
    if (occupancy_type) filter.occupancy_type = occupancy_type;
    if (food_provided) filter.food_provided = food_provided;
    if (profession_Type) filter.profession_Type = profession_Type;

    if (address) filter.address = new RegExp(address, "i");
    if (landmark) filter.landmark = new RegExp(landmark, "i");
    if (customerName) filter.customerName = new RegExp(customerName, "i");

    if (favorite !== undefined)
      filter.favorite = favorite === true || favorite === "true";
    if (reraregistered !== undefined)
      filter.reraregistered =
        reraregistered === true || reraregistered === "true";

    if (googleaddress?.lat && googleaddress?.long) {
      filter["googleaddress.lat"] = googleaddress.lat;
      filter["googleaddress.long"] = googleaddress.long;
    }

    if (Array.isArray(amenities) && amenities.length > 0) {
      filter.amenities = {
        $elemMatch: {
          name: { $in: amenities },
        },
      };
    }

    if (Array.isArray(nearbyplace) && nearbyplace.length > 0) {
      filter.nearbyplace = {
        $elemMatch: {
          $or: nearbyplace.map((place) => {
            const match = {};
            if (place.category) match.category = place.category;
            if (place.place_name) match.place_name = place.place_name;
            if (place.distance) match.distance = place.distance;
            return match;
          }),
        },
      };
    }

    const properties = await Property.find(filter);
    res.status(200).json(properties);
  } catch (error) {
    console.error("Search Properties Error:", error);
    res.status(500).json({ message: "Error searching properties" });
  }
};
