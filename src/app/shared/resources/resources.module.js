import angular from 'angular';

import 'reflect-metadata'; // used by 'potion-client'
import {Item, Route} from 'potion-client/angular';

import {Genotype} from 'gnomic-grammar'; // TODO remove dependency, use service instead.
import {Aggregate, Test} from './legacy/types';
import {Variant} from './legacy/variant';

export const ResourcesModule = angular
    .module('shared.resources', ['potion']);

/**
 * User Management
 */

ResourcesModule.factory('Group', GroupFactory);
function GroupFactory(potion) {
    class Group extends Item {
    }
    return potion.register('/group', Group);
}


ResourcesModule.factory('User', UserFactory);
function UserFactory(potion) {
    class User extends Item {
        static current = Route.GET('/me');
        static readSettings = Route.GET('/settings');
        static updateSettings = Route.POST('/settings');
        static roles = Route.GET('/roles');
        static changePassword = Route.POST('/change-password');

        shortFullName() {
            return `${(this.firstName || '').split(' ')[0]} ${this.lastName}`;
        }
    }
    return potion.register('/user', User);
}

ResourcesModule.factory('PersonalToken', PersonalTokenFactory);
function PersonalTokenFactory(potion, User) {
    class PersonalToken extends Item {
    }
    return potion.register('/personal-token', PersonalToken);
}

ResourcesModule.factory('GroupMembership', GroupMembershipFactory);
function GroupMembershipFactory(potion, Group, User) {
    class GroupMembership extends Item {
    }
    return potion.register('/group-membership', GroupMembership);
}


/**
 * Projects
 */

ResourcesModule.factory('Project', ProjectFactory);
function ProjectFactory(potion, Experiment, ExperimentPhase, Strain, Pool, Plate, Sample, Device, Organism, GenomeDiff, DNAComponent, Medium, ChemicalEntity) {
    // NOTE injects are there to work around AngularJS circular dependency resolution issues
    class Project extends Item {
        readPermissions = Route.GET('/permissions');
        readSummary = Route.GET('/summary');
    }
    return potion.register('/project', Project);
}

ResourcesModule.factory('ProjectMembership', ProjectMembershipFactory);
function ProjectMembershipFactory(potion, User, Project) {
    class ProjectMembership extends Item {
    }
    return potion.register('/project-membership', ProjectMembership);
}


/**
 * Chemical Entities
 */

ResourcesModule.factory('ChemicalEntity', ChemicalEntityFactory);
function ChemicalEntityFactory(potion) {
    class ChemicalEntity extends Item {
        getChEBIURL() {
            return `http://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${this.chebiId}`;
        }
    }

    return potion.register('/chemical-entity', ChemicalEntity, {
        readonly: ['createdBy', 'createdAt', 'updatedAt']
    });
}


/**
 * Media
 */

ResourcesModule.factory('Medium', MediumFactory);
function MediumFactory(potion, User) {
    class Medium extends Item {
        readContents = Route.GET('/contents');
        updateContents = Route.POST('/contents');
    }

    return potion.register('/medium', Medium, {
        readonly: ['createdBy', 'createdAt', 'updatedAt']
    });
}


/**
 * Variants
 */

ResourcesModule.factory('DNAComponent', DNAComponentFactory);
function DNAComponentFactory(potion, User) {
    class DNAComponent extends Item {
        equals(component) {
            if (component instanceof DNAComponent) {
                return this.id === component.id;
            }

            return false;
        }
    }

    return potion.register('/component', DNAComponent, {
        readonly: ['createdBy', 'createdAt', 'updatedAt']
    });
}

ResourcesModule.factory('GenomeDiff', GenomeDiffFactory);
function GenomeDiffFactory(potion, User, Experiment, Sample) {
    class GenomeDiff extends Item {
        _readItems = Route.GET('/items');
        static search = Route.GET('/search');

        async readItems(...args) {
            let items = await this._readItems(...args);
            return items.map((item) => new Variant(item));
        }

        get name() {
            return (this.strain && this.strain.identifier) || this.pool.identifier;
        }

        match(gd) {
            if (gd instanceof GenomeDiff) {
                return gd.name === this.name;
            }

            return false;
        }
    }

    return potion.register('/variants', GenomeDiff, {
        readonly: ['experiment', 'createdBy', 'createdAt', 'updatedAt']
    });
}


/**
 * Organisms
 */

ResourcesModule.factory('Organism', OrganismFactory);
function OrganismFactory(potion) {
    class Organism extends Item {
    }
    return potion.register('/organism', Organism);
}


/**
 * Devices
 */

ResourcesModule.factory('Device', DeviceFactory);
function DeviceFactory(potion) {
    class Device extends Item {
    }
    return potion.register('/device', Device);
}


/**
 * Samples
 */

ResourcesModule.factory('Sample', SampleFactory);
function SampleFactory(potion, Experiment, Medium, Plate, Strain) {
    class Sample extends Item {
        static aggregateTests = Route.GET('/aggregate-tests');
        static _aggregateScalars = Route.GET('/aggregate-scalars');

        static async aggregateScalars(...args) {
            return new Aggregate(await this._aggregateScalars(...args))
        }

        _readSeries = Route.GET('/series');

        async readSeries(...args) {
            let series = await this._readSeries(...args);
            return series.map((item) => Object.assign(item, {
                test: new Test(item.test),
                sample: this
            }));
        }

        labelAsText() {
            let {plate, strain, name, position, medium} = this;
            let prefix;

            if (name) {
                prefix = `"${name}" `;
            } else {
                prefix = '';
            }

            if (strain) {
                let {identifier} = strain;
                if (medium && !name) {
                    return `${prefix}${identifier} (${medium.identifier})`;
                } else {
                    return `${prefix}${identifier}`;
                }
            } else if (plate) {
                return `${prefix}${plate.barcode}:${position}`;
            }
        }
    }
    return potion.register('/sample', Sample);
}


/**
 * Plates
 */

ResourcesModule.factory('Plate', PlateFactory);
function PlateFactory(potion, User) {
    class Plate extends Item {
        static readTypes = Route.GET('/types');

        createClone = Route.POST('/clone');
        readContents = Route.GET('/contents');
        writeContents = Route.POST('/contents');
        readSamples = Route.GET('/samples');

        get typeDefinition() {
            return Plate.readTypes().then((definitions) => new Map(definitions.map(definition => [definition.type, definition]))).get(this.type)
        }
    }

    return potion.register('/plate', Plate, {
        readonly: ['createdAt', 'createdBy', 'updatedAt', '$archived']
    });
}


/**
 * Pools
 */

ResourcesModule.factory('Pool', PoolFactory);
function PoolFactory(potion, $cacheFactory, User, Strain, Medium, ChemicalEntity) {
    const cache = $cacheFactory('pool-genotype');

    const POOL_TYPES = {
        ale_population: 'ALE population',
        ale_strain: 'ALE strain',
        library: 'library',
        design: 'design'
    };

    class Pool extends Item {

        get typeAsText() {
            return POOL_TYPES[this.type] || this.type
        }

        get fullGenotypeObject() {
            // Try to get the genotype from cache
            let cached = cache.get(this.identifier);
            if (cached) {
                return cached;
            }

            let parent = null;
            if (this.parentPool) {
                parent = this.parentPool.fullGenotypeObject;
            }

            return cache.put(this.identifier, Genotype.parse(this.genotype || '', {parent}));
        }

        get genotypeObject() {
            // Try to get the genotype from cache
            let cached = cache.get(this.genotype);
            if (cached) {
                return cached;
            }

            if (!this.genotype) {
                return null;
            }

            return cache.put(this.genotype, Genotype.parse(this.genotype));
        }

        readSamples = Route.GET('/samples');
        static lineage = Route.GET('/lineage');
        static searchByGenotype = Route.GET('/search-by-genotype');
    }

    return potion.register('/pool', Pool, {
        readonly: ['createdAt', 'createdBy', 'updatedAt']
    });
}


/**
 * Strains
 */

ResourcesModule.factory('Strain', StrainFactory);
function StrainFactory(potion, $cacheFactory, User, Organism) {
    const cache = $cacheFactory('strain-genotype');

    class Strain extends Item {
        get fullGenotypeObject() {
            // Try to get the genotype from cache
            let cached = cache.get(this.identifier);
            if (cached) {
                return cached;
            }

            let parent = null;
            if (this.parentStrain) {
                parent = this.parentStrain.fullGenotypeObject;
            } else {
                parent = this.pool.fullGenotypeObject;
            }

            return cache.put(this.identifier, Genotype.parse(this.genotype || '', {parent}));
        }

        get genotypeObject() {
            let genotype = this.genotype || this.pool.genotype;

            // Try to get the genotype from cache
            let cached = cache.get(genotype);
            if (cached) {
                return cached;
            }

            if (!genotype) {
                return null;
            }

            // Cache the genotype
            return cache.put(genotype, Genotype.parse(genotype));
        }

        readSamples = Route.GET('/samples');

        designIsFromPool() {
            return !this.genotype && this.pool.genotype;
        }

        toString() {
            return this.identifier;
        }
    }

    return potion.register('/strain', Strain, {
        readonly: ['createdAt', 'createdBy', 'updatedAt']
    });
}


/**
 * Experiments
 */

ResourcesModule.factory('Experiment', ExperimentFactory);
function ExperimentFactory(potion, User, Device) {
    class Experiment extends Item {
        static readCompartmentTypes = Route.GET('/compartment-types');
        readSamples = Route.GET('/samples');
        addSamples = Route.POST('/samples');

        _readScalarTable = Route.GET('/scalar-table');

        async readScalarTable(...args) {
            let data = await this._readScalarTable(...args);
            return {aggregate: new Aggregate(data), total: data.total}
        }

        listDataShapes = Route.GET('/list-data-shapes');

        readScalarMeasurementTests = Route.GET('/scalar-measurement-tests');
        readSeriesMeasurementTests = Route.GET('/series-measurement-tests');

        readSamplesWithSeries = Route.GET('/samples-with-series');

        static containing = Route.GET('/containing');
    }

    return potion.register('/experiment', Experiment, {
        readonly: ['createdAt', 'createdBy', 'updatedAt']
    });
}

ResourcesModule.factory('ExperimentPhase', ExperimentPhaseFactory);
function ExperimentPhaseFactory(potion) {
    class ExperimentPhase extends Item {
        _aggregateScalars = Route.GET('/aggregate-scalars');

        async aggregateScalars(...args) {
            return new Aggregate(await this._aggregateScalars(...args))
        }
    }
    return potion.register('/experiment-phase', ExperimentPhase);
}


/**
 * Project Management
 */

ResourcesModule.factory('Board', BoardFactory);
function BoardFactory(potion, User, Project) {
    class Board extends Item {
    }
    return potion.register('/board', Board, {
        readonly: ['createdAt', 'createdBy', 'updatedAt', 'updatedBy']
    });
}

ResourcesModule.factory('Task', TaskFactory);
function TaskFactory(potion, Group, User, Board, Project) {
    class Task extends Item {
        readHistory = Route.GET('/history');
        readSubscription = Route.GET('/subscription');
        subscribe = Route.POST('/subscription');
        unsubscribe = Route.DELETE('/subscription');

        assignTo(user) {
            return this.update({
                assignedUser: user
            });
        }

        assignToNobody() {
            return this.update({
                assignedGroup: null,
                assignedUser: null
            });
        }

        start(started = true) {
            return this.update({
                status: started ? 'started' : 'open'
            });
        }

        complete(completed = true) {
            return this.update({
                status: completed ? 'done' : 'started'
            });
        }

        canEdit(user, project) {
            if (project != null) {
                return project.permissions.update;
            }
        }

        canDelete(user, project) {
            if (project != null) {
                return project.permissions.update;
            }
        }

        isOverdue() {
            if (!this.dueDate) {
                return false;
            } else if (this.status !== 'done') {
                return this.dueDate < new Date();
            } else {
                return false;
            }
        }
    }

    return potion.register('/task', Task, {
        readonly: ['createdBy', 'createdAt', 'updatedAt']
    });
}

ResourcesModule.factory('TaskComment', TaskCommentFactory);
function TaskCommentFactory(potion, User, Task) {
    class TaskComment extends Item {
    }
    return potion.register('/task-comment', TaskComment, {
        readonly: ['createdBy', 'createdAt', 'updatedAt']
    });
}
