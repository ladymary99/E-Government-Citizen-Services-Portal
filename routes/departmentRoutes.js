const express = require("express");
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { validate, departmentSchema } = require("../middleware/validation");

// Public routes
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);

// Admin only routes
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  validate(departmentSchema),
  createDepartment
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  validate(departmentSchema),
  updateDepartment
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteDepartment
);

module.exports = router;
