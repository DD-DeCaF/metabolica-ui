// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



export default function GenotypeFactory(potion, Item, Route) {
    class Genotype extends Item {
        static formatGnomicAsText = Route.GET('/format-gnomic-as-text');
        static formatGnomicAsHTML = Route.GET('/format-gnomic-as-html');
        static gnomicToGenotype = Route.GET('/gnomic-to-genotype');
        static formatFeatureAsText = Route.GET('/format-feature-as-text');
        static formatFeatureAsHTML = Route.GET('/format-feature-as-html');
    }
    return potion.register('/genotype', Genotype);
}
