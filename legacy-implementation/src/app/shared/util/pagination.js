export class MdDataPagination {
    constructor($scope,
                ResourceType) {

        this._$scope = $scope;
        this._ResourceType = ResourceType;
    }

    setup({
            itemsPropName = 'items',
            onPaginationChangePropName = 'onPaginationChange',
            onOrderChangePropName = 'onOrderChange',
            queryPropName = 'query',
            query = {}
            } = {}) {
        this._itemsPropName = itemsPropName;
        this._queryPropName = queryPropName;

        this[itemsPropName] = [];
        this[queryPropName] = {
            options: query.options || [10, 25, 50],
            get sort() {
                return getSortValue(this.order);
            },
            page: query.page || 1,
            perPage: query.perPage || 10,
            order: query.order,
            where: query.where
        };

        this[onOrderChangePropName] = this.onOrderChange.bind(this);
        this[onPaginationChangePropName] = this.onPaginationChange.bind(this);

        let {where, page, perPage, sort} = this[queryPropName];
        this.promise = this._ResourceType
            .query({where, page, perPage, sort}, {cache: false, paginate: true})
            .then(async(items) => {
                this.setItems(items.toArray());
                this._$scope.$applyAsync(() => {
                    Object.assign(this[queryPropName], {
                        pages: items.pages,
                        total: items.total
                    });
                });
            });
    }

    setItems(items) {
        this._$scope.$applyAsync(() => {
            this[this._itemsPropName] = items;
        });
    }

    async updateItems(where, page, perPage, sort) {
        this.promise = this._ResourceType.query({where, page, perPage, sort}, {cache: false});
        let items = await this.promise;
        this.setItems(items);
    }

    // Use passed arguments instead of local scope,
    // see https://github.com/daniel-nagy/md-data-table#pagination
    async onOrderChange(order) {
        let {where, page, perPage} = this[this._queryPropName];
        this.promise = this.updateItems(where, page, perPage, getSortValue(order));
        await this.promise;
    }

    // Use passed arguments instead of local scope,
    // see https://github.com/daniel-nagy/md-data-table#pagination
    async onPaginationChange(page, perPage) {
        let {where, sort} = this[this._queryPropName];
        this.promise = this.updateItems(where, page, perPage, sort);
        await this.promise;
    }
}

function getSortValue(order) {
    if (!order) {
        return undefined;
    } else if (order.charAt(0) == '-') {
        return {[order.substring(1)]: true}
    } else {
        return {[order]: false}
    }
}

export class MdDataTableStatefulPagination extends MdDataPagination {
    constructor($state,
                $stateParams,
                $scope,
                ResourceType) {
        super($scope, ResourceType);
        this._$state = $state;
        this._$stateParams = $stateParams
    }

    setup({
            itemsSetter = null,
            itemsPropName = 'items',
            onPaginationChangePropName = 'onPaginationChange',
            onOrderChangePropName = 'onOrderChange',
            queryPropName = 'query',
            query = {}
            } = {}) {
        super.setup({
            itemsSetter,
            itemsPropName,
            onPaginationChangePropName,
            onOrderChangePropName,
            queryPropName,
            query: Object.assign(query, {
                page: this._$stateParams.page || 1,
                perPage: this._$stateParams.per_page || query.perPage || 10,
                order: this._$stateParams.order
            })
        })
    }

    // Use passed arguments instead of local scope,
    // see https://github.com/daniel-nagy/md-data-table#pagination
    async onPaginationChange(page, perPage) {
        let {where, sort} = this[this._queryPropName];
        this._$state.go(this._$state.current, {page, per_page: perPage}, {notify: false});
        this.promise = this.updateItems(where, page, perPage, sort);
        await this.promise;
    }

    // Use passed arguments instead of local scope,
    // see https://github.com/daniel-nagy/md-data-table#pagination
    async onOrderChange(order) {
        let {where, page, perPage} = this[this._queryPropName];
        this._$state.go(this._$state.current, {order}, {notify: false});
        this.promise = this.updateItems(where, page, perPage, getSortValue(order));
        await this.promise;
    }
}
