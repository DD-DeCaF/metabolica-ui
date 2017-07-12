

export default function GenotypeFactory(potion, Item, Route) {
    class Genotype extends Item {
        static formatGnomicAsText = Route.GET('/format-gnomic-as-text');
        static formatGnomicAsHTML = Route.GET('/format-gnomic-as-html');
        static gnomicToGenotype = Route.GET('/gnomic-to-genotype');
        static formatFeatureAsText = Route.GET('/format-feature-as-text');
        static formatFeatureAsHTML = Route.GET('format-feature-as-html');
    }
    return potion.register('/genotype', Genotype);
}
