import {Item, PotionResources, Route} from 'potion-client';

// resources in alphabetical order

export class ChemicalEntity extends Item {
  getChEBIURL () {
    return `http://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${this.chebiId}`;
  }
}

export class Experiment extends Item {
  static readCompartmentTypes = Route.GET('/compartment-types');
  static containing = Route.GET('/containing');

  readSamples = Route.GET('/samples');
  listDataShapes = Route.GET('/list-data-shapes');
  readScalarMeasurementTests = Route.GET('/scalar-measurement-tests');
  readSeriesMeasurementTests = Route.GET('/series-measurement-tests');
  readSamplesWithSeries = Route.GET('/samples-with-series');
}

export class Group extends Item {
}

export class GroupMembership extends Item {
}

export class Medium extends Item {
  readContents = Route.GET('/contents');
  updateContents = Route.POST('/contents');
}

export class Organization extends Item {
}

export class PersonalToken extends Item {
}

export class Pool extends Item {
  static lineage = Route.GET('/lineage');
  static searchByGenotype = Route.GET('/search-by-genotype');
  static compareGenotypes = Route.POST('/compare-genotypes');
  static findByExperiments = Route.GET('/find-by-experiments');

  readSamples = Route.GET('/samples');

  POOL_TYPES = {
    ale_population: 'ALE population',
    ale_strain: 'ALE strain',
    library: 'library',
    design: 'design'
  };

  get typeAsText() {
    return this.POOL_TYPES[this.type] || this.type;
  }

  get fullGenotype() {
    // todo: caching
    if (this.parentPool) {
      return [this.parentPool.fullGenotype || '', this.genotype || ''].join(' ');
    } else {
      return this.genotype || '';
    }
  }
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

export class Project extends Item {
  readPermissions = Route.GET('/permissions');
  readSummary = Route.GET('/summary');
  defaultTests = Route.GET('/default-tests');
  updateDefaultTests = Route.POST('/update-default-tests');
}

export class ProjectMembership extends Item {
}

export const resources: PotionResources = {
  '/organization': Organization,
  '/group': Group,
  '/user': User,
  '/personal-token': PersonalToken,
  '/group-membership': GroupMembership,
  '/project': Project,
  '/project-membership': ProjectMembership,
  '/medium': Medium,
  '/chemical-entity': ChemicalEntity,
  '/pool': Pool,
  '/experiment': Experiment
};



