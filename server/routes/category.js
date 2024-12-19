const express = require("express")
const router = express.Router()
const {
  showAllCategory,
    createCategory,
    categoryPageDetails,
  } = require("../controllers/category")
  const { auth, isAdmin } = require("../middlewares/auth")

  router.post("/createCategory", auth, isAdmin, createCategory)

  router.get("/showAllCategories", showAllCategory)

  router.post("/getCategoryPageDetails", categoryPageDetails)

  module.exports = router