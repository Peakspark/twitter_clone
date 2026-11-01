twitter-backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── tweetController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── tweetRoutes.js
│   │   └── feedRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   └── tweetService.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
└── package.json