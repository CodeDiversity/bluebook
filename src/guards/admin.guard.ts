import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if(!request.currentUser){
      return false;
    }
    const user = request.currentUser;
    return user.admin;
  }
}