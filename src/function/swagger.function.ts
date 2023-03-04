import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "src/app.module"
import { AuthManagerialModule } from "src/modules/auth/managerial/auth.managerial.module"

export function setSwagger(app: INestApplication)
{
    // Swagger Public API
    const swaggerConfigPublicAPI = new DocumentBuilder()
        .addBearerAuth()
        .setTitle(process.env.SWAGGER_PUBLIC_TITLE)
        .setDescription(process.env.SWAGGER_PUBLIC_DESCRIPTION)
        .setVersion(process.env.SWAGGER_PUBLIC_API_VERSION)
        .addTag(process.env.SWAGGER_PUBLIC_TAG)
        .build()
    const swaggerDocumentPublicAPI = SwaggerModule.createDocument(app, swaggerConfigPublicAPI, {
        include: [ AppModule,AuthManagerialModule],
    })
    SwaggerModule.setup(process.env.SWAGGER_PUBLIC_SETUP_URL_PATH, app, swaggerDocumentPublicAPI)

    // Swagger Private API
    const swaggerConfigPrivateAPI = new DocumentBuilder()
        .addBearerAuth()
        .setTitle(process.env.SWAGGER_PRIVATE_TITLE)
        .setDescription(process.env.SWAGGER_PRIVATE_DESCRIPTION)
        .setVersion(process.env.SWAGGER_PRIVATE_API_VERSION)
        .addTag(process.env.SWAGGER_PRIVATE_TAG)
        .build()
    const swaggerDocumentPrivateAPI = SwaggerModule.createDocument(app, swaggerConfigPrivateAPI, {
        include: [ ],
    })
    SwaggerModule.setup(process.env.SWAGGER_PRIVATE_SETUP_URL_PATH, app, swaggerDocumentPrivateAPI)
}