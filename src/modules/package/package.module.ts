import { PrismaModule } from "@/infra/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { CreatePackageController } from "./controllers/create-package.controller";
import { FindManyPackagesController } from "./controllers/find-many-packages.controller";
import { FindOnePackageController } from "./controllers/find-one-package.controller";
import { SoftDeletePackageController } from "./controllers/soft-delete-package.controller";

import { ToggleActivePackageController } from "@/modules/package/controllers/toggle-active-package.controller";
import { CreatePackageService } from "./services/create-package.service";
import { FindManyPackagesService } from "./services/find-many-packages.service";
import { FindOnePackageService } from "./services/find-one-package.service";
import { SoftDeletePackageService } from "./services/soft-delete-package.service";
import { ToggleActivePackageService } from "./services/toggle-active-package.service";

@Module({
  imports: [PrismaModule],
  controllers: [
    CreatePackageController,
    FindManyPackagesController,
    FindOnePackageController,
    SoftDeletePackageController,
    ToggleActivePackageController,
  ],
  providers: [
    CreatePackageService,
    FindManyPackagesService,
    FindOnePackageService,
    SoftDeletePackageService,
    ToggleActivePackageService,
  ],
})
export class PackageModule {}
