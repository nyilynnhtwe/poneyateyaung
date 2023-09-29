import { SetMetadata } from '@nestjs/common';
import { Role } from './interface/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('role', roles);
