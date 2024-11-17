import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PrismaService } from "./prisma/prisma.service";
import { Response } from "express";
import { env } from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  // Habilitar CORS para localhost y un dominio futuro
  app.enableCors({
    origin: env.CORS_ALLOWED_ORIGINS.split(",").map(origin => origin.trim()),
    methods: env.CORS_ALLOWED_METHODS.split(",").map(method => method.trim()),
    allowedHeaders: env.CORS_ALLOWED_HEADERS.split(",").map(header => header.trim()),
    credentials: true,
  });

  // Usar un ValidationPipe global para validaciones automáticas de DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("NicaWallet API")
    .setDescription("API para la gestión de finanzas personales - NicaWallet")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Middleware para redirigir desde la raíz a la documentación de Swagger
  app.use("/", (req: { path: string }, res: Response, next: () => void) => {
    if (req.path === "/") {
      res.send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a NicaWallet API</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #2c3e50;
            }
            p {
              margin: 10px 0;
            }
            a {
              text-decoration: none;
              color: #3498db;
              font-weight: bold;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bienvenido a NicaWallet API</h1>
            <p>Accede a la <a href="/api/docs">documentación de Swagger</a>.</p>
          </div>
        </body>
      </html>
    `);
    } else {
      next(); // Deja que otras rutas continúen normalmente
    }
  });

  // Servicio de Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Escuchar en el puerto 3000
  await app.listen(process.env.PORT || 3000);
}

bootstrap()
  .then(() => console.log("NicaWallet API running!"))
  .catch(err => console.error("ERROR:", err));
