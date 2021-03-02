export class Login {
  static readonly type = '[user] logins';
  constructor() {}
}
export class Logout {
  static readonly type = '[user] logouts';
  constructor() {}
}
export class CheckAuth {
  static readonly type = '[user] checks auth';
  constructor() {}
}
export class AuthFail {
  static readonly type = '[user] has auth failed';
  constructor() {}
}
export class UserName {
  static readonly type = '[user] name added';
  constructor() {}
}
export class Role {
  static readonly type = '[role] added';
  constructor() {}
}