import {Item, PotionResources, Route} from 'potion-client';


export class Organization extends Item {
}

export class Group extends Item {
}

export class User extends Item {
  static current = Route.GET('/me');
  static readSettings = Route.GET('/settings');
  static updateSettings = Route.POST('/settings');
  static roles = Route.GET('/roles');
  static changePassword = Route.POST('/change-password');

  displayName: string;
  title: string;

  shortFullName() {
    return `${(this.firstName || '').split(' ')[0]} ${this.lastName}`;
  }
}

export class PersonalToken extends Item {
}

export class GroupMembership extends Item {
}

export class Project extends Item {
  static readPermissions = Route.GET('/permissions');
  static readSummary = Route.GET('/summary');
  static defaultTests = Route.GET('/default-tests');
  static updateDefaultTests = Route.POST('/update-default-tests');
}

export class ProjectMembership extends Item {
}

export class Medium extends Item {
  static readContents = Route.GET('/contents');
  static updateContents = Route.POST('/contents');
}


export const resources: PotionResources = {
  '/organization': Organization,
  '/group': Group,
  '/user': User,
  '/personal-token': PersonalToken,
  '/group-membership': GroupMembership,
  '/project': Project,
  '/project-membership': ProjectMembership,
  '/medium': Medium
};



