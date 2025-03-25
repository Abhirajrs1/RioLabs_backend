import { User } from "../Models/userCollection.js";
import { Category } from "../Models/categoryCollection.js";
import { Products } from "../Models/productCollection.js";

const adminController = {
    getAllUsers: async (req, res) => {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({ success: false, message: "Access denied" });
            }
            const users = await User.find({ role: "user" });
            return res.status(200).json({ success: true, users });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    changeUserToAdmin: async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        console.log(id, "ID")
        console.log(role, "ROle")
        try {
            await User.findByIdAndUpdate(id, { role });
            res.status(200).json({ message: 'User role updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update role' });
        }
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Category name is required' });
            }

            const existingCategory = await Category.findOne({ name: name.trim() });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category already exists' });
            }

            const category = new Category({ name: name.trim() });
            await category.save();

            res.status(201).json({ message: 'Category added successfully', category });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find().sort({ createdAt: -1 });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Category name is required' });
            }

            const updatedCategory = await Category.findByIdAndUpdate(id, { name: name.trim() }, { new: true });

            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    getProducts: async (req, res) => {
        try {
            const products = await Products.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    },
    addProducts: async (req, res) => {
        try {            
            const { name, category, price } = req.body;
            const newProduct = new Products({
                name,
                category,
                price,
            });
          
           let ans= await newProduct.save();
           
           
            res.status(201).json({ message: "Product added successfully", product: newProduct });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add product' });
        }
    },
    editProducts: async (req, res) => {
        try {
            const { name, category, price } = req.body;
    
            const existingProduct = await Products.findById(req.params.id);
            if (!existingProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
    
            let updatedData = {
                name: name || existingProduct.name,
                category: category || existingProduct.category,
                price: price || existingProduct.price
            };

    
            const updatedProduct = await Products.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    
            res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update product' });
        }
    },
    getProductById: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
}
export default adminController