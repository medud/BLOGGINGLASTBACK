const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); 
const CategoryEnum = require('../models/categoryEnum');

// Ajouter un blog
router.post('/add', async (req, res) => {
  try {
      console.log("Requête reçue avec le corps :", req.body); // Affiche le corps de la requête

      const { title, description, category, author, image } = req.body;
      
      if (!title || !description || !category || !author || !image) {
          console.log("Erreur : Champs manquants"); // Affiche un message si un champ est manquant
          return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      // Vérification de la catégorie
      if (!Object.values(CategoryEnum).includes(category)) {
          console.log("Erreur : Catégorie invalide"); // Affiche un message si la catégorie est invalide
          return res.status(400).json({ message: "Catégorie invalide" });
      }

      console.log("Création du nouveau blog avec les données :", { title, description, category, author, image });

      const newBlog = new Blog({ title, description, category, author, image });

      // Sauvegarde dans la base de données
      await newBlog.save();

      console.log("Blog créé avec succès :", newBlog);
      res.status(201).json(newBlog);
  } catch (error) {
      console.error("Erreur lors de la création du blog :", error); // Affiche toute l'erreur
      // Vérifiez si l'erreur a une propriété "message" ou "stack"
      const errorMessage = error.message || error.stack || JSON.stringify(error);
      res.status(500).json({ message: "Erreur lors de la création du blog", error: errorMessage });
  }
});




// Récupérer tous les blogs
router.get('/get-all', async (req, res) => {
  try {
      const blogs = await Blog.find().populate('author', 'name');  // Assurez-vous de récupérer le nom de l'auteur
      res.json(blogs);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des blogs", error });
  }
});

// Récupérer un seul blog par ID
router.get('/get/:id', async (req, res) => {
  try {
      const blog = await Blog.findById(req.params.id).populate('author', 'name');  // Assurez-vous de récupérer l'auteur
      if (!blog) return res.status(404).json({ message: "Blog non trouvé" });
      res.json(blog);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du blog", error });
  }
});

// Mettre à jour un blog
router.put('/update/:id', async (req, res) => {
  try {
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBlog) return res.status(404).json({ message: "Blog non trouvé" });
      res.json(updatedBlog);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du blog", error });
  }
});

// Supprimer un blog
router.delete('/delete/:id', async (req, res) => {
  try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
      if (!deletedBlog) return res.status(404).json({ message: "Blog non trouvé" });
      res.json({ message: "Blog supprimé avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du blog", error });
  }
});

// API de récupération des blogs simulée (à remplacer par la vraie base de données)
router.get('/get', (req, res) => {
    res.send([
        {
          "title": "Découverte de Casablanca",
          "description": "Casablanca est la plus grande ville du Maroc, connue pour son architecture moderne et ses plages.",
          "category": "Tourisme", // Exemple de catégorie, à ajuster
          "author": "John Doe", // À remplacer par un ID d'utilisateur
          "image": "https://www.guidesulysse.com/imageswebp/destinations/iStock-484506846.webp",
          "date": "2023-06-01"
        },
        {
          "title": "Les merveilles de Marrakech",
          "description": "Marrakech est une ville historique, célèbre pour ses souks, ses jardins et ses monuments.",
          "category": "Culture", // Exemple de catégorie
          "author": "Jane Smith", // À remplacer par un ID d'utilisateur
          "image": "https://www.marrakech-cityguide.com/wp-content/uploads/Marrakech-place-koutoubia-e1609154215571.jpg",
          "date": "2023-06-02"
        }
    ]);
})

module.exports = router;
