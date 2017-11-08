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
  readPermissions = Route.GET('/permissions');
  readSummary = Route.GET('/summary');
  defaultTests = Route.GET('/default-tests');
  updateDefaultTests = Route.POST('/update-default-tests');
}

export class ProjectMembership extends Item {
}

export class Medium extends Item {
  readContents = Route.GET('/contents');
  updateContents = Route.POST('/contents');
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



