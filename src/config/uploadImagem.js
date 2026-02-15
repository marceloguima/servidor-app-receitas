// src/config/uploadImagem.js (ou src/middlewares/uploadImagem.js)

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// 1. Carrega as variáveis de ambiente do arquivo .env (suas senhas)
dotenv.config();

// 2. Apresenta o seu Backend para o Cloudinary usando suas credenciais
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. Configura a "caixa" (storage) onde o multer vai guardar as fotos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // Nome da pasta que será criada automaticamente lá no seu Cloudinary
    folder: 'chefinho_receitas', 
    
    // Formatos de imagem permitidos (evita que subam PDFs ou vírus, por exemplo)
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'], 
    
    // Transforma a imagem para um tamanho padrão (Opcional, mas recomendado para não pesar o banco)
    transformation: [{ width: 800, height: 600, crop: 'limit' }] 
  },
});

// 4. Cria o "carteiro" (middleware) do multer usando a caixa configurada acima
const upload = multer({ storage: storage });

// 5. Exporta o carteiro para usarmos lá nas rotas de receitas
export default upload;