# File Uploader

File Uploader is a **full-stack file management app** that enables authenticated users to securely upload, organize and manage files using cloud storage.
<br><br>

## Project Overview

- Built as a hands-on project to explore **file uploads and cloud storage**
- Focused on working with Prisma ORM, Multer, and Cloudinary in a full-stack environment
- Implements **authentication and authorization**, ensuring users can only access their own data
- Stores files on **Cloudinary** with metadata managed in a PostgreSQL database

## Features

- Secure session-based authentication with protected routes
- Create, edit, delete, and view folders
- Upload files directly or into specific folders
- View file details with in-app preview support
- Download files directly via Cloudinary URLs
- Server-side file validation for type and 8MB size limit

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** EJS, Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Passport.js, express-session, bcryptjs
- **File Uploads:** Multer, multer-storage-cloudinary
- **Cloud Storage:** Cloudinary
- **Other:** express-validator, express-ejs-layouts

## Project Structure

```
file-uploader/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── generated/
│   └── prisma/
├── src/
│   ├── config/
│   │   ├── multer.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   └── folderController.js
│   ├── lib/
│   │   ├── parseId.js
│   │   └── prisma.js
│   ├── middlewares/
│   │   └── requireAuth.js
│   ├── public/
│   │   ├── input.css
│   │   └── output.css
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── fileRoutes.js
│   │   └── folderRoutes.js
│   ├── validators/
│   │   └── authValidatior.js
│   ├── views/
│   │   ├── files/
│   │   │   ├── index.ejs
│   │   │   ├── show.ejs
│   │   │   └── upload.ejs
│   │   ├── folders/
│   │   │   ├── create.ejs
│   │   │   ├── edit.ejs
│   │   │   ├── index.ejs
│   │   │   └── show.ejs
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   └── footer.ejs
│   │   ├── errorPage.ejs
│   │   ├── index.ejs
│   │   ├── layout.ejs
│   │   ├── login.ejs
│   │   └── signup.ejs
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── prisma.config.js
└── tailwind.config.js
```

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/imanabshar/file-uploader.git
cd file-uploader
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file in the root directory:**
```env
PORT=your_port
DATABASE_URL=your_postgres_connection_url
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Set up the database:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start the project:**
```bash
npm start
```

## 🔗 Live Link

**View Live Website:** https://file-uploader-rq4s.onrender.com
