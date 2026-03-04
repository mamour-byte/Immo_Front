#!/bin/bash
# Installation script for Property Page Refactoring

echo "🚀 Installation du Refactoring Property Page"
echo "=============================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js et npm."
    exit 1
fi

echo "✅ npm détecté"
echo ""

# Install react-helmet-async
echo "📦 Installation de react-helmet-async..."
npm install react-helmet-async

if [ $? -eq 0 ]; then
    echo "✅ react-helmet-async installé avec succès!"
else
    echo "❌ Erreur lors de l'installation"
    exit 1
fi

echo ""
echo "🎉 Installation complète!"
echo ""
echo "Prochaines étapes:"
echo "1. npm run dev"
echo "2. Accédez à http://localhost:5173/property/1"
echo "3. Vérifiez le SEO avec F12 > Elements > head"
echo ""
echo "📖 Documentation:"
echo "   - QUICKSTART.md"
echo "   - REFACTORING_PROPERTY.md"
echo "   - INSTALLATION_SETUP.md"
echo "   - ARCHITECTURE.txt"
echo ""
