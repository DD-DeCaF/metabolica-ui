

export default function GenotypeFactory(potion, Item, Route) {
    class Genotype extends Item {
        static formatGnomicAsText = Route.GET('/format-gnomic-as-text');
        static formatGnomicAsHTML = Route.GET('/format-gnomic-as-html');
        static gnomicToGenotype = Route.GET('/gnomic-to-genotype');
    }
    return potion.register('/genotype', Genotype);
}
