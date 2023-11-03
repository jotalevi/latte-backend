import { Controller, Post } from '@nestjs/common';

@Controller()
export class UserController {
  constructor() {}

  @Post('login')
  loginUser() {}

  @Post('register')
  registerUser() {}

  @Post('getFavs')
  getFavs() {}

  @Post('setFavs')
  setFavs() {}

  @Post('getSeen')
  getSeen() {}

  @Post('setSeen')
  setSeen() {}
}
