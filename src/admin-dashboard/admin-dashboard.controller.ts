import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminDashBoardService } from './admin-dashboard.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/interface/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('admin-dashboard')
export class AdminDashBoardController {
  constructor(private adminDashboardService: AdminDashBoardService) {}

  @Roles(Role.ADMIN)
  @Get('/getUsers')
  findAllUsers() {
    return this.adminDashboardService.getUsers();
  }

  @Roles(Role.ADMIN)
  @Get('/getUsers/:userId')
  findUserById(@Param('userId') userId: string) {
    return this.adminDashboardService.getUserById(userId);
  }
}
