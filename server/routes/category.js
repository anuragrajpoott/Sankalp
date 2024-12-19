const express = require("express")
const router = express.Router()
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
  } = require("../controllers/category")
  const { auth, isAdmin } = require("../middleware/auth")

  router.post("/createCategory", auth, isAdmin, createCategory)

  router.get("/showAllCategories", showAllCategories)

  router.post("/getCategoryPageDetails", categoryPageDetails)

  module.exports = router