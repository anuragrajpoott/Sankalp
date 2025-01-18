const category = require("../models/category");

exports.createCategory = async(req,res)=>{
    try {
        const {name,description} = req.body;

        if(!name || !description){
             return res.status(400).json({
                success:false,
                message:"fill all category details"
             })
        }

        const categoryDetails = await category.create({
            name:name,
            description:description
        })

        res.status(200).json({
            success:true,
            message:"category created successfully",
            categoryDetails
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while creating category"
        })
    }
}


exports.showAllCategory = async (req,res) => {
    try {
        const allCategory = await category.find({},{name:true,desctription:true})
        res.status(200).json({
            success:true,
            message:"showing all category",
            allCategory
        })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            success:false,
            message:`error while showing all category... ${error}`
        })
    }
}



exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get courses for the specified category
      const selectedCategory = await category.findById(categoryId)
        .populate({
          path: "course",
          match: {
             status: "Published" 
            },
          populate: "ratingAndReview",
        })
        .exec()
  
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }

      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      const categoriesExceptSelected = await category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "course",
          match: { status: "Published" },
        })
        .exec()
      
      // Get top-selling courses across all categories
      const allCategories = await category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
  
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error while fetching catefory page details",
        error: error.message,
      })
    }
  }
  